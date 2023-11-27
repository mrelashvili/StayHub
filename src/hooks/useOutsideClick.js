import { useEffect, useRef } from 'react';

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) handler();
    }

    document.addEventListener('click', handleClick, listenCapturing); //// This true is for not listen for events on ubbbling phase but on capturing

    return () => document.removeEventListener('click', handleClick, true);
  }, [handler, listenCapturing]);

  return ref;
}
