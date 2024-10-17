import React, {
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
	Ref,
	ChangeEvent,
	FocusEvent,
} from "react";
import type {
	Control,
	FieldError,
	FieldErrorsImpl,
	FieldValues,
	Merge,
} from "react-hook-form";
import { useFormContext } from "react-hook-form";

interface UseFloatingLabelInputProps<T = any>
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
	name: string;
	id?: string;
	control?: Control<FieldValues, T>;
	error?: FieldError | { [key: string]: string };
}

interface UseFloatingLabelInputReturn<T> {
	inputId: string;
	isFocused: boolean;
	shouldFloat: boolean;
	effectiveControl: Control<FieldValues, T> | undefined;
	effectiveError:
		| FieldError
		| { [key: string]: string }
		| Merge<FieldError, FieldErrorsImpl<any>>
		| undefined;
	internalValue: string | number | readonly string[] | undefined;
	mergedRef: (node: HTMLInputElement | null) => void;
	handleChange: React.ChangeEventHandler<HTMLInputElement>;
	handleBlur: React.FocusEventHandler<HTMLInputElement>;
	handleFocus: React.FocusEventHandler<HTMLInputElement>;
}

/**
 * Type guard to check if a ref is a mutable ref object.
 *
 * @template T
 * @param {Ref<T>} ref - The ref to check.
 * @returns {ref is React.MutableRefObject<T>} - True if mutable ref, else false.
 */
const isMutableRef = <T>(ref: Ref<T>): ref is React.MutableRefObject<T> => {
	return (
		ref !== null &&
		typeof ref === "object" &&
		"current" in ref &&
		!Object.isFrozen(ref)
	);
};

/**
 * Custom hook for managing the state and behavior of a floating label input.
 *
 * @template T
 * @param {UseFloatingLabelInputProps<T>} props - Props for the floating label input.
 * @param {Ref<HTMLInputElement>} ref - Forwarded ref from the component.
 * @returns {UseFloatingLabelInputReturn<T>} - Managed states and handlers.
 */
export function useFloatingLabelInput<T = any>(
	props: UseFloatingLabelInputProps<T>,
	ref: Ref<HTMLInputElement | null>,
): UseFloatingLabelInputReturn<T> {
	const {
		name,
		id,
		control,
		error,
		onChange,
		onBlur,
		onFocus,
		value: propValue,
	} = props;

	// Generate a unique ID if not provided
	const generatedId = useId();
	const inputId = id || `floating-input-${generatedId}`;

	// State to manage focus
	const [isFocused, setIsFocused] = useState(false);

	// State to manage the input's value
	const [internalValue, setInternalValue] = useState<
		string | number | readonly string[] | undefined
	>(propValue);

	// Internal ref to access the input element
	const inputRef = useRef<HTMLInputElement | null>(null);

	// Access form context if available
	const { control: contextControl, formState } = useFormContext() || {};

	// Determine which control to use: prop or context
	const effectiveControl = control || contextControl;

	// Determine the effective error from prop or context
	const effectiveError = error || formState?.errors[name];

	// Determine if the label should float
	const shouldFloat = React.useMemo(() => {
		if (isFocused) return true;
		if (typeof internalValue === "string") {
			return internalValue.trim() !== "";
		}
		return Boolean(internalValue);
	}, [isFocused, internalValue]);

	/**
	 * Handler for input change events.
	 *
	 * @param {ChangeEvent<HTMLInputElement>} e - The change event.
	 */
	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setInternalValue(e.target.value);
			onChange?.(e);
		},
		[onChange],
	);

	/**
	 * Handler for input blur events.
	 *
	 * @param {FocusEvent<HTMLInputElement>} e - The blur event.
	 */
	const handleBlur = useCallback(
		(e: FocusEvent<HTMLInputElement>) => {
			setIsFocused(false);
			onBlur?.(e);
		},
		[onBlur],
	);

	/**
	 * Handler for input focus events.
	 *
	 * @param {FocusEvent<HTMLInputElement>} e - The focus event.
	 */
	const handleFocus = useCallback(
		(e: FocusEvent<HTMLInputElement>) => {
			setIsFocused(true);
			onFocus?.(e);
		},
		[onFocus],
	);

	// Sync internal value with prop value in controlled mode
	useEffect(() => {
		if (propValue !== undefined) {
			setInternalValue(propValue);
		}
	}, [propValue]);

	// Handle autofill by checking the input value on mount
	useEffect(() => {
		const currentInput = inputRef.current;
		if (currentInput && currentInput.value) {
			setInternalValue(currentInput.value);
		}
	}, []);

	/**
	 * Merges the internal ref with the forwarded ref.
	 *
	 * @param {HTMLInputElement | null} node - The input element node.
	 */
	const mergedRef = useCallback(
		(node: HTMLInputElement | null) => {
			inputRef.current = node;

			if (typeof ref === "function") {
				ref(node);
			} else if (isMutableRef(ref)) {
				(ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
			}
		},
		[ref],
	);

	return {
		inputId,
		isFocused,
		shouldFloat,
		effectiveControl,
		effectiveError,
		internalValue,
		mergedRef,
		handleChange,
		handleBlur,
		handleFocus,
	};
}
