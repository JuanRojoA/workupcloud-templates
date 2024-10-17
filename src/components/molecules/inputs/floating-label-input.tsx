import { useElementSize } from "@/hooks/useElementSize.ts";
import React, { forwardRef, useCallback, useRef } from "react";
import type {
	Control,
	FieldError,
	FieldValues,
	RegisterOptions,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import Icon from "@/components/atoms/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input.tsx";
import { useFloatingLabelInput } from "@/hooks/useFloatingLabelInput";
import { cn } from "@/lib/utils.ts";

interface FloatingLabelInputProps<T = any>
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
	type?: InputType;
	label: string;
	name: string;
	wrapperClassName?: string;
	className?: string;
	error?: FieldError;
	id?: string;
	control?: Control<FieldValues, T>;
	actionButtonOne?: {
		label: string;
		iconName: string;
		onClick: () => void;
	};
	actionButtonTwo?: {
		label: string;
		iconName: string;
		onClick: () => void;
	};
	rules?: RegisterOptions;
}

type InputType =
	| "text"
	| "password"
	| "email"
	| "number"
	| "tel"
	| "url"
	| "search";

/**
 * A floating label input component.
 * It supports both controlled and uncontrolled modes, integrates with react-hook-form,
 * and allows for custom icons.
 *
 * @example
 * // Controlled mode with react-hook-form
 * <FloatingLabelInput
 *     label="Email"
 *     name="email"
 *     control={control}
 *     rules={{ required: 'Email is required' }}
 * />
 *
 * @example
 * // Uncontrolled mode with custom icon
 * <FloatingLabelInput
 *     label="Password"
 *     name="password"
 *     type="password"
 *     iconName="eye"
 * />
 *
 * @template T
 * @param {FloatingLabelInputProps<T>} props - The props for the component.
 * @param {React.ForwardedRef<HTMLInputElement>} ref - A ref to the input element.
 * @returns {React.ReactElement} - The rendered floating label input component.
 */
const FloatingLabelInput = forwardRef<
	HTMLInputElement,
	FloatingLabelInputProps
>(
	<T,>(
		props: FloatingLabelInputProps<T>,
		ref: React.ForwardedRef<HTMLInputElement>,
	): React.ReactElement => {
		const {
			type = "text",
			label,
			name,
			wrapperClassName,
			className,
			id,
			error,
			control,
			actionButtonOne,
			actionButtonTwo,
			rules,
			...rest
		} = props;

		const {
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
		} = useFloatingLabelInput<T>(
			{
				name,
				id,
				control,
				error,
				...rest,
			},
			ref,
		);

		const buttonsContainerRef = useRef<HTMLDivElement>(null);

		const { width } = useElementSize(buttonsContainerRef);

		/**
		 * Renders the input field with floating label and optional icon.
		 *
		 * @param {string | number | readonly string[] | undefined} fieldValue - The current value of the input field.
		 * @param {function} fieldOnChange - Function to handle input change events.
		 * @param {function} fieldOnBlur - Function to handle input blur events.
		 * @returns {React.ReactElement} The rendered input field with floating label and optional icon.
		 */
		const renderInput = useCallback(
			(
				fieldValue: string | number | readonly string[] | undefined,
				fieldOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
				fieldOnBlur: (e: React.FocusEvent<HTMLInputElement>) => void,
			): React.ReactElement => (
				<div className="relative flex items-center w-full">
					<div className="relative flex items-center w-full">
						<Input
							id={inputId}
							type={type}
							value={fieldValue ?? ""}
							onChange={(e) => {
								fieldOnChange(e);
								handleChange(e);
							}}
							onBlur={(e) => {
								fieldOnBlur(e);
								handleBlur(e);
							}}
							onFocus={handleFocus}
							className={cn(
								"peer placeholder-transparent transition-colors",
								{
									"border-primary focus:border-primary":
										isFocused && !effectiveError,
									"border-red-500 focus:border-red-500": effectiveError,
								},
								className,
							)}
							style={{ paddingRight: width + 12 + "px" }}
							aria-invalid={effectiveError ? "true" : "false"}
							aria-describedby={effectiveError ? `${inputId}-error` : undefined}
							ref={mergedRef}
							{...rest}
						/>
						<label
							htmlFor={inputId}
							className={cn(
								"absolute left-3 top-[47%] transform -translate-y-1/2 transition-all duration-200 ease-in-out text-zinc-600 pointer-events-none bg-white px-1 leading-[1]",
								{
									"text-xs -top-0.5 left-2 font-semibold bg-white rounded-md":
										shouldFloat,
									"text-sm": !shouldFloat,
									"text-red-500": effectiveError,
								},
							)}
						>
							{label}
						</label>
					</div>
					<div
						className="absolute top-1/2 -translate-y-1/2 right-1 flex items-center gap-2 h-full w-max"
						ref={buttonsContainerRef}
					>
						{actionButtonOne && (
							<Button
								variant="outline"
								type="button"
								aria-label={`${actionButtonOne.label} icon`}
								className="flex items-center px-2 h-[80%] shadow-none border-none"
								onClick={(e) => {
									e.preventDefault();
									actionButtonOne.onClick();
								}}
							>
								<Icon
									iconName={actionButtonOne.iconName}
									propsIcon={{ size: "20px", color: "black" }}
								/>
							</Button>
						)}
						{actionButtonTwo && (
							<Button
								variant="outline"
								type="button"
								aria-label={`${actionButtonTwo.label} icon`}
								className="flex items-center px-2 h-[80%] shadow-none border-none"
								onClick={(e) => {
									e.preventDefault();
									actionButtonTwo.onClick();
								}}
							>
								<Icon
									iconName={actionButtonTwo.iconName}
									propsIcon={{ size: "20px", color: "black" }}
								/>
							</Button>
						)}
					</div>
				</div>
			),
			[
				inputId,
				type,
				isFocused,
				effectiveError,
				className,
				actionButtonOne,
				actionButtonTwo,
				handleChange,
				handleBlur,
				handleFocus,
				shouldFloat,
				label,
				mergedRef,
				rest,
			],
		);

		return (
			<div className={cn("relative w-full", wrapperClassName)}>
				{effectiveControl ? (
					<Controller
						name={name}
						control={effectiveControl}
						rules={rules}
						render={({ field }) =>
							renderInput(field.value, field.onChange, field.onBlur)
						}
					/>
				) : props.value !== undefined || props.onChange ? (
					renderInput(props.value, props.onChange || (() => {}), (e) => {
						props.onBlur?.(e);
						handleBlur(e);
					})
				) : (
					renderInput(internalValue, handleChange, handleBlur)
				)}

				{typeof effectiveError?.message === "string" &&
					effectiveError.message && (
						<p
							id={`${inputId}-error`}
							className="mt-1 text-sm text-red-500"
							role="alert"
						>
							{effectiveError.message}
						</p>
					)}
			</div>
		);
	},
);

FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput, type FloatingLabelInputProps, type InputType };
