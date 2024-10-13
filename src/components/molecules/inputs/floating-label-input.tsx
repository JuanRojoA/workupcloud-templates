import React, { useState, useId } from "react";
import { cn } from "@/lib/utils.ts";
import { Input } from "@/components/ui/input.tsx";
import { useFormContext } from "react-hook-form";
import type { FieldError } from "react-hook-form";

type InputType =
	| "text"
	| "password"
	| "email"
	| "number"
	| "tel"
	| "url"
	| "search";

/**
 * Props for the FloatingLabelInput component.
 */
interface FloatingLabelInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
	type?: InputType;
	label: string;
	name: string;
	wrapperClassName?: string;
	className?: string;
	error?: FieldError;
	id?: string;
}

/**
 * An input component with a floating label, integrated with React Hook Form.
 *
 * The `FloatingLabelInput` component provides an input field with a label that animates to a floating position
 * when the input is focused or contains a value. It integrates seamlessly with React Hook Form and Zod for form state management
 * and validation, and is designed to work well even when inputs are distributed across different parts of the UI.
 *
 * ### Features:
 * - **Floating Label**: The label smoothly transitions between its initial position and a floating position.
 * - **Form Integration**: Uses `register` from React Hook Form to integrate with form management and validation.
 * - **Accessible**: Properly associates the label with the input for screen readers and assistive technologies.
 * - **Error Handling**: Displays validation errors and associates them with the input for accessibility.
 * - **Flexible Styling**: Accepts additional class names for both the wrapper and the input for easy customization.
 *
 * ### Usage Examples:
 *
 * ```jsx
 * import { useForm } from "react-hook-form";
 * import { z } from "zod";
 * import { zodResolver } from "@hookform/resolvers/zod";
 * import { FloatingLabelInput } from "@/components/FloatingLabelInput";
 *
 * const FormSchema = z.object({
 *   email: z.string().email({ message: "Invalid email address." }),
 * });
 *
 * const Example = () => {
 *   const { register, handleSubmit, formState: { errors } } = useForm({
 *     resolver: zodResolver(FormSchema),
 *   });
 *
 *   const onSubmit = (data) => {
 *     // Handle form submission
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       <FloatingLabelInput
 *         label="Email"
 *         type="email"
 *         name="email"
 *         error={errors.email}
 *         wrapperClassName="mb-4"
 *       />
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * };
 * ```
 *
 * @component
 * @param {FloatingLabelInputProps} props - Props for configuring the FloatingLabelInput component.
 * @param {InputType} [props.type="text"] - The type of the input element.
 * @param {string} props.label - The label for the input field.
 * @param {string} props.name - The name of the form field (required for form integration).
 * @param {FieldError} [props.error] - The error object from React Hook Form.
 * @param {string} [props.wrapperClassName] - Additional class names for the input wrapper.
 * @param {string} [props.className] - Additional class names for the input element.
 * @param {string} [props.id] - The id of the input element.
 *
 * @returns {JSX.Element} The rendered FloatingLabelInput component.
 */
export const FloatingLabelInput = React.memo(
	({
		type = "text",
		label,
		name,
		wrapperClassName,
		className,
		id,
		error,
		...rest
	}: FloatingLabelInputProps) => {
		const uniqueId = useId();
		const inputId = id || uniqueId;

		const { register, watch } = useFormContext();

		const [isFocused, setIsFocused] = useState(false);

		const value = watch(name) || "";

		const hasValue = value !== "";

		return (
			<div className={cn("relative", wrapperClassName)}>
				<div className="relative w-full h-max bg-transparent">
					<Input
						{...register(name)}
						id={inputId}
						type={type}
						name={name}
						className={cn(
							"peer placeholder-transparent placeholder-shown:placeholder-transparent",
							{ "border-primary": isFocused },
							{ "border-red-500": error },
							className,
						)}
						aria-invalid={error ? "true" : "false"}
						aria-describedby={error ? `${inputId}-error` : undefined}
						onFocus={(e) => {
							setIsFocused(true);
							rest.onFocus?.(e);
						}}
						onBlur={(e) => {
							setIsFocused(false);
							rest.onBlur?.(e);
						}}
						{...rest}
					/>
					<label
						htmlFor={inputId}
						className={cn(
							"absolute left-3 top-[47%] transform -translate-y-1/2 transition-all duration-200 ease-in-out text-zinc-600 pointer-events-none bg-white px-1 leading-[0]",
							{
								"text-xs -top-0.5 left-2 font-semibold bg-zinc-100 rounded-md px-1":
									hasValue || isFocused,
								"text-sm": !hasValue && !isFocused,
								"text-red-500": error,
							},
						)}
					>
						{label}
					</label>
				</div>
				{error && (
					<p
						id={`${inputId}-error`}
						className="mt-1 text-sm text-red-500"
						role="alert"
					>
						{error.message}
					</p>
				)}
			</div>
		);
	},
);

FloatingLabelInput.displayName = "FloatingLabelInput";
