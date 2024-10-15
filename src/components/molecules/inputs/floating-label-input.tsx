import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils.ts";
import React, { useState, useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldError } from "react-hook-form";

/**
 * Types of input supported by the FloatingLabelInput component.
 */
export type InputType =
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
 * A React component for an input field with a floating label.
 *
 * This component provides a user-friendly input field with a floating label that animates
 * when the input is focused or has a value.
 * It uses `react-hook-form` for form integration.
 *
 * The component is memoized using `React.memo` to optimize performance by preventing unnecessary re-renders.
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
 * @returns {React.ReactElement} The rendered FloatingLabelInput component.
 *
 * @example
 * // Basic usage
 * <FloatingLabelInput label="Name" name="name" />
 *
 * @example
 * // Password input
 * <FloatingLabelInput label="Password" name="password" type="password" />
 *
 * @example
 * // With custom class names and error message
 * <FloatingLabelInput
 *   label="Email"
 *   name="email"
 *   type="email"
 *   wrapperClassName="mb-4"
 *   className="border-2 border-blue-500"
 *   error={{ message: "Please enter a valid email" }}
 * />
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
	}: FloatingLabelInputProps): React.ReactElement => {
		const uniqueId = useId();
		const inputId = id || uniqueId;

		const { control } = useFormContext();

		const [isFocused, setIsFocused] = useState(false);

		return (
			<div className={cn("relative", wrapperClassName)}>
				<Controller
					name={name}
					control={control}
					render={({ field: { value, onChange, onBlur } }) => {
						const hasValue =
							value !== "" && value !== undefined && value !== null;

						return (
							<>
								<Input
									id={inputId}
									type={type}
									value={value}
									onChange={onChange}
									onBlur={(e) => {
										setIsFocused(false);
										onBlur();
										rest.onBlur?.(e);
									}}
									onFocus={(e) => {
										setIsFocused(true);
										rest.onFocus?.(e);
									}}
									className={cn(
										"peer placeholder-transparent",
										{ "border-primary": isFocused },
										{ "border-red-500": error },
										className,
									)}
									aria-invalid={error ? "true" : "false"}
									aria-describedby={error ? `${inputId}-error` : undefined}
									disabled={rest.disabled}
									{...rest}
								/>
								<label
									htmlFor={inputId}
									className={cn(
										"absolute left-3 top-[50%] transform -translate-y-1/2 transition-all duration-200 ease-in-out text-zinc-600 pointer-events-none bg-white px-1",
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
							</>
						);
					}}
				/>
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
