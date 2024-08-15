/*
    (C) Brackenbit 2024
*/

import { Button, Spinner, Table } from "react-bootstrap";
import { useWidgets } from "./useWidgets";
import { useState } from "react";
import EditWidgetModal from "./EditWidgetModal";
import Widget from "./WidgetModel";
import { useDeleteWidget } from "./useDeleteWidget";

export default function WidgetTable() {
    const [showEditModal, setShowEditModal] = useState(false);
    const [widgetToEdit, setWidgetToEdit] = useState<Widget | null>(null);
    const { isPending, widgets, error } = useWidgets();
    const { isDeleting, deleteWidget } = useDeleteWidget();

    if (isPending) return <Spinner />;

    if (error) {
        console.error(error);
    }

    function openEditModal(widget: Widget) {
        setWidgetToEdit(widget);
        setShowEditModal(true);
    }

    function handleCloseEditModal() {
        setShowEditModal(false);
    }

    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {widgets?.map((widget) => (
                        <tr key={widget.id}>
                            <td>{widget.id}</td>
                            <td>{widget.name}</td>
                            <td>{widget.description}</td>
                            <td>
                                <Button
                                    size="sm"
                                    onClick={() => openEditModal(widget)}
                                >
                                    Edit
                                </Button>
                            </td>
                            <td>
                                <Button
                                    size="sm"
                                    disabled={isDeleting}
                                    onClick={() => deleteWidget(widget.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {widgetToEdit && (
                <EditWidgetModal
                    show={showEditModal}
                    onHide={handleCloseEditModal}
                    widgetToEdit={widgetToEdit}
                />
            )}
        </>
    );
}
