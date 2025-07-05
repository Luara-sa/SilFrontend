import React, { useEffect, useState } from "react";

export const useRender = () => {
  const [render, setRender] = useState(false);
  useEffect(() => {
    setRender(true);
  }, []);

  return { render };
};
