import { memo } from "react";
import "../authStyles.css";

const Header = ({title}: {title: JSX.Element}): JSX.Element => {
  return (
    <header>
      {title}
      <h4>
        Master web development by making real-life&nbsp; 
        projects. There are multiple paths for you to&nbsp; 
        choose.
      </h4>
    </header>
  );
};

export default memo(Header);
