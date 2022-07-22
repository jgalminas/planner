
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useClickOutside from "./hooks/ClickOutside";

export function Menu({ parentRef, offset, children, close, position }) {

  const offsetNum = offset || 10;
  const [{ x, y, height, width }, setRect] = useState(parentRef?.current?.getBoundingClientRect());

  const menuRef = useRef();
  const [style, setStyle] = useState(calculatePos());

  useClickOutside(parentRef, menuRef, close);

  function calculatePos() {

    if (menuRef.current) {
      switch (position) {

        case 'right':
          return {
            top: y,
            left: x + width + offsetNum,
          }
        case 'bottom':
          return {
            top: y + height + offsetNum,
            left: x
          }
        case 'bottom-left':
          return {
            top: y + height + offsetNum,
            left: x - menuRef.current.clientWidth + width
          }
        default:
      }
    }

  }

  useEffect(() => {

    // detect changes in position by listening to scroll on board content.. maybe

    // const config = {
    //   attributes: true,
    //   characterData: true,
    //   childList: true,
    //   subtree: true,
    //   attributeOldValue: true,
    //   characterDataOldValue: true }

    // const mutationObserver = new MutationObserver((elem) => {
    //   console.log(elem);
    // })

    // mutationObserver.observe(parentRef.current, config);

    const observer = new ResizeObserver((elem) => {
      setRect(elem[0].target.getBoundingClientRect());
      console.log(elem[0].target.getBoundingClientRect());
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
    createPortal(
    <div ref={menuRef} className='menu' style={style}>
        {children}
    </div>
    , document.getElementById('root'))
  )
}
