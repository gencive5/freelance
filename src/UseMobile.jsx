import { useEffect, useRef } from 'react';

function UseMobile() {
  const lastScrollY = useRef(0);
  const locked = useRef(false);

  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const isChrome = /Chrome/i.test(navigator.userAgent) && !/Edg|OPR|SamsungBrowser/i.test(navigator.userAgent);

    if (!isMobile) return; // only mobile-ish
    const setAppVh = (vhPx) => {
      document.documentElement.style.setProperty('--app-vh', `${Math.round(vhPx)}px`);
      document.documentElement.style.setProperty('--app-vh-1', `${(vhPx / 100).toFixed(2)}px`);
    };

    // initial set
    setAppVh(window.visualViewport ? window.visualViewport.height : window.innerHeight);

    const handleViewportChange = () => {
      const vvHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      setAppVh(vvHeight);

      if (isChrome) {
        const layoutHeight = window.innerHeight;
        const keyboardShown = vvHeight < layoutHeight - 100;

        if (keyboardShown && !locked.current) {
          lastScrollY.current = window.scrollY || window.pageYOffset || 0;
          const scrollbarComp = window.innerWidth - document.documentElement.clientWidth;
          document.body.style.position = 'fixed';
          document.body.style.top = `-${lastScrollY.current}px`;
          document.body.style.width = '100%';
          if (scrollbarComp) document.body.style.paddingRight = `${scrollbarComp}px`;
          locked.current = true;
        } else if (!keyboardShown && locked.current) {
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          document.body.style.paddingRight = '';
          window.scrollTo(0, lastScrollY.current);
          locked.current = false;
        }
      }
    };

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', handleViewportChange);
      vv.addEventListener('scroll', handleViewportChange);
    } else {
      window.addEventListener('resize', handleViewportChange);
    }

    window.addEventListener('orientationchange', handleViewportChange);
    window.addEventListener('load', handleViewportChange);
    window.addEventListener('pageshow', handleViewportChange);

    return () => {
      if (vv) {
        vv.removeEventListener('resize', handleViewportChange);
        vv.removeEventListener('scroll', handleViewportChange);
      } else {
        window.removeEventListener('resize', handleViewportChange);
      }
      window.removeEventListener('orientationchange', handleViewportChange);
      window.removeEventListener('load', handleViewportChange);
      window.removeEventListener('pageshow', handleViewportChange);
    };
  }, []);
}

export default UseMobile;
