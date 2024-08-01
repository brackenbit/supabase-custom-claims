-- init_users
-- Set up users for demo

-- Function to programmatically create a user
-- based on code by jziggas (https://github.com/orgs/supabase/discussions/5043#discussioncomment-6191165)
-- updated for newer supabase, correct timestamps, and to populate user_metadata


DROP FUNCTION auth.create_user(text, text, text);

CREATE OR REPLACE FUNCTION auth.create_user(
        email text,
        pw text,
        fullName text
    ) RETURNS uuid AS $$
DECLARE
    user_id uuid;
    encrypted_pw text;
    user_metadata jsonb;
BEGIN
    user_id := gen_random_uuid();
    encrypted_pw := crypt(pw, gen_salt('bf'));
    user_metadata := jsonb_build_object('fullName', fullName);

    INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        )
    VALUES (
            '00000000-0000-0000-0000-000000000000',
            user_id,
            'authenticated',
            'authenticated',
            email,
            encrypted_pw,
            NOW(),
            NULL,
            NULL,
            '{"provider":"email","providers":["email"]}',
            user_metadata,
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );

    INSERT INTO auth.identities (
            id,
            user_id,
            provider_id,
            identity_data,
            provider,
            last_sign_in_at,
            created_at,
            updated_at
        )
    VALUES (
            gen_random_uuid(),
            user_id,
            user_id,
            format(
                '{"sub":"%s","email":"%s"}',
                user_id::text,
                email
            )::jsonb,
            'email',
            NULL,
            NOW(),
            NOW()
        );

    RETURN user_id;
END;

$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION auth.create_user IS 'Create a user, with parameters: email, password, fullName';


-- Create demo users
DO $$
DECLARE
    user_id uuid;
    tenantA_id BIGINT;
    tenantB_id BIGINT;
BEGIN

-- Get the tenant IDs
SELECT id
INTO tenantA_id
FROM public.tenants
WHERE tenant_name = 'Acme Widgets';

SELECT id
INTO tenantB_id
FROM public.tenants
WHERE tenant_name = 'Widgets''R''Us';

-- Alice - admin
-- CASCADE on auth.users will take care of auth.identities
DELETE FROM auth.users CASCADE
WHERE email = 'alice@example.com';

user_id := auth.create_user('alice@example.com', 'demopass123', 'Alice');

INSERT INTO public.user_roles (user_id, role)
VALUES (user_id, 'admin');

INSERT INTO public.user_tenants (user_id, tenant_id)
VALUES (user_id, tenantA_id);

-- Bob - manager
DELETE FROM auth.users CASCADE
WHERE email = 'bob@example.com';

user_id := auth.create_user('bob@example.com', 'demopass123', 'Bob');

INSERT INTO public.user_roles (user_id, role)
VALUES (user_id, 'manager');

INSERT INTO public.user_tenants (user_id, tenant_id)
VALUES (user_id, tenantA_id);

-- Charlie - user
DELETE FROM auth.users CASCADE
WHERE email = 'charlie@example.com';

user_id := auth.create_user('charlie@example.com', 'demopass123', 'Charlie');

INSERT INTO public.user_roles (user_id, role)
VALUES (user_id, 'user');

INSERT INTO public.user_tenants (user_id, tenant_id)
VALUES (user_id, tenantA_id);

-- Dave - admin
DELETE FROM auth.users CASCADE
WHERE email = 'dave@example.com';

user_id := auth.create_user('dave@example.com', 'demopass123', 'Dave');

INSERT INTO public.user_roles (user_id, role)
VALUES (user_id, 'admin');

INSERT INTO public.user_tenants (user_id, tenant_id)
VALUES (user_id, tenantB_id);

-- Erika - manager
DELETE FROM auth.users CASCADE
WHERE email = 'erika@example.com';

user_id := auth.create_user('erika@example.com', 'demopass123', 'Erika');

INSERT INTO public.user_roles (user_id, role)
VALUES (user_id, 'manager');

INSERT INTO public.user_tenants (user_id, tenant_id)
VALUES (user_id, tenantB_id);

-- Fulan - user
DELETE FROM auth.users CASCADE
WHERE email = 'fulan@example.com';

user_id := auth.create_user('fulan@example.com', 'demopass123', 'Fulan');

INSERT INTO public.user_roles (user_id, role)
VALUES (user_id, 'user');

INSERT INTO public.user_tenants (user_id, tenant_id)
VALUES (user_id, tenantB_id);

END $$;
