import type React from "react";
import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { type FormField, useDynamicForm } from "@/hooks/useDynamicForm";
import { FloatingLabelSelect } from "@/components/molecules/inputs/floating-label-select.tsx";
import { FloatingLabelInput } from "@/components/molecules/inputs/floating-label-input.tsx";

interface DynamicFormProps {
    fields: FormField[];
    initialData?: Record<string, any>;
    onSubmit: (formData: Record<string, any>) => void;
    submitText?: string;
    cancelText?: string;
    className?: string;
}

/**
 * Renders a dynamic form based on provided field configurations.
 *
 * This component dynamically generates form fields using the `FloatingLabelInput` and `FloatingLabelSelect` components.
 * It manages form state and handles submission through the `useDynamicForm` hook.
 *
 * @param {DynamicFormProps} props - The properties for the DynamicForm component.
 * @param {FormField[]} props.fields - An array of form field configurations.
 * @param {Record<string, any>} [props.initialData] - Initial data to populate the form fields.
 * @param {(formData: Record<string, any>) => void} props.onSubmit - Callback invoked upon form submission.
 * @param {string} [props.submitText="Save"] - Text for the submit button.
 * @param {string} [props.cancelText="Cancel"] - Text for the cancel button.
 * @param {string} [props.className] - Additional CSS classes for styling.
 *
 * @returns {JSX.Element} The rendered DynamicForm component.
 *
 * @example
 * ```jsx
 * <DynamicForm
 *   fields={formFields}
 *   initialData={{ email: "user@example.com" }}
 *   onSubmit={(data) => console.log(data)}
 *   submitText="Submit"
 *   cancelText="Dismiss"
 * />
 * ```
 */
export const DynamicFormSheet: React.FC<DynamicFormProps> = ({
    fields,
    initialData = {},
    onSubmit,
    submitText = "Save",
    cancelText = "Cancel",
    className,
}: DynamicFormProps): JSX.Element => {
    const { formData, handleInputChange, handleSubmit } = useDynamicForm({
        fields,
        initialData,
        onSubmit,
    });

    /**
     * Renders a single form field based on its configuration.
     *
     * @param {FormField} field - The configuration for the form field.
     * @returns {JSX.Element} The rendered form field.
     */
    const renderField = (field: FormField) => {
        const { id, label, type, placeholder, required, options } = field;
        const value = formData[id] !== undefined ? formData[id] : "";

        switch (type) {
            case "select":
                return (
                    <FloatingLabelSelect
                        key={id}
                        id={id}
                        label={label}
                        options={options || []}
                        value={value}
                        onChange={(val) => handleInputChange(id, val)}
                        selectProps={{
                            required: required,
                        }}
                    />
                );
            case "checkbox":
                return (
                    <div key={id} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={id}
                            checked={!!value}
                            onChange={(e) =>
                                handleInputChange(id, e.target.checked)
                            }
                            required={required}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor={id} className="text-sm text-zinc-600">
                            {label}
                        </label>
                    </div>
                );
            case "radio":
                return (
                    <div key={id} className="space-y-1">
                        <span className="text-sm font-medium text-zinc-700">
                            {label}
                        </span>
                        {options?.map((option) => (
                            <div
                                key={option.value}
                                className="flex items-center space-x-2"
                            >
                                <input
                                    type="radio"
                                    id={`${id}-${option.value}`}
                                    name={id}
                                    value={option.value}
                                    checked={value === option.value}
                                    onChange={() =>
                                        handleInputChange(id, option.value)
                                    }
                                    required={required}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <label
                                    htmlFor={`${id}-${option.value}`}
                                    className="text-sm text-zinc-600"
                                >
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                );
            case "textarea":
                return (
                    <FloatingLabelInput
                        key={id}
                        id={id}
                        label={label}
                        value={value}
                        onChange={(e) => handleInputChange(id, e.target.value)}
                        placeholder={placeholder}
                        required={required}
                        className="resize-none h-24"
                    />
                );
            default:
                return (
                    <FloatingLabelInput
                        key={id}
                        id={id}
                        label={label}
                        type={type}
                        value={value}
                        onChange={(e) => handleInputChange(id, e.target.value)}
                        placeholder={placeholder}
                        required={required}
                    />
                );
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn("grid gap-4 sm:grid-cols-2", className)}
        >
            {fields.map(renderField)}
            <SheetFooter className="sm:col-span-2 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => {}}>
                    {cancelText}
                </Button>
                <Button type="submit">{submitText}</Button>
            </SheetFooter>
        </form>
    );
};

DynamicFormSheet.displayName = "DynamicForm";
