/*
    (C) Brackenbit 2024
*/

import { Modal } from "react-bootstrap";
import Widget, { WidgetRequest } from "./WidgetModel";
import WidgetFormReusable from "./WidgetFormReusable";
import { useEditWidget } from "./useEditWidget";

interface EditWidgetModalParams {
    show: boolean;
    onHide: () => void;
    widgetToEdit: Widget;
}

export default function EditWidgetModal({
    show,
    onHide,
    widgetToEdit,
}: EditWidgetModalParams) {
    const { id: editId, ...editValues } = widgetToEdit;

    const { isEditing, editWidget } = useEditWidget();

    function handleSubmit(data: WidgetRequest) {
        editWidget({
            newWidget: data,
            id: editId,
        });
        onHide();
    }

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title role="heading" aria-level={1}>
                    Edit Widget
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <WidgetFormReusable
                    onSubmit={handleSubmit}
                    isWorking={isEditing}
                    editValues={editValues}
                    onHide={onHide}
                />
            </Modal.Body>
        </Modal>
    );
}
