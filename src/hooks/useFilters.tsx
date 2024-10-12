import { useState } from "react";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Label } from "@/components/ui/label";
import { FloatingLabelInput } from "@/components/molecules/floating-label-input";
import { FloatingLabelSelect } from "@/components/molecules/floating-label-select";

type FilterType = "input" | "select" | "checkbox";

interface FilterOption {
    label: string;
    value: string;
}

export interface FilterConfig {
    id: string;
    label: string;
    type: FilterType;
    placeholder?: string;
    options?: FilterOption[];
}

/**
 * Hook for managing advanced filters.
 *
 * Given an array of filter configurations, returns an object with the following properties:
 *   - `filterValues`: an object with the current values of the filters
 *   - `handleApply`: a function to call when the user wants to apply the filters
 *   - `handleClear`: a function to call when the user wants to clear all filters
 *   - `renderFilter`: a function that renders a single filter component based on the filter type
 *
 * @example
 * ```jsx
 * const { filterValues, handleApply, handleClear, renderFilter } = useFilters(filters, onApply, onClear);
 * ```
 *
 * @param {FilterConfig[]} initialFilters - the initial filter configurations
 * @param {(filters: Record<string, string | string[]>) => void} onApply - callback function to call when the user wants to apply the filters
 * @param {() => void} onClear - callback function to call when the user wants to clear all filters
 * @returns {{ filterValues: Record<string, string | string[]>, handleApply: () => void, handleClear: () => void, renderFilter: (filter: FilterConfig) => JSX.Element }}
 */
export const useFilters = (
    initialFilters: FilterConfig[],
    onApply: (filters: Record<string, string | string[]>) => void,
    onClear: () => void,
) => {
    const [filterValues, setFilterValues] = useState<
        Record<string, string | string[]>
    >({});

    const handleInputChange = (id: string, value: string) => {
        setFilterValues((prev) => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (id: string, value: string) => {
        setFilterValues((prev) => ({ ...prev, [id]: value }));
    };

    const handleCheckboxChange = (
        id: string,
        checked: boolean,
        value: string,
    ) => {
        setFilterValues((prev) => {
            const currentValues = Array.isArray(prev[id])
                ? (prev[id] as string[])
                : [];
            if (checked) {
                return { ...prev, [id]: [...currentValues, value] };
            }
            return {
                ...prev,
                [id]: currentValues.filter((v) => v !== value),
            };
        });
    };

    const handleApply = () => {
        onApply(filterValues);
    };

    const handleClear = () => {
        setFilterValues({});
        onClear();
    };

    const renderFilter = (filter: FilterConfig) => {
        switch (filter.type) {
            case "input":
                return (
                    <div key={filter.id} className="space-y-3">
                        <FloatingLabelInput
                            id={filter.id}
                            label={filter.label}
                            placeholder={filter.placeholder}
                            value={(filterValues[filter.id] as string) || ""}
                            onChange={(e) =>
                                handleInputChange(filter.id, e.target.value)
                            }
                        />
                    </div>
                );
            case "select":
                return (
                    <div key={filter.id} className="space-y-3">
                        <FloatingLabelSelect
                            id={filter.id}
                            label={filter.label}
                            options={filter.options || []}
                            value={(filterValues[filter.id] as string) || ""}
                            onChange={(value) =>
                                handleSelectChange(filter.id, value)
                            }
                        />
                    </div>
                );
            case "checkbox":
                return (
                    <div key={filter.id} className="space-y-3">
                        <Label>{filter.label}</Label>
                        {filter.options?.map((option) => (
                            <div
                                key={option.value}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    id={`${filter.id}-${option.value}`}
                                    checked={(
                                        (filterValues[filter.id] as string[]) ||
                                        []
                                    ).includes(option.value)}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange(
                                            filter.id,
                                            checked as boolean,
                                            option.value,
                                        )
                                    }
                                />
                                <Label htmlFor={`${filter.id}-${option.value}`}>
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return {
        filterValues,
        handleApply,
        handleClear,
        renderFilter,
    };
};
