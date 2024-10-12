import React from "react";
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

interface ExportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    selectedCount?: number;
    title?: string;
    description?: string;
    cancelText?: string;
    confirmText?: string;
    icon?: React.ReactNode;
    className?: string;
    contentClassName?: string;
}

/**
 * A confirmation dialog for export actions.
 *
 * This component provides a modal dialog to confirm an export operation. It can display the number of
 * items being exported and includes a customizable icon, title, description, and buttons for canceling or
 * confirming the export.
 *
 * @example
 * ```jsx
 * <ExportDialog
 *   isOpen={isExportModalOpen}
 *   onClose={() => setIsExportModalOpen(false)}
 *   onConfirm={handleExport}
 *   selectedCount={5}
 * />
 * ```
 *
 * @param {ExportDialogProps} props - The component props.
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
        className,
        contentClassName,
    }) => {
        const defaultTitle =
            selectedCount !== undefined && selectedCount > 0
                ? `Export ${selectedCount} selected item${selectedCount > 1 ? "s" : ""}`
                : "Export all items";

        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent
                    className={cn("sm:max-w-[425px]", contentClassName)}
                >
                    <DialogHeader>
                        <DialogTitle>{title || defaultTitle}</DialogTitle>
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
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            type="button"
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
