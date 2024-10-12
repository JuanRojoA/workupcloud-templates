import React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TooltipSide = "top" | "right" | "bottom" | "left";
type TooltipAlign = "start" | "center" | "end";

interface ActionButtonProps extends ButtonProps {
	icon: React.ElementType;
	label: string;
	tooltipContent?: React.ReactNode;
	tooltipSide?: TooltipSide;
	tooltipAlign?: TooltipAlign;
	iconClassName?: string;
}

/**
 * A reusable action button component with an integrated tooltip.
 *
 * The `ActionButton` component renders a button containing an icon and an accessible label.
 * It integrates with the `Tooltip` component to display additional information on hover or focus.
 * This is useful for action items like adding, deleting, editing, or any other icon-based actions
 * that benefit from descriptive tooltips.
 *
 * ### Features:
 * - **Icon Integration**: Easily include any icon component within the button.
 * - **Accessibility**: The `label` prop ensures that screen readers can describe the button's purpose.
 * - **Customizable Tooltips**: Optionally provide custom tooltip content, position, and alignment.
 * - **Flexible Styling**: Pass additional class names to both the button and icon for styling.
 *
 * ### Usage Examples:
 *
 * ```jsx
 * import { PlusIcon, TrashIcon } from "@/icons";
 *
 * // Basic usage with default tooltip
 * <ActionButton
 *   icon={PlusIcon}
 *   label="Add Item"
 *   onClick={() => handleAddItem()}
 *   variant="outline"
 * />
 *
 * // Custom tooltip content and positioning
 * <ActionButton
 *   icon={TrashIcon}
 *   label="Delete"
 *   tooltipContent={<p>This will permanently delete the item.</p>}
 *   tooltipSide="right"
 *   tooltipAlign="start"
 *   onClick={() => handleDeleteItem()}
 * />
 *
 * // Custom icon styling
 * <ActionButton
 *   icon={SettingsIcon}
 *   label="Settings"
 *   iconClassName="text-blue-500"
 *   onClick={() => openSettings()}
 * />
 * ```
 *
 * @component
 * @param {ActionButtonProps} props - Props for configuring the ActionButton component.
 * @param {React.ElementType} props.icon - The icon component to display inside the button.
 * @param {string} props.label - The accessible label for the button.
 * @param {React.ReactNode} [props.tooltipContent] - The content to display inside the tooltip.
 * @param {TooltipSide} [props.tooltipSide="top"] - The side where the tooltip appears.
 * @param {TooltipAlign} [props.tooltipAlign="center"] - The alignment of the tooltip relative to the side.
 * @param {string} [props.iconClassName] - Additional class names for the icon component.
 * @param {string} [props.className] - Additional class names for the button component.
 * @param {ButtonProps} [props.buttonProps] - All other props are passed down to the underlying Button component.
 *
 * @returns {JSX.Element} The rendered ActionButton component.
 */
export const ActionButton = React.memo((props: ActionButtonProps) => {
	const {
		icon: Icon,
		label,
		tooltipContent,
		tooltipSide = "top",
		tooltipAlign = "center",
		iconClassName,
		className,
		...buttonProps
	} = props;

	return (
		<div>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							className={cn("relative", className)}
							{...buttonProps}
							aria-label={label}
						>
							<Icon className={cn("h-4 w-4", iconClassName)} />
							<span className="sr-only">{label}</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent side={tooltipSide} align={tooltipAlign}>
						{tooltipContent || <p>{label}</p>}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
});

ActionButton.displayName = "ActionButton";
