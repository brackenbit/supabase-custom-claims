# Automatic demo setup

The SQL files in this folder will automatically set up Supabase for this demo.

They must be run in order, e.g. through the SQL editor.

NB: The custom_access_token_hook needs to be manually enabled (in the Supabase dashboard: Authentication -> Hooks (Beta)).

# Editing Supabase auth.users manually

For reference: to add metadata to manually created users, auth.users can be edited with the SQL editor, e.g.:

### Adding/updating a key:

```
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{someKey}', '"someValue"')
WHERE id = 'user_id_here';
```

### Deleting a key:

```
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data - 'keyToRemove'
WHERE id = 'user_id_here';
```

### Using nested keys:

```
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{profile, fullName}', '"John Smith"')
WHERE id = 'user_id_here';
```
