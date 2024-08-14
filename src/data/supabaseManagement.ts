/*
    (C) Brackenbit 2024

    supabaseManagement - provides functions to run queries against Supabase Management API using personal access token.
    Used e.g. to perform database setup for testing.
    
    None of this is used in application code
        - this dir is excluded from rollup
        - ESLint will throw errors if an attempt is made to import
*/

const supabaseProjectRef = process.env.VITE_SUPABASE_PROJECT_REF;
const supabaseAccessToken = process.env.VITE_SUPABASE_ACCESS_TOKEN;

const runQuery = async (sql: string) => {
    const url = `https://api.supabase.com/v1/projects/${supabaseProjectRef}/database/query`;
    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${supabaseAccessToken}`,
            "Content-type": "application/json",
        },
        body: JSON.stringify({ query: sql }),
    };

    try {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        console.log(
            "Query executed successfully: ",
            data.length === 0 ? "No data returned." : data
        );
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error executing Supabase query: ", error?.message);
        } else {
            console.error(
                "Error executing Supabase query (and catch block got unexpected type)"
            );
        }
    }
};

export const deleteWidgets = async () => {
    const deleteWidgetsSQL = `
    DELETE FROM public.widgets;
`;

    await runQuery(deleteWidgetsSQL);
};

export const seedWidgets = async () => {
    const seedWidgetsSQL = `
    DO $$
    DECLARE
        tenantA_id BIGINT;
        tenantB_id BIGINT;
    BEGIN

    SELECT id
    INTO tenantA_id
    FROM public.tenants
    WHERE tenant_name = 'Acme Widgets';

    SELECT id
    INTO tenantB_id
    FROM public.tenants
    WHERE tenant_name = 'Widgets''R''Us';

    INSERT INTO public.widgets
        (tenant_id, name, description)
    VALUES
        (
            tenantA_id,
            'ACME Open-source Matrix',
            'The RSS driver is down, compress the multi-byte system so we can back up the DRAM transmitter!'
        ),
        (
            tenantA_id,
            'ACME Open-source Feed',
            'You can''t program the interface without programming the wireless OCR program!'
        ),
        (
            tenantA_id,
            'ACME Multi-byte Driver',
            'You can''t transmit the capacitor without calculating the wireless AGP sensor!'
        ),
        (
            tenantA_id,
            'ACME Solid State Hard Drive',
            'I''ll hack the cross-platform IP alarm, that should sensor the JBOD panel!'
        ),
        (
            tenantB_id,
            'Widgets''R''Us Solid State Port',
            'You can''t bypass the pixel without programming the mobile SSD system!'
        ),
        (
            tenantB_id,
            'Widgets''R''Us Auxiliary driver',
            'Try to generate the USB sensor, maybe it will quantify the bluetooth bus!'
        ),
        (
            tenantB_id,
            'Widgets''R''Us Digital port',
            'If we generate the transmitter, we can get to the UDP application through the auxiliary SQL hard drive!'
        ),
        (
            tenantB_id,
            'Widgets''R''Us Primary sensor',
            'Use the redundant TLS feed, then you can hack the bluetooth hard drive!'
        );

    END $$;
    `;

    await runQuery(seedWidgetsSQL);
};
