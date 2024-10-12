import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButtonProps extends ButtonProps {
    icon: React.ElementType;
    label: string;
    tooltipContent?: React.ReactNode;
    tooltipSide?: "top" | "right" | "bottom" | "left";
    tooltipAlign?: "start" | "center" | "end";
    iconClassName?: string;
}

/**
 * A reusable action button component with an integrated tooltip.
 *
 * This component renders a button with an icon and optional tooltip. It utilizes the `Tooltip` component
 * from `@/components/ui/tooltip` to provide a user-friendly way to display additional information
 * on hover.
 *
 * The button's label is used for accessibility purposes and as the default tooltip content if no
 * custom `tooltipContent` is provided.
 *
 * @example
 * ```jsx
 * <ActionButton
 *   icon={PlusIcon}
 *   label="Add Item"
 *   onClick={() => handleAddItem()}
 *   variant="outline"
 * />
 *
 * <ActionButton
 *   icon={TrashIcon}
 *   label="Delete"
 *   tooltipContent={<p>This will permanently delete the item.</p>}
 *   tooltipSide="right"
 *   onClick={() => handleDeleteItem()}
 * />
 * ```
 *
 * @component
 * @param {ActionButtonProps} props - The component props.
 * @returns {JSX.Element} - The rendered ActionButton component.
 */
export const ActionButton: React.FC<ActionButtonProps> = React.memo(
    ({
        icon: Icon,
        label,
        tooltipContent,
        tooltipSide = "top",
        tooltipAlign = "center",
        iconClassName,
        className,
        ...buttonProps
    }: ActionButtonProps) => (
        //* NOTE: the wrapping div is necessary for the tooltip to be positioned correctly
        <div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className={cn("relative", className)}
                            {...buttonProps}
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
    ),
);

ActionButton.displayName = "ActionButton";
