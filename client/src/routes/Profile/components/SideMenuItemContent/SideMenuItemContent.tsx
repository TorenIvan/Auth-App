import { memo } from "react";

interface IProps {
  image: string;
  value: string;
  color: string;
}

function SideMenuItemContent({ image, value, color }: IProps): JSX.Element {
  return <div>SideMenuItemContent</div>;
}

export default memo(SideMenuItemContent);
