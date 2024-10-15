import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import React, { useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldError } from "react-hook-form";

/**
 * Represents an option in the radio button group.
 */
interface RadioOption {
	label: string;
	value: string;
}

/**
 * Props for the RadioButtonInput component.
 */
interface RadioButtonInputProps {
	label: string;
	name: string;
	options: RadioOption[];
	wrapperClassName?: string;
	className?: string;
	error?: FieldError;
	id?: string;
}

/**
 * A React component for rendering a group of radio buttons with integrated form handling.
 *
 * This component uses `react-hook-form` to manage the form state and validation. It provides a
 * convenient way to render a group of radio buttons with labels and error messages.
 *
 * @component
 * @param {RadioButtonInputProps} props - Props for configuring the RadioButtonInput component.
 * @param {string} props.label - The label for the radio button group.
 * @param {string} props.name - The name of the form field (required for form integration).
 * @param {RadioOption[]} props.options - The list of options to render as radio buttons.
 * @param {string} [props.wrapperClassName] - Additional class names for the radio group wrapper.
 * @param {string} [props.className] - Additional class names for each radio button item.
 * @param {FieldError} [props.error] - The error object from React Hook Form.
 * @param {string} [props.id] - The id of the radio group.
 * @returns {React.ReactElement} - The rendered radio button group component.
 *
 * @example
 * // Basic usage
 * <RadioButtonInput
 *   label="Select your favorite color"
 *   name="color"
 *   options={[
 *     { label: "Red", value: "red" },
 *     { label: "Green", value: "green" },
 *     { label: "Blue", value: "blue" },
 *   ]}
 * />
 *
 * @example
 * // With custom class names and error message
 * <RadioButtonInput
 *   label="Choose your payment method"
 *   name="paymentMethod"
 *   options={[ ... ]}
 *   wrapperClassName="p-4"
 *   className="border-2 border-blue-500"
 *   error={{ message: "Please select a payment method" }}
 * />
 */
export const RadioButtonInput: React.FC<RadioButtonInputProps> = ({
  label,
  name,
  options,
  wrapperClassName,
  className,
  id,
  error,
}: RadioButtonInputProps): React.ReactElement => {
	const uniqueId = useId();
	const groupId = id || uniqueId;

	const { control } = useFormContext();

	return (
		<div className={cn("flex flex-col", wrapperClassName)}>
			<span className="mb-2 text-sm font-medium text-zinc-700">{label}</span>
			<Controller
				name={name}
				control={control}
				render={({ field: { value, onChange, onBlur } }) => (
					<RadioGroup
						id={groupId}
						value={value}
						onValueChange={(val) => {
							onChange(val);
						}}
						onBlur={onBlur}
						className={cn("flex flex-col space-y-2", {
							"border-red-500": error,
						})}
					>
						{options.map((option) => {
							const optionId = `${groupId}-${option.value}`;
							return (
								<div key={option.value} className="flex items-center space-x-2">
									<RadioGroupItem
										value={option.value}
										id={optionId}
										className={cn("h-4 w-4", className)}
									/>
									<Label
										htmlFor={optionId}
										className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										{option.label}
									</Label>
								</div>
							);
						})}
					</RadioGroup>
				)}
			/>
			{error && (
				<p className="mt-1 text-sm text-red-500" role="alert">
					{error.message}
				</p>
			)}
		</div>
	);
};

RadioButtonInput.displayName = "RadioButtonInput";
