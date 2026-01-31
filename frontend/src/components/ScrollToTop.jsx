import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Har baar jab path badlega, window top par scroll ho jayegi
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}