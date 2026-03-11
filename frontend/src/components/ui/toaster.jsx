import { useToast } from "../../hooks/use-toast";
import { Toast } from "./toast";

function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onDismiss={() => dismiss(toast.id)}
        />
      ))}
    </div>
  );
}

export { Toaster };
