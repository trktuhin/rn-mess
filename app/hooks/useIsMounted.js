import { useRef, useEffect } from 'react';

export default useIsMounted = () => {
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => isMounted.current = false;
    }, []);

    return isMounted;
}