import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modal = dialog.current;
    if (!modal) return;

    // Usamos una pequeña pausa (requestAnimationFrame) para asegurar
    // que el navegador ha procesado el renderizado antes de abrir
    const openTimeout = requestAnimationFrame(() => {
      if (modal && !modal.open) {
        modal.showModal();
      }
    });

    return () => {
      cancelAnimationFrame(openTimeout);
      // Verificamos que el modal sigue existiendo y está abierto antes de cerrar
      if (modal && modal.open) {
        modal.close();
      }
    };
  }, []);

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById("modal")!
  );
}
