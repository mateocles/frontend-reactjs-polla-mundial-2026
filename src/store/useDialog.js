import { create } from "zustand";

// Sistema de diálogos global (alert / confirm) basado en promesas.
// Uso: await dialog.confirm("¿Seguro?", { title, confirmText, tone })
export const useDialog = create((set, get) => ({
  state: null, // { type, title, message, confirmText, cancelText, tone }
  resolver: null,

  open: (opts) =>
    new Promise((resolve) => {
      // Cierra cualquier diálogo previo resolviéndolo en falso.
      const prev = get().resolver;
      if (prev) prev(false);
      set({ state: opts, resolver: resolve });
    }),

  close: (value) => {
    const { resolver } = get();
    if (resolver) resolver(value);
    set({ state: null, resolver: null });
  },
}));

export const dialog = {
  alert: (message, opts = {}) =>
    useDialog.getState().open({ type: "alert", message, ...opts }),
  confirm: (message, opts = {}) =>
    useDialog.getState().open({ type: "confirm", message, ...opts }),
};
