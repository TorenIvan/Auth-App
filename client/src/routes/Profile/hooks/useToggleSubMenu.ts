import { useState } from 'react';

type ReturnType = readonly [isSubMenuOpen: boolean, toggleSubMenu: (isOpen?: boolean) => void];

export function useToggleSubMenu(): ReturnType {
  const [isSubMenuOpen, setSubMenuOpen] = useState<boolean>(false);

  function toggleSubMenu(isOpen?: boolean) {
    if (isOpen === undefined) {
      setSubMenuOpen((isOpen) => !isOpen);
      return;
    }
    setSubMenuOpen(isOpen);
  }

  return [isSubMenuOpen, toggleSubMenu] as const;
}
