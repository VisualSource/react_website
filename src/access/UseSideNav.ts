import {useState} from 'react';
import {useBetween} from 'use-between';

export default function useSideNav(){
    const [state,setState] = useState(false);

    const open = (close: boolean = false) => {
        if(close) {
            setState(false);
            return;
        }
        setState(!state);
    }

    return { open, state };
}


export const useSharedSideNav = () => useBetween(useSideNav);