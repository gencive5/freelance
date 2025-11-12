import { useEffect, useRef } from 'react';

function UseMobile() {
  const lastScrollY = useRef(0);
  const locked = useRef(false);

  useEffect(() => {
    // only run on mobile-ish widths
    if (window.innerWidth > 1024) return;

    const setAppVh = (vhPx) => {
      // store a pixel height (px) value for greater simplicity
      document.documentElement.style.setProperty('--app-vh', `${Math.round(vhPx)}px`);
      // also keep a 1% variable if you prefer percentage usage:
      document.documentElement.style.setProperty('--app-vh-1', `${(vhPx / 100).toFixed(2)}px`);
    };

    // initial set
    setAppVh(window.visualViewport ? window.visualViewport.height : window.innerHeight);

    // helper: called when viewport changes (resize/orientationchange/visualViewport)
    const handleViewportChange = () => {
      const currentVh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      setAppVh(currentVh);
    };

    // keyboard detection & scroll lock using visualViewport where available
    const vv = window.visualViewport;

    const onVVResize = () => {
      const vvHeight = vv ? vv.height : window.innerHeight;
      const layoutHeight = window.innerHeight; // layout viewport
      setAppVh(vvHeight);

      // heuristic: keyboard is likely present if visualViewport height is significantly smaller
      const keyboardShown = vv ? (vvHeight < layoutHeight - 100) : false;

      if (keyboardShown && !locked.current) {
        // lock scroll
        lastScrollY.current = window.scrollY || window.pageYOffset || 0;

        // compensate for missing scrollbar width (avoid horizontal shift)
        const scrollbarCompensation = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${lastScrollY.current}px`;
        document.body.style.width = '100%';
        if (scrollbarCompensation) document.body.style.paddingRight = `${scrollbarCompensation}px`;

        locked.current = true;
      } else if (!keyboardShown && locked.current) {
        // restore
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, lastScrollY.current);
        locked.current = false;
      }
    };

    // fallback if visualViewport is not available
    const onWindowResize = () => {
      setAppVh(window.innerHeight);
    };

    if (vv) {
      vv.addEventListener('resize', onVVResize);
      vv.addEventListener('scroll', onVVResize); // some browsers adjust offset
    } else {
      window.addEventListener('resize', onWindowResize);
    }

    // also handle orientationchange and page show
    window.addEventListener('orientationchange', handleViewportChange);
    window.addEventListener('load', handleViewportChange);
    window.addEventListener('pageshow', handleViewportChange);

    // clean up
    return () => {
      if (vv) {
        vv.removeEventListener('resize', onVVResize);
        vv.removeEventListener('scroll', onVVResize);
      } else {
        window.removeEventListener('resize', onWindowResize);
      }
      window.removeEventListener('orientationchange', handleViewportChange);
      window.removeEventListener('load', handleViewportChange);
      window.removeEventListener('pageshow', handleViewportChange);
    };
  }, []);
}

export default UseMobile;
