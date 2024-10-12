import { useState } from "react";

/**
 * Represents the type of a form field.
 */
export type FieldType =
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "select"
    | "checkbox"
    | "radio"
    | "textarea";

/**
 * Represents an option for select, radio, and checkbox fields.
 */
export interface FieldOption {
    label: string;
    value: string;
}

/**
 * Represents the configuration for a single form field.
 */
export interface FormField {
    id: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    required?: boolean;
    options?: FieldOption[];
    cols?: number;
}

/**
 * Represents the properties required by the useDynamicForm hook.
 */
export interface UseDynamicFormProps {
    fields: FormField[];
    initialData?: Record<string, any>;
    onSubmit: (formData: Record<string, any>) => void;
}

/**
 * Manages dynamic form state and handles input changes and form submission.
 *
 * @param {UseDynamicFormProps} props - The properties for the hook.
 * @param {FormField[]} props.fields - An array of form field configurations.
 * @param {Record<string, any>} [props.initialData] - Initial data to populate the form.
 * @param {(formData: Record<string, any>) => void} props.onSubmit - Callback invoked on form submission.
 *
 * @returns {object} An object containing form data, change handlers, and a submit handler.
 *
 * @example
 * ```typescript
 * const { formData, handleChange, handleSubmit } = useDynamicForm({
 *   fields: formFields,
 *   initialData: { email: "user@example.com" },
 *   onSubmit: (data) => console.log(data),
 * });
 * ```
 */
export const useDynamicForm = ({
    fields,
    initialData = {},
    onSubmit,
}: UseDynamicFormProps) => {
    const [formData, setFormData] = useState<Record<string, any>>(initialData);

    /**
     * Handles changes to input fields.
     *
     * @param {string} id - The identifier of the form field.
     * @param {any} value - The new value of the form field.
     */
    const handleInputChange = (id: string, value: any) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    /**
     * Handles form submission.
     *
     * @param {React.FormEvent} e - The form submission event.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return {
        formData,
        handleInputChange,
        handleSubmit,
    };
};
