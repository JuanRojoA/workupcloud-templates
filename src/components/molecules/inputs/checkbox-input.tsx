import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import type { FieldError } from "react-hook-form";

/**
 * Represents an option in the checkbox group.
 */
interface CheckboxOption {
	label: string;
	value: string;
}

/**
 * Props for the CheckboxInput component.
 */
interface CheckboxInputProps {
	label: string;
	name: string;
	options: CheckboxOption[];
	wrapperClassName?: string;
	className?: string;
	error?: FieldError;
	id?: string;
}

/**
 * A checkbox group component integrated with React Hook Form.
 *
 * The `CheckboxInput` component renders a group of checkboxes based on provided options.
 * It integrates seamlessly with React Hook Form and Zod for form state management and validation.
 *
 * ### Usage Example:
 *
 * ```jsx
 * import React from "react";
 * import { useForm, FormProvider } from "react-hook-form";
 * import { z } from "zod";
 * import { zodResolver } from "@hookform/resolvers/zod";
 * import { CheckboxInput } from "@/components/CheckboxInput";
 *
 * const FormSchema = z.object({
 *   hobbies: z.array(z.string()).min(1, { message: "Select at least one hobby." }),
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
 *   const hobbyOptions = [
 *     { label: "Reading", value: "reading" },
 *     { label: "Traveling", value: "traveling" },
 *     { label: "Cooking", value: "cooking" },
 *     { label: "Gaming", value: "gaming" },
 *   ];
 *
 *   return (
 *     <FormProvider {...methods}>
 *       <form onSubmit={handleSubmit(onSubmit)}>
 *         <CheckboxInput
 *           label="Select Your Hobbies"
 *           name="hobbies"
 *           options={hobbyOptions}
 *           error={errors.hobbies}
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
 * @param {CheckboxInputProps} props - Props for configuring the CheckboxInput component.
 * @param {string} props.label - The label for the checkbox group.
 * @param {string} props.name - The name of the form field (required for form integration).
 * @param {CheckboxOption[]} props.options - The list of options to render as checkboxes.
 * @param {string} [props.wrapperClassName] - Additional class names for the checkbox group wrapper.
 * @param {string} [props.className] - Additional class names for each checkbox item.
 * @param {FieldError} [props.error] - The error object from React Hook Form.
 * @param {string} [props.id] - The id of the checkbox group.
 *
 * @returns {JSX.Element} The rendered CheckboxInput component.
 */
export const CheckboxInput = ({
	label,
	name,
	options,
	wrapperClassName,
	className,
	id,
	error,
}: CheckboxInputProps): JSX.Element => {
	const { register, setValue, watch } = useFormContext();
	const selectedValues: string[] = watch(name) || [];

	const handleChange = (value: string) => {
		if (selectedValues.includes(value)) {
			setValue(
				name,
				selectedValues.filter((v) => v !== value),
				{ shouldValidate: true },
			);
		} else {
			setValue(name, [...selectedValues, value], { shouldValidate: true });
		}
	};

	return (
		<div className={cn("flex flex-col", wrapperClassName)} id={id}>
			<span className="mb-2 text-sm font-medium text-zinc-700">{label}</span>
			<div className="flex flex-col space-y-2">
				{options.map((option) => (
					<div key={option.value} className="flex items-top space-x-2">
						<Checkbox
							{...register(name)}
							id={option.value}
							checked={selectedValues.includes(option.value)}
							onCheckedChange={() => handleChange(option.value)}
							className={className}
						/>
						<div className="grid gap-1.5 leading-none">
							<label
								htmlFor={option.value}
								className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								{option.label}
							</label>
						</div>
					</div>
				))}
			</div>
			{error && (
				<p className="mt-1 text-sm text-red-500" role="alert">
					{error.message}
				</p>
			)}
		</div>
	);
};
