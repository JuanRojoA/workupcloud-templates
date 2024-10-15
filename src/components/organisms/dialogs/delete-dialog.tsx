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
import { AlertTriangle } from "lucide-react";
import React, { useId } from "react";

/**
 * Props for the DeleteDialog component.
 */
interface DeleteDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
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
 * A confirmation dialog for delete actions.
 *
 * This component provides a modal dialog to confirm a delete operation. It includes a warning icon,
 * title, description, and buttons for canceling or confirming the deletion.
 *
 * The component is memoized using `React.memo` to optimize performance by preventing unnecessary re-renders.
 *
 * @component
 * @property {boolean} isOpen - Whether the dialog is open.
 * @property {() => void} onClose - Callback function to close the dialog.
 * @property {() => void} onConfirm - Callback function to execute when the delete action is confirmed.
 * @property {string | React.ReactNode} [title="Confirm Deletion"] - The title of the dialog.
 * @property {string | React.ReactNode} [description] - The description of the dialog, explaining the consequences of the delete action.
 * @property {string} [cancelText="Cancel"] - The text for the cancel button.
 * @property {string} [confirmText="Delete"] - The text for the confirm button.
 * @property {React.ReactNode} [icon] - The icon to display in the dialog header.
 * @property {string} [iconClassName] - Optional class name for the icon container.
 * @property {string} [contentClassName] - Optional class name for the dialog content container.
 * @property {string} [descriptionClassName] - Optional class name for the description text.
 * @returns {JSX.Element} - The rendered delete confirmation dialog.
 *
 * @example
 * // Basic usage
 * <DeleteDialog
 *   isOpen={isDeleteDialogOpen}
 *   onClose={() => setIsDeleteDialogOpen(false)}
 *   onConfirm={handleDelete}
 * />
 *
 * @example
 * // With custom title and description
 * <DeleteDialog
 *   isOpen={isDeleteDialogOpen}
 *   onClose={() => setIsDeleteDialogOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Are you sure?"
 *   description="This will permanently delete the selected item."
 * />
 */
export const DeleteDialog: React.FC<DeleteDialogProps> = React.memo(
	({
		 isOpen,
		 onClose,
		 onConfirm,
		 title = "Confirm Deletion",
		 description = "This action is irreversible and may lead to data loss. Are you sure you want to proceed?",
		 cancelText = "Cancel",
		 confirmText = "Delete",
		 icon = <AlertTriangle className="h-16 w-16 text-red-500" />,
		 iconClassName,
		 contentClassName,
		 descriptionClassName,
	 }) => {
		const uniqueId = useId();
		const dialogTitleId = `${uniqueId}-title`;
		const dialogDescriptionId = `${uniqueId}-description`;

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
							{title}
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
							variant="destructive"
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

DeleteDialog.displayName = "DeleteDialog";