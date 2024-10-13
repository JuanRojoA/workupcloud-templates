import React, { useId } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileDown } from "lucide-react";

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
 * The `ExportDialog` component provides a modal dialog to confirm an export operation. It can display the number of
 * items being exported and includes a customizable icon, title, description, and buttons for canceling or
 * confirming the export.
 *
 * ### Usage Examples:
 *
 * ```jsx
 * import { useState } from "react";
 * import { ExportDialog } from "@/components/ExportDialog";
 * import { Button } from "@/components/ui/button";
 *
 * const ExampleComponent = () => {
 *   const [isExportModalOpen, setIsExportModalOpen] = useState(false);
 *   const selectedItemsCount = 5; // Example count
 *
 *   const handleExport = () => {
 *     // Perform export action
 *     setIsExportModalOpen(false);
 *   };
 *
 *   return (
 *     <>
 *       <Button onClick={() => setIsExportModalOpen(true)}>Export Items</Button>
 *       <ExportDialog
 *         isOpen={isExportModalOpen}
 *         onClose={() => setIsExportModalOpen(false)}
 *         onConfirm={handleExport}
 *         selectedCount={selectedItemsCount}
 *         title={`Export ${selectedItemsCount} Items`}
 *         description="We will send you an email notification when we have completed the export process."
 *         cancelText="No, Cancel"
 *         confirmText="Yes, Export"
 *         icon={<FileDown className="h-16 w-16 text-primary" />}
 *       />
 *     </>
 *   );
 * };
 * ```
 *
 * @component
 *
 * @param {ExportDialogProps} props - The component props.
 * @param {boolean} props.isOpen - Whether the dialog is open.
 * @param {() => void} props.onClose - The function to close the dialog.
 * @param {() => void} props.onConfirm - The function to confirm the export.
 * @param {number} props.selectedCount - The number of selected items.
 * @param {string} props.title - The title of the dialog.
 * @param {string} props.description - The description of the dialog.
 * @param {string} props.cancelText - The text for the cancel button.
 * @param {string} props.confirmText - The text for the confirm button.
 * @param {React.ReactNode} props.icon - The icon to display in the dialog.
 * @param {string} props.iconClassName - The class name for the icon.
 * @param {string} props.contentClassName - The class name for the dialog content.
 * @param {string} props.descriptionClassName - The class name for the dialog description.
 * @returns {JSX.Element} - The rendered ExportDialog component.
 */
export const ExportDialog: React.FC<ExportDialogProps> = React.memo(
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
	}) => {
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
