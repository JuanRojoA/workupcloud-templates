import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import React from "react";
import { Controller, FieldError, useFormContext } from "react-hook-form";

/**
 * Represents a single checkbox option.
 */
interface CheckboxOption {
	value: string;
	label: string;
}

/**
 * Props for the CheckboxInput component.
 */
interface CheckboxInputProps {
	label: string;
	name: string;
	options: CheckboxOption[];
	wrapperClassName?: string;
	className?: string;
	id?: string;
	error?: FieldError | { [key: string]: string };
}

/**
 * A React component for rendering a group of checkboxes with integrated form handling.
 *
 * This component uses `react-hook-form` to manage the form state and validation.
 * It provides a convenient way to render a group of checkboxes with labels and error messages.
 *
 * @component
 * @param {CheckboxInputProps} props - The props for the component.
 * @param {string} props.label - The label for the checkbox group.
 * @param {string} props.name - The name of the checkbox group.
 * @param {CheckboxOption[]} props.options - The list of options to render as checkboxes.
 * @param {string} [props.wrapperClassName] - The class name to apply to the wrapper element.
 * @param {string} [props.className] - The class name to apply to each checkbox element.
 * @param {string} [props.id] - The id attribute for the checkbox group.
 * @param {FieldError | { [key: string]: string }} [props.error] - The error message to display for the checkbox group.
 * @returns {React.ReactElement} The rendered CheckboxInput component.
 *
 * @example
 * // Basic usage
 * <CheckboxInput
 *   label="Select your favorite fruits"
 *   name="fruits"
 *   options={[
 *     { value: "apple", label: "Apple" },
 *     { value: "banana", label: "Banana" },
 *     { value: "orange", label: "Orange" },
 *   ]}
 * />
 *
 * @example
 * // With custom class names and error message
 * <CheckboxInput
 *   label="Select your hobbies"
 *   name="hobbies"
 *   options={[
 *     { value: "reading", label: "Reading" },
 *     { value: "coding", label: "Coding" },
 *     { value: "gaming", label: "Gaming" },
 *   ]}
 *   wrapperClassName="p-4"
 *   className="border-2 border-blue-500"
 *   error={{ message: "Please select at least one hobby."
 *   }}
 * />
 */
export const CheckboxInput: React.FC<CheckboxInputProps> = ({
	label,
	name,
	options,
	wrapperClassName,
	className,
	id,
	error,
}: CheckboxInputProps): React.ReactElement => {
	const { control } = useFormContext();

	return (
		<div className={cn("flex flex-col", wrapperClassName)} id={id}>
			<span className="mb-2 text-sm font-medium text-zinc-700">{label}</span>
			<div className="flex flex-col space-y-2">
				{options.map((option) => (
					<Controller
						key={option.value}
						name={name}
						control={control}
						defaultValue={[]} // Ensure default value is an array
						render={({ field }) => {
							// Ensure field.value is an array; if undefined, default to an empty array
							const valueArray = Array.isArray(field.value) ? field.value : [];
							const isChecked = valueArray.includes(option.value);

							/**
							 * Handles the change event for the checkbox.
							 *
							 * When checked is true, it adds the option value to the field value.
							 * When checked is false, it removes the option value from the field value.
							 * @param {boolean} checked - Whether the checkbox is checked.
							 */
							const handleChange = (checked: boolean) => {
								if (checked) {
									field.onChange([...valueArray, option.value]);
								} else {
									field.onChange(
										valueArray.filter((val: string) => val !== option.value),
									);
								}
							};

							return (
								<div className="flex items-center space-x-2">
									<Checkbox
										id={`${id}-${option.value}`}
										value={option.value}
										checked={isChecked}
										onCheckedChange={handleChange}
										className={className}
									/>
									<label
										htmlFor={`${id}-${option.value}`}
										className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										{option.label}
									</label>
								</div>
							);
						}}
					/>
				))}
			</div>
			{error && (
				<p className="mt-1 text-sm text-red-500" role="alert">
					{error.message}
				</p>
			)}
		</div>
	);
};

CheckboxInput.displayName = "CheckboxInput";
