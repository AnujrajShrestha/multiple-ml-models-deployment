import { AlertCircle, X } from "lucide-react";

export default function ErrorAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
      <AlertCircle className="mt-0.5 shrink-0" size={18} />
      <p className="flex-1 leading-6">{message}</p>
      {onClose && (
        <button onClick={onClose} className="text-red-300 hover:text-white" aria-label="Close error">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
