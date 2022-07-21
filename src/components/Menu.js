
import { useEffect, useRef, useState } from "react";
import useClickOutside from "./hooks/ClickOutside";

export function Menu({ parentRef, offset, children, close, position }) {

  const offsetNum = offset || 10;
  const [{ x, y, height, width }, setRect] = useState(parentRef?.current?.getBoundingClientRect());

  const menuRef = useRef();
  const [style, setStyle] = useState(calculatePos());
  
  useClickOutside(parentRef, menuRef, close);

  function calculatePos() {
    switch (position) {

      case 'right':
        return {
          top: y,
          left: x + width + offsetNum,
        }
      case 'bottom':

        return {
          top: x + height + offsetNum,
          left: y
        }

      default:
    }
  }

  useEffect(() => {

    const observer = new ResizeObserver((elem) => {
      setRect(elem[0].target.getBoundingClientRect());
    })

    observer.observe(parentRef.current);

    return () => {
      observer.unobserve(parentRef.current);
    }

  }, [])


  useEffect(() => {

    setStyle(calculatePos());

  }, [x, y, width, height])

  return (
    <div ref={menuRef} className='menu' style={style}>
        {children}
    </div>
  )
}
