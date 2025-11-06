import { useState } from 'react';

type ReturnType = readonly [isSubMenuOpen: boolean, toggleSubMenu: (isOpen: boolean) => void];

export function useToggleSubMenu(): ReturnType {
  const [isSubMenuOpen, setSubMenuOpen] = useState<boolean>(false);

  function toggleSubMenu(isOpen: boolean) {
    setSubMenuOpen(isOpen);
  }

  return [isSubMenuOpen, toggleSubMenu] as const;
}
