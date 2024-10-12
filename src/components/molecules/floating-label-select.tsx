import { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type * as RadixSelect from "@radix-ui/react-select";

type RadixSelectProps = RadixSelect.SelectProps;
type RadixSelectTriggerProps = RadixSelect.SelectTriggerProps;

interface FloatingLabelSelectProps {
    id: string;
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    wrapperClassName?: string;
    className?: string;
    selectProps?: RadixSelectProps;
    triggerProps?: RadixSelectTriggerProps;
}

/**
 * A select component with a floating label.
 *
 * This component provides a select dropdown with a label that animates to a floating position when an option is selected.
 * It enhances the user experience by providing a clear visual cue for the select element's purpose and the currently selected value.
 *
 * @example
 * ```jsx
 * <FloatingLabelSelect
 *   id="country-select"
 *   label="Country"
 *   options={[
 *     { value: "us", label: "United States" },
 *     { value: "ca", label: "Canada" },
 *     { value: "mx", label: "Mexico" },
 *   ]}
 *   value={selectedCountry}
 *   onChange={setSelectedCountry}
 *   selectProps={}
 *   triggerProps={}
 *   ref={countrySelectRef}
 * />
 * ```
 *
 * @component
 * @param {FloatingLabelSelectProps} props - The component props.
 * @param {React.Ref<HTMLButtonElement>} [ref] - A ref to the underlying button element of the `SelectTrigger`.
 * @returns {JSX.Element} - The rendered FloatingLabelSelect component.
 */
export const FloatingLabelSelect = forwardRef<
    HTMLButtonElement,
    FloatingLabelSelectProps
>(
    (
        {
            id,
            label,
            options,
            value = "",
            onChange,
            wrapperClassName,
            className,
            selectProps = {},
            triggerProps = {},
        },
        ref,
    ) => {
        const [isFocused, setIsFocused] = useState(false);

        // Determine if the select has a value
        const hasValue = value.length > 0;

        return (
            <div className={cn("relative w-full", wrapperClassName)}>
                <Select value={value} onValueChange={onChange} {...selectProps}>
                    <SelectTrigger
                        ref={ref}
                        className={cn(
                            "peer w-full",
                            { "border-primary": isFocused },
                            className,
                        )}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...triggerProps}
                    >
                        <SelectValue placeholder="" />{" "}
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <label
                    htmlFor={id}
                    className={cn(
                        "absolute left-1 top-1/2 -translate-y-1/2 transition-all duration-200 peer-focus:text-xs peer-focus:-top-0.5 peer-focus:font-semibold peer-focus:bg-zinc-100 rounded px-2 text-sm text-zinc-600 peer-focus:left-2 ",
                        {
                            "text-xs -top-0.5 font-semibold bg-zinc-100 left-2":
                                hasValue && !isFocused,
                            "text-zinc-900 font-semibold": isFocused,
                        },
                    )}
                >
                    {label}
                </label>
            </div>
        );
    },
);

FloatingLabelSelect.displayName = "FloatingLabelSelect";
