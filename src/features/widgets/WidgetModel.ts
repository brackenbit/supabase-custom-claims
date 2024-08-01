/*
    (C) Brackenbit 2024
*/

export default interface Widget {
    id: number;
    name: string;
    description: string;
}

export interface WidgetRequest {
    name: string;
    description: string;
}
