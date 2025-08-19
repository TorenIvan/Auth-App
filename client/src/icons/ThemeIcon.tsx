import { memo } from 'react';
import { MoonIcon, SunIcon } from './ThemeSpecific';
import { GlobalConstants, Theme } from '../utils';

const ThemeIcon = memo(({ theme }: { theme: Theme }): JSX.Element => {
  if (theme === GlobalConstants.LightPalette) return <MoonIcon />;
  return <SunIcon />;
});

export { ThemeIcon };
