import React from "react";
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

interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    cancelText?: string;
    confirmText?: string;
    icon?: React.ReactNode;
    className?: string;
    contentClassName?: string;
}

/**
 * A confirmation dialog for delete actions.
 *
 * This component provides a modal dialog to confirm a delete operation. It includes a warning icon, title, description,
 * and buttons for canceling or confirming the deletion.
 *
 * @example
 * ```jsx
 * <DeleteDialog
 *   isOpen={isDeleteModalOpen}
 *   onClose={() => setIsDeleteModalOpen(false)}
 *   onConfirm={handleDelete}
 * />
 * ```
 *
 * @param {DeleteDialogProps} props - The component props.
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
        className,
        contentClassName,
    }) => (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={cn("sm:max-w-[425px]", contentClassName)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        <div
                            className={cn(
                                "flex flex-col items-center space-y-4 py-4",
                                className,
                            )}
                        >
                            {icon}
                            <p className="text-center">{description}</p>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="justify-start sm:justify-end">
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
    ),
);

DeleteDialog.displayName = "DeleteDialog";
