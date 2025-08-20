import { memo } from 'react';

/* eslint-disable react/display-name */
const MicrosoftIcon = memo(() => {
  return (
    <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="21.5" cy="21.5" r="20.5" stroke="#828282" />
      <g transform="translate(12,12)">
        <rect width="7.5" height="7.5" fill="#828282" />
        <rect x="8.5" width="7.5" height="7.5" fill="#828282" />
        <rect y="8.5" width="7.5" height="7.5" fill="#828282" />
        <rect x="8.5" y="8.5" width="7.5" height="7.5" fill="#828282" />
      </g>
    </svg>
  );
});

export { MicrosoftIcon };
