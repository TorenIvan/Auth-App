import { memo } from 'react';
import { MoonIcon, SunIcon } from './ThemeSpecific';
import { Constants, Theme } from '../utils';

const ThemeIcon = memo(({ theme }: { theme: Theme }): JSX.Element => {
  if (theme === Constants.LightPalette) return <MoonIcon />;
  return <SunIcon />;
});

export { ThemeIcon };
