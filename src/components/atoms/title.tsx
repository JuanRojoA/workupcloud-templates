import React from "react";
import { cn } from "@/lib/utils";

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    children: React.ReactNode;
}

/**
 * A flexible and customizable heading component.
 *
 * This component allows you to render any heading level (h1-h6) with predefined font styles
 * and sizes. It provides a convenient way to create consistent headings throughout your application.
 *
 * @example
 * ```jsx
 * <Title as="h2">This is a level 2 heading</Title>
 * <Title as="h3" className="text-blue-500">Custom Styles</Title>
 * ```
 *
 * @component
 * @param {TitleProps} props - The component props.
 * @returns {JSX.Element} - The rendered Title component.
 */
export const Title: React.FC<TitleProps> = React.memo(
    ({ as: Component = "h1", children, className, ...props }) => (
        <Component
            className={cn(
                "font-bold",
                {
                    "text-4xl": Component === "h1",
                    "text-3xl": Component === "h2",
                    "text-2xl": Component === "h3",
                    "text-xl": Component === "h4",
                    "text-lg": Component === "h5",
                    "text-base": Component === "h6",
                },
                className,
            )}
            {...props}
        >
            {children}
        </Component>
    ),
);

Title.displayName = "Title";
