import React from "react";
import { Home, ChevronRight, Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TPadding } from "@/types/TailwindPVariants";
import type { TMargin } from "@/types/TailwindMVariants";

/**
 * Represents a single item in the breadcrumb trail.
 */
interface BreadcrumbItem {
	label: string | React.ReactNode;
	href?: string;
}

/**
 * Props for the Breadcrumb component.
 */
interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
	items: BreadcrumbItem[];
	homeHref?: string;
	separator?: React.ReactNode;
	renderItem?: (item: BreadcrumbItem, index: number) => React.ReactNode;
	spacingPadding?: TPadding;
	spacingMargin?: TMargin;
	ellipsis?: React.ReactNode;
}

/**
 * A breadcrumb navigation component.
 *
 * The `Breadcrumb` component displays a breadcrumb trail, allowing users to navigate through a website's hierarchy.
 * It supports customization of the home link, separator, and individual item rendering. If more than 3 items are provided,
 * the breadcrumb will automatically truncate the middle items and display an ellipsis (...) to maintain a compact layout.
 *
 * ### Features:
 * - **Customizable Home Link**: Specify the URL for the home breadcrumb item.
 * - **Flexible Separator**: Use any React node as a separator between items.
 * - **Custom Item Rendering**: Provide a custom render function for advanced customization.
 * - **Responsive Truncation**: Automatically truncates middle items when the breadcrumb trail is too long.
 * - **Tailwind Spacing**: Customize padding and margin using Tailwind classes.
 * - **Enhanced Focus and Hover States**: Improved visual feedback for better user experience.
 * - **Click Animation**: Subtle animations to enhance interactivity.
 *
 * ### Usage Examples:
 *
 * ```jsx
 * import { Breadcrumb } from "@/components/Breadcrumb";
 *
 * const Example = () => (
 *   <Breadcrumb
 *     items={[
 *       { label: "Category", href: "/category" },
 *       { label: "Subcategory", href: "/category/subcategory" },
 *       { label: "Product" },
 *     ]}
 *   />
 * );
 * ```
 *
 * ```jsx
 * import { Breadcrumb } from "@/components/Breadcrumb";
 * import { CustomSeparator } from "@/components/CustomSeparator";
 *
 * const Example = () => (
 *   <Breadcrumb
 *     items={[
 *       { label: "Home", href: "/" },
 *       { label: "Library", href: "/library" },
 *       { label: "Data" },
 *       { label: "Reports" },
 *     ]}
 *     separator={<CustomSeparator />}
 *     spacingPadding="py-2"
 *     spacingMargin="my-4"
 *   />
 * );
 * ```
 *
 * @component
 * @param {BreadcrumbProps} props - Props for configuring the Breadcrumb component.
 * @param {BreadcrumbItem[]} props.items - An array of breadcrumb items to display.
 * @param {string} [props.homeHref="/"] - The URL for the home breadcrumb item.
 * @param {React.ReactNode} [props.separator=<ChevronRight className="h-4 w-4 mx-2" />] - The separator between breadcrumb items.
 * @param {(item: BreadcrumbItem, index: number) => React.ReactNode} [props.renderItem] - A custom render function for breadcrumb items.
 * @param {TPadding} [props.spacingPadding="py-0"] - Tailwind padding classes for spacing.
 * @param {TMargin} [props.spacingMargin="my-3"] - Tailwind margin classes for spacing.
 * @param {React.ReactNode} [props.ellipsis=<Ellipsis className="h-4 w-4 mx-2" />] - The ellipsis to display when truncating breadcrumb items.
 * @param {string} [props.className] - Additional custom class names to apply to the breadcrumb container.
 * @param {React.HTMLAttributes<HTMLElement>} [props...props] - Additional HTML attributes to apply to the breadcrumb container.
 *
 * @returns {JSX.Element} The rendered Breadcrumb component.
 */
export const Breadcrumb = React.memo((props: BreadcrumbProps) => {
	const {
		items,
		homeHref = "/",
		separator = <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />,
		renderItem,
		className,
		spacingPadding = "py-0",
		spacingMargin = "my-3",
		ellipsis = <Ellipsis className="h-4 w-4 mx-2 text-gray-400" />,
		...restProps
	} = props;

	const displayedItems: BreadcrumbItem[] = React.useMemo(() => {
		if (items.length > 3) {
			return [
				items[0],
				{ label: ellipsis, href: undefined },
				...items.slice(items.length - 2, items.length),
			];
		}
		return items;
	}, [items, ellipsis]);

	/**
	 * Renders a single breadcrumb item.
	 *
	 * @param {BreadcrumbItem} item - The breadcrumb item to render.
	 * @param {number} index - The index of the item in the breadcrumb trail.
	 * @returns {JSX.Element} The rendered breadcrumb item.
	 */
	const defaultRenderItem = (
		item: BreadcrumbItem,
		index: number,
	): JSX.Element => {
		const isLast = index === displayedItems.length - 1;
		return (
			<li key={index} className="flex items-center">
				{index > 0 && <span className="flex items-center">{separator}</span>}
				{item.href && !isLast ? (
					<a
						href={item.href}
						className="flex items-center text-zinc-600 rounded px-1 hover:text-zinc-800 focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 transition-colors duration-200"
						aria-current={isLast ? "page" : undefined}
					>
						{item.label}
					</a>
				) : (
					<span className="text-gray-700 font-semibold" aria-current="page">
						{item.label}
					</span>
				)}
			</li>
		);
	};

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
			{...restProps}
		>
			<ol className="flex items-center space-x-1">
				<li className="flex items-center">
					<a
						href={homeHref}
						className="flex items-center text-zinc-600 rounded p-px hover:text-zinc-800 focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 transition-colors duration-200"
						aria-label="Home"
					>
						<Home className="h-4 w-4 text-gray-400" aria-hidden="true" />
						<span className="sr-only">Home</span>
					</a>
				</li>
				{separator}
				{displayedItems.map((item, index) => renderFn(item, index))}
			</ol>
		</nav>
	);
});

Breadcrumb.displayName = "Breadcrumb";
