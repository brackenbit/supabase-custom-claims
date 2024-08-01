/*
    Wrapper to add a max toasts limit to react-hot-toast
    adapted from code by softmarshmallow:
    https://github.com/timolins/react-hot-toast/issues/31#issuecomment-2084653008

    Also updated to style based on useDarkMode().
    (Merges with / overrides any other toastOptions passed in props.)
*/

import { useEffect } from "react";
import toast, { Toaster, useToasterStore } from "react-hot-toast";
import { useDarkMode } from "../context/DarkModeContext";

function useMaxToasts(max: number) {
    const { toasts } = useToasterStore();

    useEffect(() => {
        toasts
            .filter((t) => t.visible) // Only consider visible toasts
            .filter((_, i) => i >= max) // Is toast index over limit?
            .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) for no exit animation
    }, [toasts, max]);
}

export default function ToasterWithMax({ max = 10, ...props }) {
    useMaxToasts(max);

    const { isDarkMode } = useDarkMode();

    const toastOptions = {
        style: isDarkMode ? { color: "#ffffff", background: "#212529" } : {},
        ...(props.toastOptions || {}),
    };

    return <Toaster toastOptions={toastOptions} {...props} />;
}
