/*
    (C) Brackenbit 2024
*/

import { SyntheticEvent } from "react";
import { Button, FloatingLabel, Form, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { WidgetRequest } from "./WidgetModel";

interface WidgetFormParams {
    onSubmit: (_data: WidgetRequest) => void;
    isWorking: boolean;
    editValues: WidgetRequest | null;
    onHide: () => void;
}

type FormValues = {
    name: string;
    description: string;
};

export default function WidgetFormReusable({
    onSubmit: onSubmitOuter,
    isWorking,
    editValues = null,
    onHide,
}: WidgetFormParams) {
    const { register, handleSubmit, reset, formState } = useForm<FormValues>({
        defaultValues: editValues || undefined,
    });
    const { errors } = formState;
    const hasChanges = formState.isDirty;

    const isEditSession = editValues !== null;

    function customHandleSubmit(data: WidgetRequest) {
        // customHandleSubmit sits between react-hook-form's handleSubmit and the
        // onSubmit provided by parent, to submit only when changes are made
        if (!hasChanges) return;

        onSubmitOuter(data);
    }

    function handleCancel(e: SyntheticEvent) {
        e.preventDefault();

        if (isEditSession) {
            reset(editValues);
        } else {
            onHide();
        }
    }

    return (
        <Form onSubmit={handleSubmit(customHandleSubmit)}>
            {errors.name && (
                <Form.Text className=" text-danger">
                    <i className="bi bi-exclamation-circle-fill" />{" "}
                    {errors.name.message}
                </Form.Text>
            )}
            <FloatingLabel controlId="name" label="Name" className="mb-3">
                <Form.Control
                    type="text"
                    placeholder=""
                    disabled={isWorking}
                    {...register("name", {
                        required: "This field is required",
                    })}
                />
            </FloatingLabel>

            {errors.description && (
                <Form.Text className="text-danger">
                    <i className="bi bi-exclamation-circle-fill" />{" "}
                    {errors.description.message}
                </Form.Text>
            )}
            <FloatingLabel
                controlId="description"
                label="Description"
                className="mb-3"
            >
                <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder=""
                    disabled={isWorking}
                    style={{ height: "100%" }}
                    {...register("description", {
                        required: "This field is required",
                    })}
                />
            </FloatingLabel>

            <Stack direction="horizontal" gap={2}>
                <Button size="sm" onClick={handleCancel}>
                    Cancel
                </Button>
                {/* NB: react-bootstrap breaks default form submit behaviour - type="submit" is required. */}
                <Button
                    size="sm"
                    disabled={isWorking || !hasChanges}
                    type="submit"
                >
                    {isEditSession ? "Edit widget" : "Add widget"}
                </Button>
            </Stack>
        </Form>
    );
}
