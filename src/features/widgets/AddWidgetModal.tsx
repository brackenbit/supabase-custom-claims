/*
    (C) Brackenbit 2024
*/

import { Modal } from "react-bootstrap";
import { WidgetRequest } from "./WidgetModel";
import WidgetFormReusable from "./WidgetFormReusable";
import { useAddWidget } from "./useAddWidget";

interface AddWidgetModalParams {
    show: boolean;
    onHide: () => void;
}

export default function AddWidgetModal({ show, onHide }: AddWidgetModalParams) {
    const { isAdding, addWidget } = useAddWidget();

    function handleSubmit(newWidget: WidgetRequest) {
        addWidget(newWidget);
        onHide();
    }

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title role="heading" aria-level={1}>
                    Add Widget
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <WidgetFormReusable
                    onSubmit={handleSubmit}
                    isWorking={isAdding}
                    editValues={null}
                    onHide={onHide}
                />
            </Modal.Body>
        </Modal>
    );
}
