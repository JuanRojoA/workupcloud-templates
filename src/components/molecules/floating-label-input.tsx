import React, { useState, forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
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
	error?: FieldError;
	register?: ReturnType<typeof import("react-hook-form").useForm>["register"];
}

/**
 * An input component with a floating label, integrated with React Hook Form.
 *
 * The `FloatingLabelInput` component provides an input field with a label that animates to a floating position
 * when the input is focused or contains a value. It integrates seamlessly with React Hook Form for form state management
 * and validation, and is designed to work well even when inputs are distributed across different parts of the UI.
 *
 * __Note:__ Do not use this component for date inputs. Use the `FloatingLabelDateInput` component instead.
 * Nor for color inputs; use the `FloatingLabelColorInput` component.
 *
 * ### Features:
 * - **Floating Label**: The label smoothly transitions between its initial position and a floating position.
 * - **Form Integration**: Seamlessly integrates with React Hook Form, TanStack Query, and Yup for form management and validation.
 * - **Accessible**: Properly associates the label with the input for screen readers and assistive technologies.
 * - **Error Handling**: Displays validation errors and associates them with the input for accessibility.
 * - **Flexible Styling**: Accepts additional class names for both the wrapper and the input for easy customization.
 *
 * ### Usage Examples:
 *
 * ```jsx
 * import { useForm } from "react-hook-form";
 * import { FloatingLabelInput } from "@/components/FloatingLabelInput";
 *
 * const Example = () => {
 *   const { register, handleSubmit, formState: { errors } } = useForm();
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
 *         id="email-input"
 *         name="email"
 *         register={register}
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
 * @param {Function} [props.register] - The register function from React Hook Form.
 * @param {string} [props.wrapperClassName] - Additional class names for the input wrapper.
 * @param {React.InputHTMLAttributes<HTMLInputElement>} [props...rest] - Additional HTML attributes for the input element.
 *
 * @returns {JSX.Element} The rendered FloatingLabelInput component.
 */
export const FloatingLabelInput = React.memo(
	forwardRef<HTMLInputElement, FloatingLabelInputProps>(
		(
			{
				type = "text",
				label,
				name,
				wrapperClassName,
				className,
				id,
				error,
				register,
				...rest
			},
			ref,
		) => {
			const uniqueId = useId();
			const inputId = id || uniqueId;

			const [isFocused, setIsFocused] = useState(false);

			const [inputValue, setInputValue] = useState("");

			const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
				setIsFocused(true);
				rest.onFocus?.(e);
			};

			const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
				setIsFocused(false);
				rest.onBlur?.(e);
			};

			const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
				setInputValue(e.target.value);
				rest.onChange?.(e);
			};

			const hasValue =
				(rest.value !== undefined && rest.value !== "") || inputValue !== "";

			return (
				<div className={cn("relative", wrapperClassName)}>
					<div className="relative w-full h-max bg-transparent">
						<Input
							{...(register ? register(name) : {})}
							id={inputId}
							type={type}
							className={cn(
								"peer placeholder-transparent placeholder-shown:placeholder-transparent",
								{ "border-primary": isFocused },
								{ "border-red-500": error },
								className,
							)}
							aria-invalid={error ? "true" : "false"}
							aria-describedby={error ? `${inputId}-error` : undefined}
							ref={ref}
							onFocus={handleFocus}
							onBlur={handleBlur}
							onChange={handleChange}
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
	),
);

FloatingLabelInput.displayName = "FloatingLabelInput";
