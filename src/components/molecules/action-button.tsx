import { Button, type ButtonProps } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React from "react";

type TooltipSide = "top" | "right" | "bottom" | "left";
type TooltipAlign = "start" | "center" | "end";
type ButtonSize = "default" | "sm" | "lg" | "icon";
type ButtonVariant =
	| "default"
	| "outline"
	| "ghost"
	| "link"
	| "destructive"
	| "secondary";

/**
 * Props for the ActionButton component.
 */
interface ActionButtonProps extends ButtonProps {
	icon: React.ElementType;
	label: string;
	tooltipContent?: React.ReactNode;
	tooltipSide?: TooltipSide;
	tooltipAlign?: TooltipAlign;
	iconClassName?: string;
	size?: ButtonSize;
	variant?: ButtonVariant;
}

/**
 * A reusable action button component with an integrated tooltip.
 *
 * This component provides a button with an icon, and a tooltip that displays on hover.
 * It is designed to be flexible and customizable, allowing you to specify the icon, label,
 * tooltip content, placement, and styling.
 *
 * The component is memoized using `React.memo` to optimize performance by preventing unnecessary re-renders.
 *
 * @component
 * @param {ActionButtonProps} props - The props for the component.
 * @returns {React.ReactElement} - The rendered action button component.
 *
 * @example
 * // Basic usage
 * <ActionButton icon={PlusIcon} label="Add Item" onClick={addItem} />
 *
 * @example
 * // With custom tooltip content and placement
 * <ActionButton
 *   icon={TrashIcon}
 *   label="Delete"
 *   tooltipContent={<p>Are you sure you want to delete this?</p>}
 *   tooltipSide="right"
 *   onClick={deleteItem}
 * />
 */
export const ActionButton = React.memo((props: ActionButtonProps): React.ReactElement => {
	const {
		icon: Icon,
		label,
		tooltipContent,
		tooltipSide = "top",
		tooltipAlign = "center",
		iconClassName,
		className,
		size = "default",
		variant = "default",
		...buttonProps
	} = props;

	const iconSizeClasses: Record<typeof size, string> = {
		default: "h-4 w-4",
		sm: "h-3 w-3",
		lg: "h-6 w-6",
		icon: "h-4 w-4",
	};

	return (
		// NOTE: This div is used to ensure the tooltip is positioned correctly
		<div>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						className={cn("relative", className)}
						size={size}
						variant={variant}
						{...buttonProps}
						aria-label={label}
					>
						<Icon
							className={cn(iconSizeClasses[size], iconClassName)}
							aria-hidden="true"
						/>
						<span className="sr-only">{label}</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent side={tooltipSide} align={tooltipAlign}>
					{tooltipContent || <p>{label}</p>}
				</TooltipContent>
			</Tooltip>
		</div>
	);
});

ActionButton.displayName = "ActionButton";
