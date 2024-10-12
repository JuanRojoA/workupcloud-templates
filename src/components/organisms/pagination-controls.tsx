import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxVisibleButtons?: number;
    className?: string;
    showFirstLast?: boolean;
    showPrevNext?: boolean;
    prevLabel?: string;
    nextLabel?: string;
    firstLabel?: string;
    lastLabel?: string;
}

/**
 * A React component for rendering pagination controls.
 *
 * This component provides a user-friendly interface for navigating through multiple pages of data.
 * It supports customization of the number of visible page buttons, labels, and the display of "First" and "Last" buttons.
 *
 * @example
 * ```jsx
 * <PaginationControls
 *   currentPage={currentPage}
 *   totalPages={10}
 *   onPageChange={setCurrentPage}
 * />
 * ```
 *
 * @component
 * @param {PaginationControlsProps} props - The component props.
 * @returns {JSX.Element} - The rendered PaginationControls component.
 */
export const PaginationControls: React.FC<PaginationControlsProps> = React.memo(
    ({
        currentPage,
        totalPages,
        onPageChange,
        maxVisibleButtons = 5,
        className,
        showFirstLast = false,
        showPrevNext = true,
        prevLabel = "Previous",
        nextLabel = "Next",
        firstLabel = "First",
        lastLabel = "Last",
    }) => {
        const pageNumbers = useMemo(() => {
            const pages: (number | string)[] = [];
            if (totalPages <= maxVisibleButtons) {
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                const leftSide = Math.floor(maxVisibleButtons / 2);
                const rightSide = maxVisibleButtons - leftSide - 1;

                if (currentPage > leftSide + 1) {
                    pages.push(1);
                    if (currentPage > leftSide + 2) {
                        pages.push("...");
                    }
                }

                for (
                    let i = Math.max(1, currentPage - leftSide);
                    i <= Math.min(totalPages, currentPage + rightSide);
                    i++
                ) {
                    pages.push(i);
                }

                if (currentPage < totalPages - rightSide) {
                    if (currentPage < totalPages - rightSide - 1) {
                        pages.push("...");
                    }
                    pages.push(totalPages);
                }
            }
            return pages;
        }, [currentPage, totalPages, maxVisibleButtons]);

        const renderPageButton = (page: number | string, index: number) => {
            if (typeof page === "number") {
                return (
                    <Button
                        key={index}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </Button>
                );
            }
            return (
                <Button key={index} variant="outline" size="sm" disabled>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            );
        };

        return (
            <div className={cn("flex items-center space-x-1", className)}>
                {showFirstLast && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                    >
                        {firstLabel}
                    </Button>
                )}
                {showPrevNext && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        {prevLabel}
                    </Button>
                )}
                {pageNumbers.map(renderPageButton)}
                {showPrevNext && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        {nextLabel}
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                )}
                {showFirstLast && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        {lastLabel}
                    </Button>
                )}
            </div>
        );
    },
);

PaginationControls.displayName = "PaginationControls";
