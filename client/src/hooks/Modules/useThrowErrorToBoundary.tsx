import { useState } from "react";

export function useThrowErrorToBoundary() {
  const [, setState] = useState();

  return (error: unknown) => {
    setState(() => {
      throw error;
    });
  };
}
