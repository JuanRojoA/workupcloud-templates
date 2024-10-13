import type React from "react";
import { useState, useId } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useFormContext } from "react-hook-form";
import type { FieldError } from "react-hook-form";
import { HexColorPicker } from "react-colorful";

/**
 * Props for the FloatingLabelColorPicker component.
 */
interface FloatingLabelColorPickerProps {
	label: string;
	name: string;
	wrapperClassName?: string;
	className?: string;
	error?: FieldError;
	id?: string;
	disabled?: boolean;
	colorPickerProps?: Omit<
		React.ComponentProps<typeof HexColorPicker>,
		"color" | "onChange"
	>;
}

/**
 * A color picker component with a floating label, integrated with React Hook Form.
 *
 * The `FloatingLabelColorPicker` component provides a color picker field with a label that animates to a floating position
 * when the picker is focused or contains a value. It integrates seamlessly with React Hook Form and Zod for form state management
 * and validation.
 *
 * ### Usage Examples:
 *
 * ```jsx
 * import { useForm, FormProvider } from "react-hook-form";
 * import { z } from "zod";
 * import { zodResolver } from "@hookform/resolvers/zod";
 * import { FloatingLabelColorPicker } from "@/components/FloatingLabelColorPicker";
 *
 * const FormSchema = z.object({
 *   color: z.string().nonempty({ message: "Please select a color." }),
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
 *         <FloatingLabelColorPicker
 *           label="Select Color"
 *           name="color"
 *           error={errors.color}
 *           wrapperClassName="mb-4"
 *         />
 *         <button type="submit">Submit</button>
 *       </form>
 *     </FormProvider>
 *   );
 * };
 * ```
 *
 * @component
 * @param {FloatingLabelColorPickerProps} props - Props for configuring the FloatingLabelColorPicker component.
 * @param {string} props.label - The label for the color picker field.
 * @param {string} props.name - The name of the form field (required for form integration).
 * @param {FieldError} [props.error] - The error object from React Hook Form.
 * @param {string} [props.wrapperClassName] - Additional class names for the color picker wrapper.
 * @param {string} [props.className] - Additional class names for the color picker component.
 * @param {string} [props.id] - The id of the color picker component.
 * @param {boolean} [props.disabled] - Whether the color picker is disabled.
 * @param {object} [props.colorPickerProps] - Additional props to pass to the color picker component.
 *
 * @returns {JSX.Element} The rendered FloatingLabelColorPicker component.
 */
export const FloatingLabelColorPicker = ({
	label,
	name,
	wrapperClassName,
	className,
	id,
	error,
	disabled = false,
	colorPickerProps = {},
}: FloatingLabelColorPickerProps) => {
	const uniqueId = useId();
	const inputId = id || uniqueId;

	const { register, setValue, watch } = useFormContext();

	const [open, setOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	// Get the current value from React Hook Form
	const selectedValue = watch(name) || "";

	// Register the hidden input
	const { ref: _ref, ...inputProps } = register(name);

	const handleChange = (color: string) => {
		setValue(name, color, { shouldValidate: true });
	};

	const hasValue = selectedValue !== "";

	return (
		<div className={cn("relative", wrapperClassName)}>
			<div className="relative w-full h-max bg-transparent">
				<input
					{...inputProps}
					type="hidden"
					id={inputId}
					name={name}
					value={selectedValue}
				/>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							// biome-ignore lint/a11y/useSemanticElements: <explanation>
							role="combobox"
							aria-expanded={open}
							className={cn(
								"w-full justify-between font-normal peer text-left hover:bg-white",
								!hasValue && "text-muted-foreground",
								{ "border-primary": isFocused },
								{ "border-red-500": error },
								className,
							)}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							disabled={disabled}
						>
							{hasValue ? (
								<div className="flex items-center">
									<div
										className="w-4 h-4 mr-2 rounded"
										style={{ backgroundColor: selectedValue }}
									/>
									{selectedValue}
								</div>
							) : (
								<span className="text-muted-foreground">Pick a color</span>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="w-auto p-2"
						align="start"
						side="bottom"
						sideOffset={5}
					>
						<HexColorPicker
							color={selectedValue}
							onChange={handleChange}
							{...colorPickerProps}
						/>
					</PopoverContent>
				</Popover>
				<label
					htmlFor={inputId}
					className={cn(
						"absolute left-3 top-[50%] transform -translate-y-1/2 transition-all duration-200 ease-in-out text-zinc-600 pointer-events-none bg-white px-1 leading-[0]",
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

FloatingLabelColorPicker.displayName = "FloatingLabelColorPicker";
