import React, { useEffect } from "react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/hooks/useFilters";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	FloatingLabelInput,
	type InputType,
} from "@/components/molecules/inputs/floating-label-input";
import { FloatingLabelSelect } from "@/components/molecules/inputs/floating-label-select";
import { FloatingLabelDatePicker } from "@/components/molecules/inputs/floating-label-date-picker";
import { FloatingLabelColorPicker } from "@/components/molecules/inputs/floating-label-color-picker";
import { FloatingLabelTextarea } from "@/components/molecules/inputs/floating-label-textarea";
import { CheckboxInput } from "@/components/molecules/inputs/checkbox-input";
import { RadioButtonInput } from "@/components/molecules/inputs/radio-button-input";
import type { z } from "zod";

export interface FilterOption {
	label: string;
	value: string;
}

export type FilterType =
	| "input"
	| "select"
	| "textarea"
	| "date"
	| "color"
	| "checkbox"
	| "radio";

export interface FilterConfigItem {
	type: FilterType;
	name: string;
	label: string;
	placeholder?: string;
	options?: FilterOption[]; // For select and radio inputs
	isHidden?: boolean; // For hidden filters
	defaultValue?: string | string[] | number | boolean; // For select and radio inputs
	inputType?: InputType; // For input fields
	multiple?: boolean; // For selects that allow multiple selections
}

/**
 * Props for the FiltersSheet component.
 */
interface FiltersSheetProps {
	isOpen: boolean;
	onClose: () => void;
	onApply: (data: Record<string, unknown>) => void;
	onClear: () => void;
	filterConfig: FilterConfigItem[];
	filtersSchema: z.ZodSchema<Record<string, unknown>>;
	filtersStoredAs?: string;
}

/**
 * A sheet component that displays filter options based on a configuration.
 *
 * The `FiltersSheet` component renders a set of inputs based on the provided
 * filter configuration. It integrates with `useFilters` hook to manage filter state,
 * and uses `react-hook-form` and `zod` for form state management and validation.
 *
 * @component
 *
 * @param {FiltersSheetProps} props - The component props.
 * @returns {JSX.Element} - The rendered FiltersSheet component.
 */
export const FiltersSheet: React.FC<FiltersSheetProps> = React.memo(
	({
		isOpen,
		onClose,
		onApply,
		onClear,
		filterConfig,
		filtersSchema,
		filtersStoredAs,
	}) => {
		const { filters, setFilterValue, clearFilters } =
			useFilters(filtersStoredAs);

		const methods = useForm({
			resolver: zodResolver(filtersSchema),
			defaultValues: Object.fromEntries(
				Object.entries(filters).map(([key, filter]) => [key, filter.value]),
			),
		});

		const {
			handleSubmit,
			reset,
			formState: { errors },
		} = methods;

		// Reset form when filters change
		useEffect(() => {
			reset(
				Object.fromEntries(
					Object.entries(filters).map(([key, filter]) => [key, filter.value]),
				),
			);
		}, [filters, reset]);

		/**
		 * Handles the form submission.
		 *
		 * @param {Record<string, any>} data - The form data.
		 */

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const onSubmit = (data: Record<string, any>) => {
			// Update filters in the hook
			for (const [key, value] of Object.entries(data)) {
				setFilterValue(key, value);
			}
			onApply(data);
			onClose();
		};

		/**
		 * Handles clearing the filters.
		 */
		const handleClear = () => {
			clearFilters();
			reset({});
			onClear();
		};

		return (
			<Sheet open={isOpen} onOpenChange={onClose}>
				<SheetContent
					side="right"
					className="w-[400px] sm:max-w-[30vw] sm:min-w-[270px] p-0 flex flex-col h-full gap-0"
				>
					<SheetHeader className="p-4 py-2 border border-zinc-200">
						<SheetTitle>Advanced Filters</SheetTitle>
					</SheetHeader>
					<FormProvider {...methods}>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="flex flex-col gap-4 py-4 px-3 max-h-full grow overflow-y-auto w-full"
						>
							{filterConfig.map((filterItem) => {
								if (filterItem.isHidden) return null;

								const fieldError = errors[filterItem.name];

								switch (filterItem.type) {
									case "input":
										return (
											<FloatingLabelInput
												key={filterItem.name}
												label={filterItem.label}
												name={filterItem.name}
												type={filterItem.inputType || "text"}
												error={fieldError}
												wrapperClassName=""
											/>
										);
									case "select":
										return (
											<FloatingLabelSelect
												key={filterItem.name}
												label={filterItem.label}
												name={filterItem.name}
												options={filterItem.options || []}
												// isMulti={filterItem.multiple || false}
												error={fieldError}
												wrapperClassName=""
											/>
										);
									case "date":
										return (
											<FloatingLabelDatePicker
												key={filterItem.name}
												label={filterItem.label}
												name={filterItem.name}
												mode="single"
												error={fieldError}
												wrapperClassName=""
											/>
										);
									case "color":
										return (
											<FloatingLabelColorPicker
												key={filterItem.name}
												label={filterItem.label}
												name={filterItem.name}
												error={fieldError}
												wrapperClassName=""
											/>
										);
									case "textarea":
										return (
											<FloatingLabelTextarea
												key={filterItem.name}
												label={filterItem.label}
												name={filterItem.name}
												error={fieldError}
												wrapperClassName=""
											/>
										);
									case "checkbox":
										return (
											<CheckboxInput
												key={filterItem.name}
												label={filterItem.label}
												name={filterItem.name}
												options={[{ label: filterItem.label, value: "true" }]}
												error={fieldError}
												wrapperClassName=""
											/>
										);
									case "radio":
										return (
											<RadioButtonInput
												key={filterItem.name}
												label={filterItem.label}
												name={filterItem.name}
												options={filterItem.options || []}
												error={fieldError}
												wrapperClassName=""
											/>
										);
									default:
										return null;
								}
							})}
						</form>
					</FormProvider>
					<SheetFooter className="flex justify-end p-0 m-0">
						<div className="w-full flex p-2 gap-2 shadow-[0px_-1px_5px_0px_rgba(0,0,0,0.1)]">
							<Button
								type="button"
								variant="outline"
								className="grow"
								onClick={handleClear}
							>
								Clear Filters
							</Button>
							<Button
								type="submit"
								className="grow"
								onClick={methods.handleSubmit(onSubmit)}
							>
								Apply Filters
							</Button>
						</div>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		);
	},
);

FiltersSheet.displayName = "FiltersSheet";
