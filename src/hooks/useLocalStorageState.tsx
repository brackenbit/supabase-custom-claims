/*
    Based on code from "The Ultimate React Course 2024" by Jonas Schmedtmann
    https://github.com/jonasschmedtmann/ultimate-react-course

    (Only supports boolean state, as that's all that's needed in this application.)
*/

import { useEffect, useState } from "react";

export function useLocalStorageState(initialState: boolean, key: string) {
    const [value, setValue] = useState(function () {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialState;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    return [value, setValue];
}
