import { useId } from "react";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import type { FieldError } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

/**
 * Represents an option in the radio button group.
 */
interface RadioOption {
	label: string;
	value: string;
}

/**
 * Props for the RadioButtonInput component.
 */
interface RadioButtonInputProps {
	label: string;
	name: string;
	options: RadioOption[];
	wrapperClassName?: string;
	className?: string;
	error?: FieldError;
	id?: string;
}

/**
 * A radio button group component integrated with React Hook Form.
 *
 * The `RadioButtonInput` component renders a group of radio buttons based on provided options.
 * It integrates seamlessly with React Hook Form and Zod for form state management and validation.
 *
 * ### Usage Example:
 *
 * ```jsx
 * import React from "react";
 * import { useForm, FormProvider } from "react-hook-form";
 * import { z } from "zod";
 * import { zodResolver } from "@hookform/resolvers/zod";
 * import { RadioButtonInput } from "@/components/RadioButtonInput";
 *
 * const FormSchema = z.object({
 *   gender: z.string().nonempty({ message: "Please select a gender." }),
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
 *   const genderOptions = [
 *     { label: "Male", value: "male" },
 *     { label: "Female", value: "female" },
 *     { label: "Other", value: "other" },
 *   ];
 *
 *   return (
 *     <FormProvider {...methods}>
 *       <form onSubmit={handleSubmit(onSubmit)}>
 *         <RadioButtonInput
 *           label="Select Your Gender"
 *           name="gender"
 *           options={genderOptions}
 *           error={errors.gender}
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
 * @param {RadioButtonInputProps} props - Props for configuring the RadioButtonInput component.
 * @param {string} props.label - The label for the radio button group.
 * @param {string} props.name - The name of the form field (required for form integration).
 * @param {RadioOption[]} props.options - The list of options to render as radio buttons.
 * @param {string} [props.wrapperClassName] - Additional class names for the radio group wrapper.
 * @param {string} [props.className] - Additional class names for each radio button item.
 * @param {FieldError} [props.error] - The error object from React Hook Form.
 * @param {string} [props.id] - The id of the radio group.
 *
 * @returns {JSX.Element} The rendered RadioButtonInput component.
 */
export const RadioButtonInput = ({
	label,
	name,
	options,
	wrapperClassName,
	className,
	id,
	error,
}: RadioButtonInputProps) => {
	const { register, setValue, watch } = useFormContext();
	const selectedValue = watch(name);

	return (
		<div className={cn("flex flex-col", wrapperClassName)}>
			<span className="mb-2 text-sm font-medium text-zinc-700">{label}</span>
			<RadioGroup
				id={id || useId()}
				{...register(name)}
				defaultValue={selectedValue}
				onValueChange={(value) =>
					setValue(name, value, { shouldValidate: true })
				}
			>
				{options.map((option) => (
					<div key={option.value} className="flex items-center space-x-2">
						<RadioGroupItem
							value={option.value}
							id={option.value}
							className={className}
						/>
						<Label
							htmlFor={option.value}
							className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							{option.label}
						</Label>
					</div>
				))}
			</RadioGroup>
			{error && (
				<p className="mt-1 text-sm text-red-500" role="alert">
					{error.message}
				</p>
			)}
		</div>
	);
};
