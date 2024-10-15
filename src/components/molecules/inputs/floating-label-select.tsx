import { Button } from "@/components/ui/button.tsx";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command.tsx";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils.ts";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useId, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldError } from "react-hook-form";

/**
 * Props for the FloatingLabelSelect component.
 */
interface FloatingLabelSelectProps {
	label: string;
	name: string;
	options: Array<{ label: string; value: string }>;
	wrapperClassName?: string;
	className?: string;
	error?: FieldError;
	id?: string;
	onBlur?: (event: React.FocusEvent<HTMLButtonElement | HTMLElement>) => void;
}

/**
 * A React component for a select input with a floating label.
 *
 * This component provides a user-friendly select input with a floating label that animates
 * when the input is focused or has a value.
 * It uses `react-hook-form` for form integration and a custom command menu for the select options.
 *
 * @component
 * @param {FloatingLabelSelectProps} props - Props for configuring the FloatingLabelSelect component.
 * @param {string} props.label - The label for the select field.
 * @param {string} props.name - The name of the form field (required for form integration).
 * @param {Array<{ label: string; value: string }>} props.options - The options for the select field.
 * @param {FieldError} [props.error] - The error object from React Hook Form.
 * @param {string} [props.wrapperClassName] - Additional class names for the select wrapper.
 * @param {string} [props.className] - Additional class names for the select component.
 * @param {string} [props.id] - The id of the select component.
 * @returns {React.ReactElement} The rendered FloatingLabelSelect component.
 *
 * @example
 * // Basic usage
 * <FloatingLabelSelect
 *   label="Choose an option"
 *   name="option"
 *   options={[
 *     { label: "Option 1", value: "option1" },
 *     { label: "Option 2", value: "option2" },
 *   ]}
 * />
 *
 * @example
 * // With custom class names and error message
 * <FloatingLabelSelect
 *   label="Select a category"
 *   name="category"
 *   options={[ ... ]}
 *   wrapperClassName="mb-4"
 *   className="border-2 border-blue-500"
 *   error={{ message: "Please select a category" }}
 * />
 */
export const FloatingLabelSelect: React.FC<FloatingLabelSelectProps> = ({
	label,
	name,
	options,
	wrapperClassName,
	className,
	id,
	error,
	...rest
}: FloatingLabelSelectProps): React.ReactElement => {
	const uniqueId = useId();
	const inputId = id || uniqueId;

	const { control } = useFormContext();

	const [open, setOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	return (
		<div className={cn("relative", wrapperClassName)}>
			<Controller
				name={name}
				control={control}
				render={({ field: { value, onChange, onBlur } }) => {
					const selectedOption = options.find(
						(option) => option.value === value,
					);
					const hasValue = !!selectedOption;

					return (
						<>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
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
										onBlur={(_e) => {
											onBlur();
										}}
										{...rest}
									>
										{hasValue ? (
											<div className="flex items-center">
												{selectedOption?.label}
											</div>
										) : (
											<span className="text-muted-foreground">
												Select an option
											</span>
										)}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-2">
									<Command className="w-full">
										<CommandInput placeholder={`Search ${label}...`} />
										<CommandList>
											<CommandEmpty>No {label} found.</CommandEmpty>
											<CommandGroup>
												{options.map((option) => (
													<CommandItem
														keywords={[option.label]}
														key={option.value}
														value={option.value}
														onSelect={() => {
															option.value !== value
																? onChange(option.value)
																: onChange(null);
														}}
														className="flex items-center justify-between"
													>
														{option.label}
														{value === option.value && (
															<Check className="h-4 w-4" />
														)}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<label
								htmlFor={inputId}
								className={cn(
									"absolute left-3 top-[50%] transform -translate-y-1/2 transition-all duration-200 ease-in-out text-zinc-600 pointer-events-none bg-white px-1",
									{
										"text-xs -top-0.5 left-2 font-semibold bg-zinc-100 rounded-md px-1":
											hasValue || isFocused || open,
										"text-sm": !hasValue && !isFocused && !open,
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

FloatingLabelSelect.displayName = "FloatingLabelSelect";
