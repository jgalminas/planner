import { useEffect, useLayoutEffect } from 'react'
import { useFloating, shift, flip, offset, autoUpdate } from '@floating-ui/react-dom-interactions';
import { createPortal } from 'react-dom';
import useClickOutside from './hooks/ClickOutside';

export function FloatingMenu({ button, close, children, placement }) {

const {x, y, reference, floating, strategy, refs} = useFloating({ 
  placement: placement || 'bottom-end',
  whileElementsMounted: autoUpdate,
  middleware: [ shift(), flip(), offset(10)],
});

// checking if element is scrollable
const isScrollable = function (ele) {
const hasScrollableContent = ele.scrollHeight > ele.clientHeight;

const overflowYStyle = window.getComputedStyle(ele).overflowY;
const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

return hasScrollableContent && !isOverflowHidden;
};

// find scrollable parent
const getScrollableParent = function (ele) {
    return !ele || ele === document.body
        ? document.body
        : isScrollable(ele)
        ? ele
        : getScrollableParent(ele.parentNode);
};

useLayoutEffect(() => {
    reference(button);
}, [button.current])

useClickOutside(refs.reference, refs.floating, close);

useEffect(() => {

    const parent = getScrollableParent(button);
    
    const onScroll = () => {
        close();
    }

    parent.addEventListener('scroll', onScroll)

    return () => {
        parent.removeEventListener('scroll', onScroll)
    }

}, [])

  return (
    createPortal(
    <div onClick={(e) => e.stopPropagation()} ref={floating} style={{
      position: strategy,
      top: y ?? 0,
      left: x ?? 0,
      zIndex: 9999
    }}>
    { children }
    </div>, document.getElementById('root'))
  )
}
