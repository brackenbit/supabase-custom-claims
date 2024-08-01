
-- apply_RLS
-- Create RLS policies


-- DEFINE RLS POLICIES
-- A policy is required to implement each app_permission
DROP POLICY IF EXISTS "Allow authorised select access" ON public.widgets;
CREATE POLICY "Allow authorised select access" ON public.widgets FOR SELECT USING ( (SELECT authorize('widgets.select', tenant_id)) );

DROP POLICY IF EXISTS "Allow authorised insert access" ON public.widgets;
CREATE POLICY "Allow authorised insert access" ON public.widgets FOR INSERT WITH CHECK (( (SELECT authorize('widgets.insert', tenant_id)) ));

DROP POLICY IF EXISTS "Allow authorised update access" ON public.widgets;
CREATE POLICY "Allow authorised update access" ON public.widgets FOR UPDATE USING ( (SELECT authorize('widgets.update', tenant_id)) );

DROP POLICY IF EXISTS "Allow authorised delete access" ON public.widgets;
CREATE POLICY "Allow authorised delete access" ON public.widgets FOR DELETE USING ( (SELECT authorize('widgets.delete', tenant_id)) );
