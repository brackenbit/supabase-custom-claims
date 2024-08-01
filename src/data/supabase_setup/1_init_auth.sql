
-- init_auth
-- Set up tables and functions for custom claims.
-- See: https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac

-- NB: Manual setup step required after running.
-- custom_access_token_hook needs to be enabled in the Supabase dashboard.
-- Authentication -> Hooks (Beta)


-- Set up types/tables for roles and permissions

-- CUSTOM TYPES
DROP TYPE IF EXISTS public.app_permission CASCADE;
CREATE TYPE public.app_permission as enum ('widgets.delete', 'widgets.update', 'widgets.insert', 'widgets.select');
DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role as enum ('admin', 'manager', 'user');

-- USER ROLES
DROP TABLE IF EXISTS public.user_roles;
CREATE TABLE public.user_roles (
    id  BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    role    app_role NOT NULL,
    UNIQUE (user_id, role)
);
COMMENT ON TABLE public.user_roles IS 'Application roles for each user.';


-- ROLE PERMISSIONS
DROP TABLE IF EXISTS public.role_permissions;
CREATE TABLE public.role_permissions (
    id      BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    role    app_role NOT NULL,
    permission  app_permission NOT NULL,
    UNIQUE (role, permission)
);
COMMENT ON TABLE public.role_permissions IS 'Application permissions for each role.';

-- ROLE/PERMISSIONS MAPPING
INSERT INTO public.role_permissions (role, permission)
VALUES
    ('admin', 'widgets.select'),
    ('admin', 'widgets.insert'),
    ('admin', 'widgets.update'),
    ('admin', 'widgets.delete'),
    ('manager', 'widgets.select'),
    ('manager', 'widgets.update'),
    ('user', 'widgets.select');


-- SET UP TENANTS
DROP TABLE IF EXISTS public.tenants CASCADE;
CREATE TABLE public.tenants (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    tenant_name TEXT
);

INSERT INTO public.tenants (tenant_name)
VALUES
    ('Acme Widgets'),
    ('Widgets''R''Us');

DROP TABLE IF EXISTS public.user_tenants;
CREATE TABLE public.user_tenants (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    tenant_id BIGINT REFERENCES public.tenants ON DELETE CASCADE NOT NULL,
    UNIQUE(user_id, tenant_id)
);


-- CREATE AUTH HOOK FUNCTION
-- Runs before JWT is issued, editing JWT to add the custom claims
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
stable
AS $$
  DECLARE
    event_user_id uuid;
    claims jsonb;
    user_role public.app_role;
    user_tenant_id BIGINT;
    user_tenant_name text;
  BEGIN

    -- Get user_id from issuing event
    event_user_id := (event->>'user_id')::uuid;

    -- Get existing claims
    claims := event->'claims';
    
    -- Fetch the user role in the user_roles table
    SELECT role INTO user_role FROM public.user_roles WHERE user_id = event_user_id;

    IF user_role IS NOT NULL THEN
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    ELSE
      claims := jsonb_set(claims, '{user_role}', 'null');
    END IF;

    -- Fetch the user tenant id in the user_tenants table
    SELECT tenant_id INTO user_tenant_id FROM public.user_tenants WHERE user_id = event_user_id;

    IF user_tenant_id IS NOT NULL THEN
        claims := jsonb_set(claims, '{user_tenant}', to_jsonb(user_tenant_id));
    ELSE
        claims := jsonb_set(claims, '{user_tenant}', 'null');
    END IF;

    -- Fetch the user tenant name in the user_tenants table
    -- (id is used for auth, but the human-readable name is useful for UI display)
    SELECT tenant_name INTO user_tenant_name FROM public.tenants WHERE id = user_tenant_id;

    IF user_tenant_name IS NOT NULL THEN
        claims := jsonb_set(claims, '{user_tenant_name}', to_jsonb(user_tenant_name));
    ELSE
        claims := jsonb_set(claims, '{user_tenant_name}', 'null');
    END IF;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    RETURN event;
  END;
$$;

-- Grant permissions to supabase_auth_admin,
-- and revoke for all others.
-- (Alternatively, RLS could be enabled and policies created, if some
--  access by users was required.)
GRANT usage ON SCHEMA public TO supabase_auth_admin;

GRANT EXECUTE
  ON FUNCTION public.custom_access_token_hook
  TO supabase_auth_admin;

REVOKE EXECUTE
  ON FUNCTION public.custom_access_token_hook
  FROM authenticated, anon, public;

GRANT all
  ON TABLE public.user_roles
  TO supabase_auth_admin;

REVOKE all
  ON TABLE public.user_roles
  FROM authenticated, anon, public;

  GRANT all
  ON TABLE public.role_permissions
  TO supabase_auth_admin;

REVOKE all
  ON TABLE public.role_permissions
  FROM authenticated, anon, public;

GRANT all
  ON TABLE public.tenants
  TO supabase_auth_admin;

REVOKE all
  ON TABLE public.tenants
  FROM authenticated, anon, public;

GRANT all
  ON TABLE public.user_tenants
  TO supabase_auth_admin;

REVOKE all
  ON TABLE public.user_tenants
  FROM authenticated, anon, public;


-- CREATE AUTHORIZE FUNCTION
-- Reads JWT and checks tenant, and permissions based on user's role.
CREATE OR REPLACE FUNCTION public.authorize(
    requested_permission app_permission,
    row_tenant BIGINT
)
RETURNS BOOLEAN AS $$
DECLARE
    bind_permissions INT;
    user_role public.app_role;
    user_tenant BIGINT;
BEGIN
    -- Fetch user role once and store it to reduce number of calls
    SELECT (auth.jwt() ->> 'user_role')::public.app_role INTO user_role;
    -- Fetch user tenant
    SELECT (auth.jwt() ->> 'user_tenant')::BIGINT INTO user_tenant;

    -- All users should have a tenant, reject otherwise
    IF user_tenant IS NULL THEN
        RETURN false;
    END IF;

    -- Reject access where the row doesn't belong to their tenant
    IF user_tenant != row_tenant THEN
        RETURN false;
    END IF;

    SELECT count(*)
    INTO bind_permissions
    FROM public.role_permissions
    WHERE role_permissions.permission = requested_permission
        AND role_permissions.role = user_role;
    
    RETURN bind_permissions > 0;
END;
$$ LANGUAGE plpgsql stable security definer set search_path = '';
