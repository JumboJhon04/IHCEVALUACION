// frontend/components/ui/confirm-delete-modal.tsx
'use client';

import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    entityName: string; // por ejemplo, "Jonathan"
};

export default function ConfirmDeleteModal({ open, onClose, onConfirm, entityName }: Props) {
    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-sm">
                <DialogHeader className="flex items-center">
                    <DialogTitle>Eliminar {entityName}</DialogTitle>
                    <button onClick={onClose} className="absolute right-2 top-2 text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </DialogHeader>
                <DialogDescription>
                    ¿Estás seguro de eliminar a <strong>{entityName}</strong>? Esta acción es irreversible.
                </DialogDescription>
                <DialogFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Eliminar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
