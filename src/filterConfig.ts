import type { FilterConfigItem } from "./components/organisms/sheets/filters-sheet";

export const filterConfig: FilterConfigItem[] = [
	{
		type: "input",
		name: "name",
		label: "Name",
		placeholder: "Filter by name",
		inputType: "text",
	},
	{
		type: "input",
		name: "email",
		label: "Email",
		placeholder: "Filter by email",
		inputType: "email",
	},
	{
		type: "select",
		name: "status",
		label: "Status",
		placeholder: "Select status",
		options: [
			{ label: "Active", value: "active" },
			{ label: "Inactive", value: "inactive" },
			{ label: "Pending", value: "pending" },
		],
		multiple: true, // Allow multiple selections
	},
	{
		type: "date",
		name: "createdAfter",
		label: "Created After",
		placeholder: "Select a date",
	},
	{
		type: "color",
		name: "favoriteColor",
		label: "Favorite Color",
		placeholder: "Select a color",
	},
	{
		type: "textarea",
		name: "description",
		label: "Description",
		placeholder: "Filter by description",
	},
	{
		type: "checkbox",
		name: "isVerified",
		label: "Is Verified",
		defaultValue: false,
	},
	{
		type: "radio",
		name: "gender",
		label: "Gender",
		options: [
			{ label: "Male", value: "male" },
			{ label: "Female", value: "female" },
			{ label: "Other", value: "other" },
		],
	},
];
