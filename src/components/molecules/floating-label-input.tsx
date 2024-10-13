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
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"type" | "onChange"
	> {
	type?: InputType;
	label: string;
	name: string;
	wrapperClassName?: string;
	error?: FieldError;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Ensure onChange is typed here
}

/**
 * An input component with a floating label, designed to be used as a controlled component.
 *
 * The `FloatingLabelInput` component provides an input field with a label that animates to a floating position
 * when the input is focused or contains a value. It integrates seamlessly with React Hook Form and Zod for form state management
 * and validation using the `Controller` component.
 *
 * __Note:__ Do not use this component for date inputs. Use the `FloatingLabelDateInput` component instead.
 * Nor for color inputs; use the `FloatingLabelColorInput` component.
 *
 * ___Usage Examples:___
 *
 * ```jsx
 * import { useForm, Controller } from "react-hook-form";
 * import { z } from "zod";
 * import { zodResolver } from "@hookform/resolvers/zod";
 * import { FloatingLabelInput } from "@/components/FloatingLabelInput";
 *
 * const FormSchema = z.object({
 *   email: z.string().email({ message: "Invalid email address." }),
 * });
 *
 * const Example = () => {
 *   const { control, handleSubmit, formState: { errors } } = useForm({
 *     resolver: zodResolver(FormSchema),
 *   });
 *
 *   const onSubmit = (data) => {
 *     // Handle form submission
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       <Controller
 *         control={control}
 *         name="email"
 *         render={({ field, fieldState }) => (
 *           <FloatingLabelInput
 *             label="Email"
 *             type="email"
 *             error={fieldState.error}
 *             value={field.value}
 *             onChange={field.onChange}
 *             wrapperClassName="mb-4"
 *           />
 *         )}
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
 * @param {string} [props.value] - The current value of the input field.
 * @param {Function} [props.onChange] - Callback function when the input value changes.
 * @param {string} [props.id] - The id of the input element.
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
				value = "",
				onChange,
				...rest
			},
			ref,
		) => {
			const uniqueId = useId();
			const inputId = id || uniqueId;

			const [isFocused, setIsFocused] = useState(false);

			const hasValue = value !== "";

			return (
				<div className={cn("relative", wrapperClassName)}>
					<div className="relative w-full h-max bg-transparent">
						<Input
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
							ref={ref}
							onFocus={(e) => {
								setIsFocused(true);
								rest.onFocus?.(e);
							}}
							onBlur={(e) => {
								setIsFocused(false);
								rest.onBlur?.(e);
							}}
							value={value}
							onChange={(e) => {
								onChange?.(e);
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
	),
);

FloatingLabelInput.displayName = "FloatingLabelInput";
