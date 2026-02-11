import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative bg-black border border-white p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        {title && (
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4 pb-2 border-b border-white/30">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
