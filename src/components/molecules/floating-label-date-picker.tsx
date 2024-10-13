import type React from "react";
import { useState, useId } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useFormContext } from "react-hook-form";
import type { FieldError } from "react-hook-form";
import type { DateRange } from "react-day-picker";

/**
 * Modes supported by the FloatingLabelDatePicker.
 */
type DatePickerMode = "single" | "range" | "multiple";

/**
 * Props for the FloatingLabelDatePicker component.
 */
interface FloatingLabelDatePickerProps {
	label: string;
	name: string;
	mode?: DatePickerMode;
	wrapperClassName?: string;
	className?: string;
	error?: FieldError;
	id?: string;
	disabled?: boolean;
	/** Additional props to pass to the Calendar component */
	calendarProps?: Omit<
		React.ComponentProps<typeof Calendar>,
		"mode" | "selected" | "onSelect"
	>;
}

/**
 * A date picker component with a floating label, integrated with React Hook Form.
 *
 * The `FloatingLabelDatePicker` component provides a date picker field with a label that animates to a floating position
 * when the picker is focused or contains a value. It supports multiple selection modes provided by React DayPicker
 * (e.g., single date, date range, multiple dates) and integrates seamlessly with React Hook Form and Zod for form state management
 * and validation.
 *
 * ### Usage Examples:
 *
 * ```jsx
 * import { useForm, FormProvider } from "react-hook-form";
 * import { z } from "zod";
 * import { zodResolver } from "@hookform/resolvers/zod";
 * import { FloatingLabelDatePicker } from "@/components/FloatingLabelDatePicker";
 *
 * const FormSchema = z.object({
 *   date: z.date({ required_error: "Please select a date." }),
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
 *         <FloatingLabelDatePicker
 *           label="Select Date"
 *           name="date"
 *           error={errors.date}
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
 * @param {FloatingLabelDatePickerProps} props - Props for configuring the FloatingLabelDatePicker component.
 * @param {string} props.label - The label for the date picker field.
 * @param {string} props.name - The name of the form field (required for form integration).
 * @param {DatePickerMode} [props.mode="single"] - The selection mode for the date picker ("single", "range", "multiple").
 * @param {FieldError} [props.error] - The error object from React Hook Form.
 * @param {string} [props.wrapperClassName] - Additional class names for the date picker wrapper.
 * @param {string} [props.className] - Additional class names for the date picker component.
 * @param {string} [props.id] - The id of the date picker component.
 * @param {boolean} [props.disabled] - Whether the date picker is disabled.
 * @param {object} [props.calendarProps] - Additional props to pass to the Calendar component.
 *
 * @returns {JSX.Element} The rendered FloatingLabelDatePicker component.
 */
export const FloatingLabelDatePicker = ({
	label,
	name,
	mode = "single",
	wrapperClassName,
	className,
	id,
	error,
	disabled = false,
	calendarProps = {},
}: FloatingLabelDatePickerProps): JSX.Element => {
	const uniqueId = useId();
	const inputId = id || uniqueId;

	const { register, setValue, watch } = useFormContext();

	const [open, setOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	// Get the current value from React Hook Form
	const selectedValue = watch(name);

	// Register the hidden input
	const { ref: _ref, ...inputProps } = register(name);

	const handleSelect = (date: Date | Date[] | DateRange | undefined) => {
		setValue(name, date, { shouldValidate: true });
	};

	const formatValue = () => {
		if (!selectedValue) return "";

		if (mode === "single" && selectedValue instanceof Date) {
			return format(selectedValue, "PPP");
		}

		if (mode === "range" && selectedValue?.from) {
			const { from, to } = selectedValue as DateRange;
			if (from && to) {
				return `${format(from, "LLL dd, y")} - ${format(to, "LLL dd, y")}`;
			}
			return from ? format(from, "LLL dd, y") : "";
		}

		if (mode === "multiple" && Array.isArray(selectedValue)) {
			return selectedValue.map((date) => format(date, "PPP")).join(", ");
		}

		return "";
	};

	const hasValue = Boolean(selectedValue);

	return (
		<div className={cn("relative", wrapperClassName)}>
			<div className="relative w-full h-max bg-transparent">
				<input
					{...inputProps}
					type="hidden"
					id={inputId}
					name={name}
					value={selectedValue ? JSON.stringify(selectedValue) : ""}
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
								formatValue()
							) : (
								<span className="text-muted-foreground">Pick a date</span>
							)}
							<CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="w-auto p-0"
						align="start"
						side="bottom"
						sideOffset={5}
					>
						<Calendar
							mode={mode}
							selected={selectedValue}
							onSelect={handleSelect}
							initialFocus
							{...calendarProps}
						/>
					</PopoverContent>
				</Popover>
				<label
					htmlFor={inputId}
					className={cn(
						"absolute left-3 top-[50%] transform -translate-y-1/2 transition-all duration-200 ease-in-out text-zinc-600 pointer-events-none bg-white px-1 leading-[0]",
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

FloatingLabelDatePicker.displayName = "FloatingLabelDatePicker";
