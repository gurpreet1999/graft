import { useState, useEffect } from "react";

export const useWindowSize = ({ marginDesktop, marginMobile }) => {
  const [pageSize, setPageSize] = useState(window.innerWidth < 1200 ? marginMobile : marginDesktop);

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth < 1200 ? marginMobile : marginDesktop);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return pageSize;
};
