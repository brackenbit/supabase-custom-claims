/*
    (C) Brackenbit 2024
*/

import { WidgetRequest } from "../features/widgets/WidgetModel";
import supabase from "./supabase";

export async function getWidgets() {
    const { data, error } = await supabase.from("widgets").select("*");

    if (error) {
        console.error("Widgets could not be loaded: ", error.message);
        throw new Error("Widgets could not be loaded.");
    }

    return data;
}

export async function addWidget(newWidget: WidgetRequest) {
    const { data, error } = await supabase
        .from("widgets")
        .insert(newWidget)
        .select()
        .single();

    if (error) {
        if (error.code === "42501") {
            // Insufficient privileges
            throw new Error("You are not allowed to add widgets");
        } else {
            console.error("Widget could not be added: ", error.message);
            throw new Error("Widget could not be added.");
        }
    }

    return data;
}

export interface editWidgetParams {
    newWidget: WidgetRequest;
    id: number;
}

export async function editWidget({ newWidget, id }: editWidgetParams) {
    const { data, error } = await supabase
        .from("widgets")
        .update(newWidget)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            // PGRST116 = Zero or many items returned when one was expected
            // Most likely indicates an RLS error
            throw new Error("You are not allowed to edit widgets.");
        } else {
            console.error("Widget could not be edited: ", error.message);
            throw new Error("Widget could not be edited.");
        }
    }

    return data;
}

export async function deleteWidget(id: number) {
    const { error, count } = await supabase
        .from("widgets")
        .delete({ count: "estimated" })
        .eq("id", id);

    if (error) {
        console.error("Widget could not be deleted: ", error.message);
        throw new Error("Widget could not be deleted.");
    }

    if (count !== 1) {
        // Supabase returns 204 success (No content) instead of error if DELETE is blocked by RLS
        // (For security reasons, rows appear empty, and zero out of zero rows are deemed successfully deleted.)
        // Therefore need to check count of deleted rows to throw RLS error.
        throw new Error("You are not allowed to delete widgets");
    }
}
