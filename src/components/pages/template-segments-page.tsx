"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Title } from "@/components/atoms/title";
import { Breadcrumb } from "@/components/molecules/breadcrumb";
import { ActionButton } from "@/components/molecules/action-button";
import { FilterInput } from "@/components/molecules/filter-input";
import { TemplateSegmentsTable } from "@/components/templates/template-segments-table";
import { PaginationControls } from "@/components/organisms/pagination-controls";
import { ExportDialog } from "@/components/organisms/dialogs/export-dialog";
import { DeleteDialog } from "@/components/organisms/dialogs/delete-dialog";
import { FiltersSheet } from "@/components/organisms/sheets/filters-sheet";
import { AddNewSegmentSheet } from "@/components/organisms/sheets/add-segment-sheet";
import { Download, Filter, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { faker } from "@faker-js/faker";
import type {
    SortingState,
    ColumnFiltersState,
    VisibilityState,
} from "@tanstack/react-table";
import type { TemplateSegment } from "@/types/index";
import { FloatingLabelInput } from "../molecules/inputs/floating-label-input.tsx";
import { FloatingLabelSelect } from "../molecules/inputs/floating-label-select.tsx";

const pageSize = 10;
const totalPages = 5;

export default function TemplateSegmentsPage() {
    const nameFilterRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState("");

    const countrySelectRef = useRef<HTMLButtonElement>(null);
    const [selectedCountry, setSelectedCountry] = useState("");

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
        {},
    );
    const [data, setData] = useState<TemplateSegment[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddNewOpen, setIsAddNewOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const filterConfig = [
        {
            id: "name",
            label: "Name",
            type: "input",
            placeholder: "Filter by name",
        },
        {
            id: "type",
            label: "Type",
            type: "select",
            options: [
                { label: "Email", value: "EMAIL" },
                { label: "SMS", value: "SMS" },
                { label: "Document", value: "DOCUMENT" },
            ],
        },
        {
            id: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Pending", value: "pending" },
            ],
        },
    ];

    // Fetch data whenever currentPage or sorting changes
    useEffect(() => {
        setData(generateMockData(currentPage, pageSize, sorting));
    }, [currentPage, sorting]);

    // Handle Export
    const handleExport = useCallback(() => {
        console.log("Exporting segments");
        setIsExportDialogOpen(false);
    }, []);

    // Handle Delete
    const handleDelete = useCallback(() => {
        console.log("Deleting selected segments");
        setIsDeleteDialogOpen(false);
    }, []);

    // Handle Apply Filters
    const handleApplyFilters = useCallback(() => {
        console.log("Applying filters");
        setIsFiltersOpen(false);
    }, []);

    // Handle Clear Filters
    const handleClearFilters = useCallback(() => {
        setColumnFilters([]);
        console.log("Cleared filters");
    }, []);

    // Handle Save New Segment
    const handleSaveNewSegment = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving new segment");
        setIsAddNewOpen(false);
    }, []);

    // Calculate selected rows count
    const selectedRowsCount = useMemo(() => {
        return Object.values(rowSelection).filter(Boolean).length;
    }, [rowSelection]);

    return (
        <div className="container mx-auto py-4 px-4">
            <Title as="h1">Template Segments</Title>
            <Breadcrumb
                items={[
                    { label: "Templates", href: "#" },
                    { label: "Template Segments" },
                ]}
            />
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    {selectedRowsCount > 0 && (
                        <>
                            <Button
                                variant="destructive"
                                onClick={() => setIsDeleteDialogOpen(true)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Selected
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                {selectedRowsCount} of {data.length} row(s)
                                selected.
                            </span>
                        </>
                    )}
                </div>
                <div className="flex items-center justify-between space-2 w-full mt-2">
                    <div className="flex items-center grow w-full">
                        <FloatingLabelInput
                            ref={nameFilterRef}
                            label="Name"
                            wrapperClassName="w-full max-w-sm"
                            placeholder="Filter by name..."
                            value={name}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setName(newValue);
                                setColumnFilters((prev) =>
                                    prev
                                        .filter(
                                            (filter) => filter.id !== "name",
                                        )
                                        .concat({
                                            id: "name",
                                            value: newValue,
                                        }),
                                );
                            }}
                            className="w-full max-w-sm"
                        />

                        {/* <FloatingLabelSelect
                            id="country-select"
                            label="Country"
                            options={[
                                { value: "us", label: "United States" },
                                { value: "ca", label: "Canada" },
                                { value: "mx", label: "Mexico" },
                            ]}
                            value={selectedCountry}
                            onChange={setSelectedCountry}
                            ref={countrySelectRef}
                            className="w-full max-w-sm"
                        /> */}
                    </div>

                    <div className="flex items-center space-x-2 shrink">
                        <ActionButton
                            icon={Download}
                            label="Export"
                            tooltipContent={<p>Export</p>}
                            tooltipSide="bottom"
                            onClick={() => setIsExportDialogOpen(true)}
                            variant={"outline"}
                        />
                        <ActionButton
                            icon={Filter}
                            label="Advanced Filters"
                            tooltipContent={<p>Advanced Filters</p>}
                            tooltipSide="bottom"
                            onClick={() => setIsFiltersOpen(true)}
                            variant={"outline"}
                        />
                        <Button
                            variant="default"
                            onClick={() => setIsAddNewOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Segment
                        </Button>
                    </div>
                </div>
            </div>

            <TemplateSegmentsTable
                data={data}
                sorting={sorting}
                onSortingChange={setSorting}
                columnFilters={columnFilters}
                onColumnFiltersChange={setColumnFilters}
                columnVisibility={columnVisibility}
                onColumnVisibilityChange={setColumnVisibility}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
            />
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, data.length)} of{" "}
                    {data.length} results
                </div>
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
            {/* Dialogs and Sheets */}
            <ExportDialog
                isOpen={isExportDialogOpen}
                onClose={() => setIsExportDialogOpen(false)}
                onConfirm={handleExport}
                selectedCount={selectedRowsCount}
                title="Export Template Segments"
            />
            <DeleteDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                description="Though this action is reversible, it may lead to data loss. Are you sure you want to proceed?"
            />
            <FiltersSheet
                isOpen={isFiltersOpen}
                onClose={() => setIsFiltersOpen(false)}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                filters={filterConfig}
            />
            <AddNewSegmentSheet
                isOpen={isAddNewOpen}
                onClose={() => setIsAddNewOpen(false)}
                onSave={handleSaveNewSegment}
            />
        </div>
    );
}

// Utility function
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Mock data generator (can be moved to utils)
const generateMockData = (
    page: number,
    pageSize: number,
    sorting: SortingState,
): TemplateSegment[] => {
    const totalItems = page === 5 ? 4 : pageSize;
    const data = Array.from({ length: totalItems }, () => ({
        id: faker.string.uuid(),
        name: faker.lorem.words(3),
        kind: faker.helpers.arrayElement(["EMAIL", "SMS", "DOCUMENT"]),
        model: faker.helpers.arrayElement([
            "Newsletter",
            "OrderNotification",
            "Invoice",
        ]),
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
    }));

    if (sorting.length) {
        const { id, desc } = sorting[0];
        data.sort((a, b) => {
            if (a[id] < b[id]) return desc ? 1 : -1;
            if (a[id] > b[id]) return desc ? -1 : 1;
            return 0;
        });
    }

    return data;
};
