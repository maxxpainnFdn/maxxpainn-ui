// src/hooks/usePageView.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function usePageView() {
  const location = useLocation();

  useEffect(() => {
    // @ts-expect-error gtag is loaded in html
    if (window.gtag) {
      // @ts-expect-error gtag is loaded in html
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
}
