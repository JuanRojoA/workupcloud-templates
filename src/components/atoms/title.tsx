import { cn } from "@/lib/utils";
import React from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: HeadingLevel;
    children: React.ReactNode;
    className?: string;
    ariaLabel?: string;
    tabIndex?: number;
}

/**
 * A React component for rendering accessible and customizable heading elements.
 *
 * This component allows you to render any heading level (h1-h6) with custom styling and accessibility features.
 * It also supports optional click handlers and ARIA labels.
 *
 * The component is memoized using `React.memo` to optimize performance by preventing unnecessary re-renders.
 *
 * @component
 * @param {TitleProps} props - The props for the component.
 * @param {HeadingLevel} props.as - The heading level to render. Defaults to "h1".
 * @param {React.ReactNode} props.children - The content of the heading.
 * @param {string} [props.className] - The class name to apply to the heading element.
 * @param {string} [props.ariaLabel] - The ARIA label for the heading element.
 * @param {number} [props.tabIndex] - The tab index for the heading element.
 * @returns {React.ReactElement} - The rendered heading element.
 *
 * @example
 * // Basic usage
 * <Title as="h2">This is a heading</Title>
 *
 * @example
 * // With custom class name and click handler
 * <Title as="h3" className="text-blue-500" onClick={handleClick}>
 *   This is a clickable heading
 * </Title>
 *
 * @example
 * // With ARIA label and tab index
 * <Title as="h4" ariaLabel="Section title" tabIndex={0}>
 *   This is an accessible heading
 * </Title>
 */
export const Title = React.memo(
    ({
        as = "h1",
        children,
        className,
        tabIndex,
        onClick,
        ariaLabel,
        ...props
    }: TitleProps): React.ReactElement => {
        const HeadingTag = as;

        const sizeClasses: Record<HeadingLevel, string> = {
            h1: "text-2xl",
            h2: "text-xl",
            h3: "text-lg",
            h4: "text-base",
            h5: "text-base",
            h6: "text-base",
        };

        /**
         * Handles keydown events on the heading element to simulate a click
         * when the user presses Enter or Space.
         *
         * @param {React.KeyboardEvent} event - The keydown event.
         * @returns {void}
         */
        const handleKeyDown = (event: React.KeyboardEvent): void => {
            if (onClick && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                (event.target as HTMLElement).click();
            }
        };

        return (
            <HeadingTag
                className={cn("font-bold", sizeClasses[as], className)}
                tabIndex={
                    onClick
                        ? tabIndex !== undefined
                            ? tabIndex
                            : 0
                        : undefined
                }
                onClick={onClick}
                onKeyDown={onClick ? handleKeyDown : undefined}
                role={onClick ? "button" : undefined}
                aria-label={ariaLabel}
                {...props}
            >
                {children}
            </HeadingTag>
        );
    },
);

Title.displayName = "Title";
