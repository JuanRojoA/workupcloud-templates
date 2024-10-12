import React from "react";
import { cn } from "@/lib/utils";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	as?: HeadingLevel;
	children: React.ReactNode;
	className?: string;
	ariaLabel?: string;
}

/**
 * A flexible and customizable heading component for rendering different
 * heading levels (`<h1>` to `<h6>`). The component applies default font
 * styles and sizes based on the heading level, ensuring consistent typography.
 *
 * This component allows you to control both the semantic HTML tag (for
 * accessibility and SEO) and the visual appearance via props, making it
 * a versatile option for titles across the application.
 *
 * ### Usage:
 * - Use the `as` prop to specify the heading level (`h1-h6`).
 * - You can pass children (text or elements) to define the content.
 * - Customize the appearance further by adding class names with the `className` prop.
 * - Optionally, add `id` for in-page linking or ARIA attributes for enhanced accessibility.
 *
 * @component
 * @param {TitleProps} props - Props for configuring the Title component.
 * @param {HeadingLevel} [props.as="h1"] - The heading level (h1-h6) to render.
 * @param {React.ReactNode} props.children - The content to display within the heading.
 * @param {string} [props.className] - Additional CSS classes to apply for customization.
 * @param {string} [props.ariaLabel] - Accessible label for the heading.
 *
 * @example
 * ```jsx
 * // Basic usage with default h1
 * <Title>Page Title</Title>
 *
 * // Specifying a different heading level (h2)
 * <Title as="h2">Section Title</Title>
 *
 * // Applying additional styles
 * <Title as="h3" className="text-red-500">Custom Styled Heading</Title>
 *
 * // Interactive heading with keyboard navigation
 * <Title as="h2" onClick={handleClick} className="cursor-pointer">
 * 	Clickable Section Title
 * </Title>
 * ```
 *
 * @returns {JSX.Element} The rendered heading element.
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
	}: TitleProps) => {
		const HeadingTag = as;

		const sizeClasses: Record<HeadingLevel, string> = {
			h1: "text-4xl",
			h2: "text-3xl",
			h3: "text-2xl",
			h4: "text-xl",
			h5: "text-lg",
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
				tabIndex={onClick ? (tabIndex !== undefined ? tabIndex : 0) : undefined}
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
