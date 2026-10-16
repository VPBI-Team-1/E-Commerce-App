import { XMarkIcon } from "@heroicons/react/24/outline";

interface AuthNotificationProps {
  type: "success" | "error";
  message: string;
  onClose?: () => void;
}

export function AuthNotification({ type, message, onClose }: AuthNotificationProps) {
  const baseClasses =
    "mb-4 rounded-lg border p-3 text-sm flex items-start justify-between";
  const typeClasses =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-red-200 bg-red-50 text-red-600";

  return (
    <div
      className={`${baseClasses} ${typeClasses}`}
      role={type === "error" ? "alert" : "status"}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup notifikasi"
          className="ml-2 rounded p-1 hover:bg-black/5"
        >
          <XMarkIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
