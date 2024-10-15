import { cn } from "@/lib/utils";
import type { TMargin } from "@/types/TailwindMVariants";
import type { TPadding } from "@/types/TailwindPVariants";
import { ChevronRight, Ellipsis, Home } from "lucide-react";
import React from "react";

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
 * This component displays a breadcrumb trail that helps users understand their location within a website or application.
 * It supports customization of the home link, separator, individual item rendering, and truncation behavior.
 *
 * The component is memoized using `React.memo` to optimize performance by preventing unnecessary re-renders.
 *
 * @component
 * @param {BreadcrumbProps} props - The props for the component.
 * @returns {JSX.Element} - The rendered breadcrumb navigation.
 *
 * @example
 * // Basic usage
 * <Breadcrumb
 *   items={[
 *     { label: "Home", href: "/" },
 *     { label: "Category", href: "/category" },
 *     { label: "Product" },
 *   ]}
 * />
 *
 * @example
 * // With custom separator and ellipsis
 * <Breadcrumb
 *   items={[ ... ]}
 *   separator={<span>/</span>}
 *   ellipsis={<span>...</span>}
 * />
 *
 * @example
 * // With custom item rendering
 * <Breadcrumb
 *   items={[ ... ]}
 *   renderItem={(item, index) => (
 *     <li key={index}>
 *       {item.href ? (
 *         <a href={item.href}>{item.label}</a>
 *       ) : (
 *         <span>{item.label}</span>
 *       )}
 *     </li>
 *   )}
 * />
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
						<span className="text-gray-700 font-semibold" aria-current="page">{item.label}</span>
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
