import { useState, useEffect } from "react";

let listeners = [];
let memoryState = { toasts: [] };
let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TOAST":
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, 5) };
    case "REMOVE_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    default:
      return state;
  }
}

export function toast({ title, description, variant = "default", duration = 4000 }) {
  const id = genId();

  dispatch({ type: "ADD_TOAST", toast: { id, title, description, variant, open: true } });

  if (duration > 0) {
    setTimeout(() => dispatch({ type: "REMOVE_TOAST", id }), duration);
  }

  return {
    id,
    dismiss: () => dispatch({ type: "REMOVE_TOAST", id }),
    update: (props) => dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } }),
  };
}

export function useToast() {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (id) => dispatch({ type: "REMOVE_TOAST", id }),
  };
}
