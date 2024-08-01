/*
    (C) Brackenbit 2024
*/

import { Container, Table } from "react-bootstrap";

export default function Help() {
    return (
        <Container fluid className="mt-4">
            <h1>Help</h1>
            <br />
            <h3>Overview</h3>
            <p>
                This demo shows how custom claims can be added to Supabase
                authentication, to support e.g. multi-tenancy and user roles.
            </p>
            <p>
                The demo contains two tenants, with data isolated through
                row-level security (RLS).
            </p>
            <p>Each tenant has three users, with different roles.</p>
            <br />
            <h3>Role Permissions</h3>
            <p>Demo users are assigned roles with the following permissions:</p>
            <Table>
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>Permissions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>User</td>
                        <td>View widgets</td>
                    </tr>
                    <tr>
                        <td>Manager</td>
                        <td>View and edit widgets</td>
                    </tr>
                    <tr>
                        <td>Admin</td>
                        <td>View, edit, add, and delete widgets</td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    );
}
