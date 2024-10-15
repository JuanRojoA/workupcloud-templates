import { Button } from "@/components/ui/button.tsx";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils.ts";
import { XIcon } from "lucide-react";
import React, { useState, useId, useMemo } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldError } from "react-hook-form";

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
 * A React component for a color picker with a floating label.
 *
 * This component provides a user-friendly way to select a color with a floating label that animates
 * when the input is focused or has a value.
 * It uses `react-hook-form` for form integration and `react-colorful` for the color picker functionality.
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
 * @returns {React.ReactElement} The rendered FloatingLabelColorPicker component.
 *
 * @example
 * // Basic usage
 * <FloatingLabelColorPicker label="Choose a color" name="color" />
 *
 * @example
 * // With custom class names and error message
 * <FloatingLabelColorPicker
 *   label="Brand Color"
 *   name="brandColor"
 *   wrapperClassName="mb-4"
 *   className="border-2 border-blue-500"
 *   error={{ message: "Please select a color" }}
 * />
 */
export const FloatingLabelColorPicker: React.FC<
	FloatingLabelColorPickerProps
> = ({
	label,
	name,
	wrapperClassName,
	className,
	id,
	error,
	disabled = false,
	colorPickerProps = {},
}: FloatingLabelColorPickerProps): React.ReactElement => {
	const uniqueId = useId();
	const inputId = id || uniqueId;

	const { control } = useFormContext();

	const [open, setOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	const presetColors = useMemo(() => {
		return [
			"#f44336",
			"#9c27b0",
			"#673ab7",
			"#3f51b5",
			"#2196f3",
			"#03a9f4",
			"#009688",
			"#4caf50",
			"#8bc34a",
			"#cddc39",
			"#ffeb3b",
			"#ffc107",
			"#ff5722",
		];
	}, []);

	return (
		<div className={cn("relative", wrapperClassName)}>
			<Controller
				name={name}
				control={control}
				render={({ field: { value, onChange } }) => (
					<>
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={open}
									className={cn(
										"w-full justify-between font-normal peer text-left hover:bg-white",
										!value && "text-muted-foreground",
										{ "border-primary": isFocused },
										{ "border-red-500": error },
										className,
									)}
									onFocus={() => setIsFocused(true)}
									onBlur={() => setIsFocused(false)}
									disabled={disabled}
								>
									{value ? (
										<div className="flex items-center">
											<div
												className="w-4 h-4 mr-2 rounded"
												style={{ backgroundColor: value }}
											/>
											{value}
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
								<div className="flex flex-col gap-2 w-full">
									<HexColorPicker
										color={value || "#ffffff"}
										onChange={onChange}
										{...colorPickerProps}
									/>
									<div className="grid grid-cols-8 gap-2">
										{presetColors.map((color) => (
											<button
												aria-label={`Select ${color}`}
												key={color}
												type="button"
												className={cn(
													"flex items-center justify-center rounded-md border border-zinc-200 transition-all duration-200 ease-in-out hover:bg-zinc-100 focus-visible:ring-1 focus-visible:ring-zinc-950 focus-visible:outline-none",
													{
														"bg-zinc-100": value === color,
													},
												)}
												onClick={() => onChange(color)}
											>
												<div
													className="w-full h-4 rounded"
													style={{ backgroundColor: color }}
												/>
											</button>
										))}
										<button
											type="button"
											aria-label="Clear color"
											className="flex items-center justify-center rounded-md border border-zinc-200 transition-all duration-200 ease-in-out hover:bg-zinc-100 focus-visible:ring-1 focus-visible:ring-zinc-950 focus-visible:outline-none col-span-3"
											onClick={() => onChange("")}
										>
											<XIcon className="h-3 w-3" />
											<span className="text-xs font-normal ml-1">Clear</span>
										</button>
									</div>
									<HexColorInput
										className="bg-zinc-50 border border-zinc-200 rounded-md px-3 py-2 w-full focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
										color={value}
										onChange={onChange}
										placeholder="Type a color"
										prefixed
										alpha
									/>
								</div>
							</PopoverContent>
						</Popover>
						<label
							htmlFor={inputId}
							className={cn(
								"absolute left-3 top-[50%] transform -translate-y-1/2 transition-all duration-200 ease-in-out text-zinc-600 pointer-events-none bg-white px-1 leading-[0]",
								{
									"text-xs -top-0.5 left-2 font-semibold bg-zinc-100 rounded-md px-1":
										value || isFocused,
									"text-sm": !value && !isFocused,
									"text-red-500": error,
								},
							)}
						>
							{label}
						</label>
					</>
				)}
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

FloatingLabelColorPicker.displayName = "FloatingLabelColorPicker";
