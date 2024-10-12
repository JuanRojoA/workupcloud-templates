import React from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AddNewSegmentSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export const AddNewSegmentSheet: React.FC<AddNewSegmentSheetProps> = React.memo(
    ({ isOpen, onClose, onSave }) => (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
                side="right"
                className="sm:max-w-[75vw] sm:min-w-[270px]"
            >
                <SheetHeader>
                    <SheetTitle>Add New Segment</SheetTitle>
                    <SheetDescription>
                        Create a new template segment. Fill out the details
                        below.
                    </SheetDescription>
                </SheetHeader>
                <form
                    className="grid gap-4 py-4 sm:grid-cols-2"
                    onSubmit={onSave}
                >
                    <div className="space-y-2">
                        <Label htmlFor="new-name">Name</Label>
                        <Input
                            id="new-name"
                            placeholder="Enter segment name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-type">Type</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EMAIL">Email</SelectItem>
                                <SelectItem value="SMS">SMS</SelectItem>
                                <SelectItem value="DOCUMENT">
                                    Document
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="new-model">Model</Label>
                        <Input
                            id="new-model"
                            placeholder="Enter model name"
                            required
                        />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="new-content">Content</Label>
                        <textarea
                            id="new-content"
                            placeholder="Enter segment content"
                            className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                            required
                        />
                    </div>
                    <SheetFooter className="flex justify-end space-x-2">
                        <SheetClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </SheetClose>
                        <Button type="submit">Save Segment</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    ),
);
