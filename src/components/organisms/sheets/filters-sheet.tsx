import React from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type FilterConfig, useFilters } from "@/hooks/useFilters";

interface FiltersSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: Record<string, string | string[]>) => void;
    onClear: () => void;
    filters: FilterConfig[];
    title?: string;
    description?: string;
    className?: string;
}

/**
 * A sheet component for displaying and managing advanced filters.
 *
 * This component provides a user-friendly interface for users to interact with various filter options,
 * including input fields, select dropdowns, and checkboxes. It allows users to refine their search results
 * by applying multiple filters.
 *
 * @example
 * ```jsx
 * <FiltersSheet
 *   isOpen={isFiltersSheetOpen}
 *   onClose={() => setIsFiltersSheetOpen(false)}
 *   onApply={handleApplyFilters}
 *   onClear={handleClearFilters}
 *   filters={[
 *     {
 *       id: 'name',
 *       label: 'Name',
 *       type: 'input',
 *       placeholder: 'Filter by name'
 *     },
 *     {
 *       id: 'type',
 *       label: 'Type',
 *       type: 'select',
 *       options: [
 *         { label: 'Email', value: 'EMAIL' },
 *         { label: 'SMS', value: 'SMS' },
 *         { label: 'Document', value: 'DOCUMENT' }
 *       ]
 *     },
 *     {
 *       id: 'status',
 *       label: 'Status',
 *       type: 'checkbox',
 *       options: [
 *         { label: 'Active', value: 'active' },
 *         { label: 'Inactive', value: 'inactive' },
 *         { label: 'Pending', value: 'pending' }
 *       ]
 *     }
 *   ]}
 * />
 * ```
 *
 * @component
 * @param {FiltersSheetProps} props - The component props.
 * @returns {JSX.Element} - The rendered FiltersSheet component.
 */
export const FiltersSheet: React.FC<FiltersSheetProps> = React.memo(
    ({
        isOpen,
        onClose,
        onApply,
        onClear,
        filters,
        title = "Advanced Filters",
        description = "Apply filters to refine your results.",
        className,
    }) => {
        // biome-ignore lint/correctness/noUnusedVariables: <explanation>
        const { filterValues, handleApply, handleClear, renderFilter } =
            useFilters(filters, onApply, onClear);

        return (
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent
                    side="right"
                    className={cn(
                        "w-[400px] sm:max-w-[25vw] sm:min-w-[270px] flex flex-col h-full p-0",
                        className,
                    )}
                >
                    <SheetHeader className="flex-shrink-0 p-4 pb-0">
                        <SheetTitle>{title}</SheetTitle>
                        <SheetDescription>{description}</SheetDescription>
                    </SheetHeader>
                    <div className="flex-grow overflow-y-auto p-4 pt-0">
                        <div className="grid gap-4 py-4">
                            {filters.map(renderFilter)}
                        </div>
                    </div>
                    <SheetFooter className="flex-shrink-0 flex justify-end p-2 shadow-[1px_-2px_0_#e5e7eb]">
                        <Button variant="outline" onClick={handleClear}>
                            Clear Filters
                        </Button>
                        <Button onClick={handleApply}>Apply Filters</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        );
    },
);
