import type React from "react";
import { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface FloatingLabelInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    wrapperClassName?: string;
}

/**
 * An input component with a floating label.
 *
 * This component provides an input field with a label that animates to a floating position when the input
 * is focused or has a value. It enhances the user experience by providing a clear visual cue for the input field's purpose.
 *
 * The label seamlessly transitions between its initial position and the floating position, providing a smooth and
 * intuitive user experience.
 *
 * @example
 * ```jsx
 * <FloatingLabelInput
 *  label="Email"
 *  type="email"
 *  id="email-input"
 *  value={email}
 *  onChange={setEmail}
 *  ref={emailInputRef}
 * />
 * ```
 *
 * @param {FloatingLabelInputProps} props - The component props.
 * @param {React.Ref<HTMLInputElement>} [ref] - A ref to the underlying input element.
 * @returns {JSX.Element} - The rendered FloatingLabelInput component.
 */
export const FloatingLabelInput = forwardRef<
    HTMLInputElement,
    FloatingLabelInputProps
>(
    (
        { label, wrapperClassName, className, value = "", onChange, ...rest },
        ref,
    ) => {
        const [isFocused, setIsFocused] = useState(false);

        const hasValue = ((value as string) ?? "").length > 0;

        return (
            <div className={cn("relative", wrapperClassName)}>
                <Input
                    ref={ref}
                    className={cn(
                        "peer placeholder:text-transparent",
                        { "border-primary": isFocused },
                        className,
                    )}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={onChange}
                    value={value}
                    {...rest}
                />
                <label
                    htmlFor={rest.id}
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

FloatingLabelInput.displayName = "FloatingLabelInput";
