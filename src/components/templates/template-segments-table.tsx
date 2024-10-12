import React, { useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { TemplateSegment } from "@/types/index";
import {
    useReactTable,
    getCoreRowModel,
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
    type VisibilityState,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal } from "lucide-react";
import { flexRender } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TemplateSegmentsTableProps {
    data: TemplateSegment[];
    sorting: SortingState;
    onSortingChange: (sorting: SortingState) => void;
    columnFilters: ColumnFiltersState;
    onColumnFiltersChange: (filters: ColumnFiltersState) => void;
    columnVisibility: VisibilityState;
    onColumnVisibilityChange: (visibility: VisibilityState) => void;
    rowSelection: Record<string, boolean>;
    onRowSelectionChange: (selection: Record<string, boolean>) => void;
}

export const TemplateSegmentsTable: React.FC<TemplateSegmentsTableProps> =
    React.memo(
        ({
            data,
            sorting,
            onSortingChange,
            columnFilters,
            onColumnFiltersChange,
            columnVisibility,
            onColumnVisibilityChange,
            rowSelection,
            onRowSelectionChange,
        }) => {
            const columns: ColumnDef<TemplateSegment>[] = useMemo(
                () => [
                    {
                        id: "select",
                        header: ({ table }) => (
                            <Checkbox
                                checked={table.getIsAllPageRowsSelected()}
                                onCheckedChange={(value) =>
                                    table.toggleAllPageRowsSelected(!!value)
                                }
                                aria-label="Select all"
                                className="rounded-md"
                            />
                        ),
                        cell: ({ row }) => (
                            <Checkbox
                                checked={row.getIsSelected()}
                                onCheckedChange={(value) =>
                                    row.toggleSelected(!!value)
                                }
                                aria-label="Select row"
                                className="rounded-md"
                            />
                        ),
                        enableSorting: false,
                        enableHiding: false,
                    },
                    {
                        accessorKey: "name",
                        header: ({ column }) => (
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() === "asc"
                                            ? "desc"
                                            : column.getIsSorted() === "desc"
                                              ? false
                                              : "asc",
                                    )
                                }
                            >
                                Name
                                {column.getIsSorted() === "asc" ? (
                                    <ArrowUp className="ml-2 h-4 w-4" />
                                ) : column.getIsSorted() === "desc" ? (
                                    <ArrowDown className="ml-2 h-4 w-4" />
                                ) : (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                )}
                            </Button>
                        ),
                        cell: ({ row }) => (
                            <div className="font-medium">
                                {row.getValue("name")}
                            </div>
                        ),
                    },
                    {
                        accessorKey: "kind",
                        header: ({ column }) => (
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() === "asc"
                                            ? "desc"
                                            : column.getIsSorted() === "desc"
                                              ? false
                                              : "asc",
                                    )
                                }
                            >
                                Type
                                {column.getIsSorted() === "asc" ? (
                                    <ArrowUp className="ml-2 h-4 w-4" />
                                ) : column.getIsSorted() === "desc" ? (
                                    <ArrowDown className="ml-2 h-4 w-4" />
                                ) : (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                )}
                            </Button>
                        ),
                        cell: ({ row }) => (
                            <div className="capitalize">
                                {row.getValue("kind")}
                            </div>
                        ),
                    },
                    {
                        accessorKey: "model",
                        header: ({ column }) => (
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() === "asc"
                                            ? "desc"
                                            : column.getIsSorted() === "desc"
                                              ? false
                                              : "asc",
                                    )
                                }
                            >
                                Model
                                {column.getIsSorted() === "asc" ? (
                                    <ArrowUp className="ml-2 h-4 w-4" />
                                ) : column.getIsSorted() === "desc" ? (
                                    <ArrowDown className="ml-2 h-4 w-4" />
                                ) : (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                )}
                            </Button>
                        ),
                        cell: ({ row }) => <div>{row.getValue("model")}</div>,
                    },
                    {
                        accessorKey: "updated_at",
                        header: ({ column }) => (
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() === "asc"
                                            ? "desc"
                                            : column.getIsSorted() === "desc"
                                              ? false
                                              : "asc",
                                    )
                                }
                            >
                                Last Updated
                                {column.getIsSorted() === "asc" ? (
                                    <ArrowUp className="ml-2 h-4 w-4" />
                                ) : column.getIsSorted() === "desc" ? (
                                    <ArrowDown className="ml-2 h-4 w-4" />
                                ) : (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                )}
                            </Button>
                        ),
                        cell: ({ row }) => (
                            <div>{formatDate(row.getValue("updated_at"))}</div>
                        ),
                    },
                    {
                        id: "actions",
                        cell: ({ row }) => {
                            const segment = row.original;

                            return (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                        >
                                            <span className="sr-only">
                                                Open menu
                                            </span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                            Actions
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                console.log("View", segment.id)
                                            }
                                        >
                                            View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                console.log("Edit", segment.id)
                                            }
                                        >
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() =>
                                                console.log("Clone", segment.id)
                                            }
                                        >
                                            Clone
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                console.log(
                                                    "Delete",
                                                    segment.id,
                                                )
                                            }
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            );
                        },
                    },
                ],
                [],
            );

            const table = useReactTable({
                data,
                columns,
                onSortingChange,
                onColumnFiltersChange,
                getCoreRowModel: getCoreRowModel(),
                onColumnVisibilityChange,
                onRowSelectionChange,
                state: {
                    sorting,
                    columnFilters,
                    columnVisibility,
                    rowSelection,
                },
                manualPagination: true,
                // Additional configurations can be added here
            });

            return (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected()
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            );
        },
    );

// Utility function moved to utils
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
