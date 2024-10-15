import { Textarea } from "@/components/ui/textarea.tsx";
import { cn } from "@/lib/utils.ts";
import React, { useState, useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldError } from "react-hook-form";

/**
 * Props for the FloatingLabelTextarea component.
 */
interface FloatingLabelTextareaProps
	extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
	label: string;
	name: string;
	wrapperClassName?: string;
	className?: string;
	error?: FieldError;
	id?: string;
	rows?: number;
}

/**
 * A React component for a textarea input with a floating label.
 *
 * This component provides a user-friendly textarea input with a floating label that animates
 * when the input is focused or has a value.
 * It uses `react-hook-form` for form integration.
 *
 * @component
 * @param {FloatingLabelTextareaProps} props - Props for configuring the FloatingLabelTextarea component.
 * @param {string} props.label - The label for the textarea field.
 * @param {string} props.name - The name of the form field (required for form integration).
 * @param {FieldError} [props.error] - The error object from React Hook Form.
 * @param {string} [props.wrapperClassName] - Additional class names for the textarea wrapper.
 * @param {string} [props.className] - Additional class names for the textarea element.
 * @param {string} [props.id] - The id of the textarea element.
 * @param {number} [props.rows=4] - Number of visible text lines for the control.
 * @returns {React.ReactElement} - The rendered floating label textarea component.
 *
 * @example
 * // Basic usage
 * <FloatingLabelTextarea label="Description" name="description" />
 *
 * @example
 * // With custom class names and error message
 * <FloatingLabelTextarea
 *   label="Feedback"
 *   name="feedback"
 *   wrapperClassName="mb-4"
 *   className="border-2 border-blue-500"
 *   error={{ message: "Please enter your feedback" }}
 *   rows={6}
 * />
 */
export const FloatingLabelTextarea: React.FC<FloatingLabelTextareaProps> = ({
	label,
	name,
	wrapperClassName,
	className,
	id,
	error,
	rows = 4,
	...rest
}: FloatingLabelTextareaProps): React.ReactElement => {
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
							<Textarea
								id={inputId}
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
								rows={rows}
								className={cn(
									"peer placeholder-transparent resize-none",
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
									"absolute left-3 top-[20px] transform -translate-y-1/2 transition-all duration-200 ease-in-out text-zinc-600 pointer-events-none bg-white px-1",
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
};

FloatingLabelTextarea.displayName = "FloatingLabelTextarea";
