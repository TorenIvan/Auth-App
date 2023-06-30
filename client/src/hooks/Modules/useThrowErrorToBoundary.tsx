import { useState } from "react";

export function useThrowErrorToBoundary() {
  const [_, setState] = useState();

  return (error: unknown) => {
    setState(() => {
      throw error;
    });
  };
}
