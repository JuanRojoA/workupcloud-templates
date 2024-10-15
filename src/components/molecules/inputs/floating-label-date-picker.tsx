import { Button } from "@/components/ui/button.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils.ts";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useState, useId } from "react";
import type { DateRange } from "react-day-picker";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldError } from "react-hook-form";

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
	calendarProps?: Omit<
		React.ComponentProps<typeof Calendar>,
		"mode" | "selected" | "onSelect"
	>;
}

/**
 * A React component for a date picker with a floating label.
 *
 * This component provides a user-friendly way to select a date or date range with a floating label that
 * animates when the input is focused or has a value.
 * It uses `react-hook-form` for form integration and `react-day-picker` for the calendar functionality.
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
 * @returns {React.ReactElement} The rendered FloatingLabelDatePicker component.
 *
 * @example
 * // Basic usage
 * <FloatingLabelDatePicker label="Choose a date" name="date" />
 *
 * @example
 * // Date range picker
 * <FloatingLabelDatePicker label="Choose a date range" name="dateRange" mode="range" />
 *
 * @example
 * // With custom class names and error message
 * <FloatingLabelDatePicker
 *   label="Event Date"
 *   name="eventDate"
 *   wrapperClassName="mb-4"
 *   className="border-2 border-blue-500"
 *   error={{ message: "Please select a date" }}
 * />
 */
export const FloatingLabelDatePicker: React.FC<
	FloatingLabelDatePickerProps
> = ({
	label,
	name,
	mode = "single",
	wrapperClassName,
	className,
	id,
	error,
	disabled = false,
	calendarProps = {},
}: FloatingLabelDatePickerProps): React.ReactElement => {
	const uniqueId = useId();
	const inputId = id || uniqueId;

	const { control } = useFormContext();

	const [open, setOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	/**
	 * Formats the selected date value based on the picker mode.
	 *
	 * @param {any} value - The selected date value.
	 * @returns {string} - The formatted date string.
	 */
	const formatValue = (value: any): string => {
		if (!value) return "";

		if (mode === "single" && value instanceof Date) {
			return format(value, "PPP");
		}

		if (mode === "range" && value?.from) {
			const { from, to } = value as DateRange;
			if (from && to) {
				return `${format(from, "LLL dd, y")} - ${format(to, "LLL dd, y")}`;
			}
			return from ? format(from, "LLL dd, y") : "";
		}

		if (mode === "multiple" && Array.isArray(value)) {
			return value.map((date: Date) => format(date, "PPP")).join(", ");
		}

		return "";
	};

	return (
		<div className={cn("relative", wrapperClassName)}>
			<Controller
				name={name}
				control={control}
				render={({ field: { value, onChange } }) => {
					const hasValue =
						mode === "single" && value instanceof Date
							? true
							: mode === "range"
								? !!(value?.from || value?.to)
								: Array.isArray(value) && value.length > 0;

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
										onBlur={() => setIsFocused(false)}
										disabled={disabled}
									>
										{hasValue ? (
											<div className="flex items-center">
												{mode === "single" && value instanceof Date && (
													<span>{formatValue(value)}</span>
												)}
												{mode === "range" && <span>{formatValue(value)}</span>}
												{mode === "multiple" && Array.isArray(value) && (
													<span>{formatValue(value)}</span>
												)}
											</div>
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
										selected={value}
										onSelect={onChange}
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

FloatingLabelDatePicker.displayName = "FloatingLabelDatePicker";
