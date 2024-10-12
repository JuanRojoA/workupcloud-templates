import React from "react";
import { Home, ChevronRight, Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TPadding } from "@/types/TailwindPVariants";
import type { TMargin } from "@/types/TailwindMVariants";

interface BreadcrumbItem {
	label: string | React.ReactNode;
	href?: string;
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
	items: BreadcrumbItem[];
	homeHref?: string;
	separator?: React.ReactNode;
	renderItem?: (item: BreadcrumbItem, index: number) => React.ReactNode;
	spacingPadding?: TPadding;
	spacingMargin?: TMargin;
}

/**
 * A breadcrumb navigation component.
 *
 * This component displays a breadcrumb trail, allowing users to easily navigate through a website's hierarchy.
 * It supports customization of the home link, separator, and individual item rendering.
 *
 * If more than 3 items are provided, the breadcrumb will automatically truncate the middle items
 * and display an ellipsis (...) to maintain a compact layout.
 *
 * @example
 * ```jsx
 * <Breadcrumb
 *   items={[
 *     { label: "Category", href: "/category" },
 *     { label: "Subcategory", href: "/category/subcategory" },
 *     { label: "Product" },
 *   ]}
 * />
 * ```
 *
 * @component
 * @param {BreadcrumbProps} props - The component props.
 * @returns {JSX.Element} - The rendered Breadcrumb component.
 */
export const Breadcrumb = React.memo(
	({
		items,
		homeHref = "/",
		separator = <ChevronRight className="h-4 w-4 mx-2" />,
		renderItem,
		className,
		spacingPadding = "py-0",
		spacingMargin = "my-3",
		...props
	}: BreadcrumbProps) => {
		const displayedItems = [...items];

		if (items.length > 3) {
			displayedItems.splice(1, items.length - 3, {
				label: <Ellipsis className="h-4 w-4 mx-2" />,
			});
		}

		/**
		 * A default function to render each breadcrumb item.
		 *
		 * It renders the item as a link if `href` is provided, otherwise it renders as a plain text.
		 * The separator is rendered between each item if `index > 0`.
		 *
		 * @param {BreadcrumbItem} item - A breadcrumb item.
		 * @param {number} index - The index of the item in the `items` array.
		 * @returns {JSX.Element} - The rendered item element.
		 */
		const defaultRenderItem = (item: BreadcrumbItem, index: number) => (
			<span key={index} className="flex items-center">
				{index > 0 && separator}
				{item.href ? (
					<a href={item.href} className="hover:underline">
						{item.label}
					</a>
				) : (
					<span className="font-semibold">{item.label}</span>
				)}
			</span>
		);

		const renderFn = renderItem || defaultRenderItem;

		return (
			<nav
				className={cn(
					"flex items-center text-sm text-gray-500",
					spacingPadding,
					spacingMargin,
					className,
				)}
				aria-label="Breadcrumb"
				{...props}
			>
				<a href={homeHref} className="flex items-center hover:underline">
					<Home className="mr-2 h-4 w-4" />
					<span className="sr-only">Home</span>
				</a>
				{separator}
				{displayedItems.map((item, index) => renderFn(item, index))}
			</nav>
		);
	},
);

Breadcrumb.displayName = "Breadcrumb";
