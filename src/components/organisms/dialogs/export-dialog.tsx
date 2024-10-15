import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { FileDown } from "lucide-react";
import React, { useId } from "react";

/**
 * Props for the ExportDialog component.
 */
interface ExportDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	selectedCount?: number;
	title?: string | React.ReactNode;
	description?: string | React.ReactNode;
	cancelText?: string;
	confirmText?: string;
	icon?: React.ReactNode;
	iconClassName?: string;
	contentClassName?: string;
	descriptionClassName?: string;
}

/**
 * A confirmation dialog for export actions.
 *
 * This component provides a modal dialog to confirm an export operation. It includes an icon, title,
 * description, and buttons for canceling or confirming the export. The title can be customized or
 * automatically generated based on the number of items selected for export.
 *
 * The component is memoized using `React.memo` to optimize performance by preventing unnecessary re-renders.
 *
 * @component
 * @property {boolean} isOpen - Whether the dialog is open.
 * @property {() => void} onClose - Callback function to close the dialog.
 * @property {() => void} onConfirm - Callback function to execute when the export action is confirmed.
 * @property {number} [selectedCount] - The number of selected items to export (if applicable).
 * @property {string | React.ReactNode} [title] - The title of the dialog. If not provided, a default title will be generated based on `selectedCount`.
 * @property {string | React.ReactNode} [description] - The description of the dialog, explaining the export process.
 * @property {string} [cancelText="Cancel"] - The text for the cancel button.
 * @property {string} [confirmText="Confirm Export"] - The text for the confirm button.
 * @property {React.ReactNode} [icon] - The icon to display in the dialog header.
 * @property {string} [iconClassName] - Optional class name for the icon container.
 * @property {string} [contentClassName] - Optional class name for the dialog content container.
 * @property {string} [descriptionClassName] - Optional class name for the description text.
 * @returns {React.ReactElement} - The rendered ExportDialog component.
 *
 * @example
 * // Basic usage
 * <ExportDialog
 *   isOpen={isExportDialogOpen}
 *   onClose={() => setIsExportDialogOpen(false)}
 *   onConfirm={handleExport}
 * />
 *
 * @example
 * // With custom title and selected count
 * <ExportDialog
 *   isOpen={isExportDialogOpen}
 *   onClose={() => setIsExportDialogOpen(false)}
 *   onConfirm={handleExport}
 *   title="Export Selected Items"
 *   selectedCount={5}
 * />
 */
export const ExportDialog = React.memo(
	({
		 isOpen,
		 onClose,
		 onConfirm,
		 selectedCount,
		 title,
		 description = "We will send you an email notification when we have completed the export process.",
		 cancelText = "Cancel",
		 confirmText = "Confirm Export",
		 icon = <FileDown className="h-16 w-16 text-primary" />,
		 iconClassName,
		 contentClassName,
		 descriptionClassName,
	 }: ExportDialogProps): React.ReactElement => {
		const uniqueId = useId();
		const dialogTitleId = `${uniqueId}-title`;
		const dialogDescriptionId = `${uniqueId}-description`;

		// Determine the default title based on selectedCount
		const defaultTitle =
			selectedCount !== undefined && selectedCount > 0
				? `Export ${selectedCount} selected item${selectedCount > 1 ? "s" : ""}`
				: "Export all items";

		return (
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent
					className={cn("sm:max-w-[425px]", contentClassName)}
					aria-labelledby={dialogTitleId}
					aria-describedby={dialogDescriptionId}
				>
					<DialogHeader className="flex flex-col items-center space-y-4">
						<div className={cn("flex justify-center", iconClassName)}>
							{icon}
						</div>
						<DialogTitle id={dialogTitleId} className="text-center">
							{title || defaultTitle}
						</DialogTitle>
						<DialogDescription
							id={dialogDescriptionId}
							className={cn("text-center", descriptionClassName)}
						>
							{description}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex justify-center sm:justify-end space-x-4 mt-4">
						<Button type="button" variant="outline" onClick={onClose}>
							{cancelText}
						</Button>
						<Button
							type="button"
							variant="default"
							onClick={() => {
								onConfirm();
								onClose();
							}}
						>
							{confirmText}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	},
);

ExportDialog.displayName = "ExportDialog";