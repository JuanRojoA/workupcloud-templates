import type React from "react";
import { useState, useId } from "react";
import { cn } from "@/lib/utils.ts";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useFormContext } from "react-hook-form";
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
 * A textarea component with a floating label, integrated with React Hook Form.
 *
 * The `FloatingLabelTextarea` component provides a textarea field with a label that animates to a floating position
 * when the textarea is focused or contains a value. It integrates seamlessly with React Hook Form and Zod for form state management
 * and validation.
 *
 * ### Usage Examples:
 *
 * ```jsx
 * import React from "react";
 * import { useForm, FormProvider } from "react-hook-form";
 * import { z } from "zod";
 * import { zodResolver } from "@hookform/resolvers/zod";
 * import { FloatingLabelTextarea } from "@/components/FloatingLabelTextarea";
 *
 * const FormSchema = z.object({
 *   message: z.string().min(10, { message: "Message must be at least 10 characters long." }),
 * });
 *
 * const Example = () => {
 *   const methods = useForm({
 *     resolver: zodResolver(FormSchema),
 *   });
 *
 *   const { handleSubmit, formState: { errors } } = methods;
 *
 *   const onSubmit = (data) => {
 *     // Handle form submission
 *     console.log("Form Data:", data);
 *   };
 *
 *   return (
 *     <FormProvider {...methods}>
 *       <form onSubmit={handleSubmit(onSubmit)}>
 *         <FloatingLabelTextarea
 *           label="Your Message"
 *           name="message"
 *           error={errors.message}
 *           wrapperClassName="mb-4"
 *           rows={5}
 *         />
 *         <button type="submit">Submit</button>
 *       </form>
 *     </FormProvider>
 *   );
 * };
 * ```
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
 *
 * @returns {JSX.Element} The rendered FloatingLabelTextarea component.
 */
export const FloatingLabelTextarea = ({
	label,
	name,
	wrapperClassName,
	className,
	id,
	error,
	rows = 4,
	...rest
}: FloatingLabelTextareaProps): JSX.Element => {
	const uniqueId = useId();
	const inputId = id || uniqueId;

	const { register, watch } = useFormContext();

	const [isFocused, setIsFocused] = useState(false);

	const value = watch(name) || "";

	const hasValue = value !== "";

	return (
		<div className={cn("relative", wrapperClassName)}>
			<div className="relative w-full h-max bg-transparent">
				<Textarea
					{...register(name)}
					id={inputId}
					name={name}
					rows={rows}
					className={cn(
						"peer placeholder-transparent resize-none",
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
};

FloatingLabelTextarea.displayName = "FloatingLabelTextarea";
