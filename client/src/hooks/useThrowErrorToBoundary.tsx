import { useState } from 'react';

export function useThrowErrorToBoundary() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setState] = useState();

  return (error: unknown) => {
    setState(() => {
      throw error;
    });
  };
}
