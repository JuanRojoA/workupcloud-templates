export type TemplateSegment = {
    id: string;
    name: string;
    kind: "EMAIL" | "SMS" | "DOCUMENT";
    model: string;
    created_at: string;
    updated_at: string;
};
