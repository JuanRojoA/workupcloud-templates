import React, { useId } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
 * The `DeleteDialog` component provides a modal dialog to confirm a delete operation. It includes a warning icon, title,
 * description, and buttons for canceling or confirming the deletion.
 *
 * ### Usage Examples:
 *
 * ```jsx
 * import { useState } from "react";
 * import { DeleteDialog } from "@/components/DeleteDialog";
 *
 * const ExampleComponent = () => {
 *   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 *
 *   const handleDelete = () => {
 *     // Perform delete action
 *     setIsDeleteModalOpen(false);
 *   };
 *
 *   return (
 *     <>
 *       <Button onClick={() => setIsDeleteModalOpen(true)}>Delete Item</Button>
 *       <DeleteDialog
 *         isOpen={isDeleteModalOpen}
 *         onClose={() => setIsDeleteModalOpen(false)}
 *         onConfirm={handleDelete}
 *         title="Delete Confirmation"
 *         description="Are you sure you want to delete this item? This action cannot be undone."
 *         cancelText="No, Cancel"
 *         confirmText="Yes, Delete"
 *         icon={<AlertTriangle className="h-16 w-16 text-red-500" />}
 *       />
 *     </>
 *   );
 * };
 * ```
 *
 * @component
 *
 * @param {DeleteDialogProps} props - The component props.
 * @param {boolean} props.isOpen - Whether the dialog is open. If true, the dialog will be visible and interactive.
 * @param {() => void} props.onClose - The function to close the dialog. This function will be called when the user closes the dialog, either by clicking outside of it, pressing escape, or pressing the cancel button.
 * @param {() => void} props.onConfirm - The function to confirm the deletion. This function will be called when the user clicks the confirm button.
 * @param {string | React.ReactNode} props.title - The title of the dialog. This can be a string or a React node, and will be displayed at the top of the dialog.
 * @param {string | React.ReactNode} props.description - The description of the dialog. This can be a string or a React node, and will be displayed below the title.
 * @param {string} props.cancelText - The text for the cancel button. This will be displayed on the left side of the dialog footer.
 * @param {string} props.confirmText - The text for the confirm button. This will be displayed on the right side of the dialog footer.
 * @param {React.ReactNode} props.icon - The icon to display in the dialog. This can be a React node, and will be displayed at the top of the dialog.
 * @param {string} props.iconClassName - The class name for the icon. This can be used to customize the appearance of the icon.
 * @param {string} props.contentClassName - The class name for the dialog content. This can be used to customize the appearance of the dialog content.
 * @param {string} props.descriptionClassName - The class name for the description. This can be used to customize the appearance of the description.
 * @returns {JSX.Element} - The rendered DeleteDialog component.
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
