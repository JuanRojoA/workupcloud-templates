import { useState, useId } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { FieldError } from "react-hook-form";

interface FloatingLabelSelectProps {
	label: string;
	name: string;
	options: Array<{ label: string; value: string }>;
	wrapperClassName?: string;
	className?: string;
	error?: FieldError;
	id?: string;
}

/**
 * A select component with a floating label, integrated with React Hook Form.
 *
 * The `FloatingLabelSelect` component provides a select field with a label that animates to a floating position
 * when the select is focused or contains a value. It uses a hidden input to integrate with React Hook Form and Zod,
 * allowing for seamless form state management and validation.
 *
 * ### Usage Examples:
 *
 * ```jsx
 * import { useForm } from "react-hook-form";
 * import { z } from "zod";
 * import { zodResolver } from "@hookform/resolvers/zod";
 * import { FloatingLabelSelect } from "@/components/FloatingLabelSelect";
 *
 * const languages = [
 *   { label: "English", value: "en" },
 *   { label: "French", value: "fr" },
 *   // ...more options
 * ];
 *
 * const FormSchema = z.object({
 *   language: z.string().nonempty({ message: "Please select a language." }),
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
 *       <FloatingLabelSelect
 *         label="Language"
 *         name="language"
 *         options={languages}
 *         error={errors.language}
 *         wrapperClassName="mb-4"
 *       />
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * };
 * ```
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
 *
 * @returns {JSX.Element} The rendered FloatingLabelSelect component.
 */
export const FloatingLabelSelect = ({
	label,
	name,
	options,
	wrapperClassName,
	className,
	id,
	error,
	...rest
}: FloatingLabelSelectProps): JSX.Element => {
	const uniqueId = useId();
	const inputId = id || uniqueId;

	const { register, setValue, watch } = useFormContext();

	const [open, setOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	const selectedValue = watch(name) || "";

	const handleChange = (value: string) => {
		setValue(name, value, { shouldValidate: true });
	};

	const hasValue = selectedValue !== "";

	return (
		<div className={cn("relative", wrapperClassName)}>
			<div className="relative w-full h-max bg-transparent">
				<input
					{...register(name)}
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
								"w-full justify-between peer",
								{ "border-primary": isFocused },
								{ "border-red-500": error },
								className,
							)}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							{...rest}
						>
							{selectedValue
								? options.find((option) => option.value === selectedValue)
										?.label
								: ""}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-full p-0">
						<Command>
							<CommandInput placeholder={`Search ${label}...`} />
							<CommandList>
								<CommandEmpty>No {label} found.</CommandEmpty>
								<CommandGroup>
									{options.map((option) => (
										<CommandItem
											key={option.value}
											value={option.value}
											onSelect={(currentValue) => {
												handleChange(
													currentValue === selectedValue ? "" : currentValue,
												);
												setOpen(false);
											}}
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													selectedValue === option.value
														? "opacity-100"
														: "opacity-0",
												)}
											/>
											{option.label}
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

FloatingLabelSelect.displayName = "FloatingLabelSelect";
