import { useState, useEffect, useCallback } from "react";

export interface FilterValue {
	value: string | string[] | number | boolean;
	isHidden: boolean;
	appliedInternally: boolean;
}

export interface Filters {
	[key: string]: FilterValue;
}

export const useFilters = (filtersStoredAs?: string) => {
	const [filters, setFilters] = useState<Filters>(() => {
		const storedFilters = localStorage.getItem(filtersStoredAs || "filters");
		return storedFilters ? JSON.parse(storedFilters) : {};
	});

	const setFilterValue = useCallback(
		(
			name: string,
			value: string | string[] | number | boolean,
			isHidden = false,
			appliedInternally = false,
		) => {
			setFilters((prevFilters) => {
				const updatedFilters = {
					...prevFilters,
					[name]: {
						value,
						isHidden,
						appliedInternally,
					},
				};
				return updatedFilters;
			});
		},
		[],
	);

	const removeFilter = useCallback((name: string) => {
		setFilters((prevFilters) => {
			const updatedFilters = { ...prevFilters };
			delete updatedFilters[name];
			return updatedFilters;
		});
	}, []);

	const clearFilters = useCallback(() => {
		setFilters({});
	}, []);

	const getAppliedFilters = useCallback(() => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const appliedFilters: Array<[string, any]> = [];
		for (const [key, filter] of Object.entries(filters)) {
			if (
				filter.value !== "" &&
				filter.value !== null &&
				filter.value !== undefined &&
				!(Array.isArray(filter.value) && filter.value.length === 0) &&
				!Number.isNaN(filter.value)
			) {
				appliedFilters.push([key, filter.value]);
			}
		}
		return appliedFilters;
	}, [filters]);

	const getQueryString = useCallback(() => {
		const appliedFilters = getAppliedFilters();
		const queryParams = new URLSearchParams();

		for (const [key, value] of Object.entries(appliedFilters)) {
			if (Array.isArray(value)) {
				for (const v of value) {
					queryParams.append(key, v);
				}
			} else if (typeof value === "object" && value !== null) {
				queryParams.append(key, JSON.stringify(value));
			} else {
				queryParams.append(key, value);
			}
		}

		return queryParams.toString();
	}, [getAppliedFilters]);

	useEffect(() => {
		localStorage.setItem(filtersStoredAs || "filters", JSON.stringify(filters));
	}, [filters, filtersStoredAs]);

	return {
		filters,
		setFilterValue,
		removeFilter,
		clearFilters,
		getAppliedFilters,
		getQueryString,
	};
};
