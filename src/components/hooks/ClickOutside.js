import { useEffect } from "react";

// Click outside hook that works with a toggle button.
// Takes three params, a node ref for the click element, a ref for the menu node
// and the callback function.
// If not toggle is not being used pass null to the clickNodeRef.

export default function useClickOutside(clickNodeRef, menuNodeRef, callback) {
    useEffect(() => {
        
        function handleClick(e) {
            if (clickNodeRef && clickNodeRef.current.contains(e.target)) {
                return;
            } else if (menuNodeRef.current && !menuNodeRef.current.contains(e.target)) {
                callback();
            }
        }
        
        document.addEventListener("mousedown", handleClick);
        return () => {
        document.removeEventListener("mousedown", handleClick);
    }

    })
}