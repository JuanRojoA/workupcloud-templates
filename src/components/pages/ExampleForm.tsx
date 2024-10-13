// ExamplePage.tsx
import type React from "react";
import { useState, useEffect } from "react";
import { useFilters } from "@/hooks/useFilters";
import { Button } from "@/components/ui/button";
import { FiltersSheet } from "../organisms/sheets/filters-sheet";
import { filterConfig } from "@/filterConfig";
import { filtersSchema } from "@/schemas/filtersSchema";

export const ExampleForm: React.FC = () => {
	const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
	const { getQueryString, getAppliedFilters } = useFilters();
	const [filters, setFilters] = useState<Record<string, any>>(() =>
		getAppliedFilters(),
	);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [data, setData] = useState<any[]>([]);

	// Fetch data whenever filters change
	useEffect(() => {
		const fetchData = async () => {
			const queryString = getQueryString();
			// Fetch data from API using the query string
			const response = await fetch(`/api/data?${queryString}`);
			const result = await response.json();
			setData(result);
		};
		fetchData();
	}, [getQueryString]);

	useEffect(() => {
		console.log(Array.from(filters).length);
	}, [filters]);

	return (
		<div>
			<Button onClick={() => setIsFilterSheetOpen(true)}>Open Filters</Button>
			{filters.length > 0 && (
				<div className="flex mt-4">
					{filters.map(
						(filter: {
							name: string;
							value: string | string[] | number | boolean;
						}) => (
							<div
								key={filter.name}
								className="flex items-center bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full mr-2 text-sm"
							>
								<span className="mr-2">{filter.name}</span>
								<span className="mr-2">:</span>
								<span className="font-medium">{String(filter.value)}</span>
							</div>
						),
					)}
				</div>
			)}
			<FiltersSheet
				filterConfig={filterConfig}
				filtersSchema={filtersSchema}
				isOpen={isFilterSheetOpen}
				onClose={() => setIsFilterSheetOpen(false)}
				onApply={(_data: Record<string, unknown>) => {
					setFilters(getAppliedFilters());
				}}
				onClear={() => {
					setFilters(getAppliedFilters());
				}}
			/>
			{/* Render your data here */}
			<div>Data count: {data.length}</div>
			{/* ... */}
		</div>
	);
};
