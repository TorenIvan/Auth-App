import { Fragment, ReactNode } from "react";
import Footer from "./Footer";

interface IProps {
  children: ReactNode;
}

function Layout({ children }: IProps) {
  return (
    <div className="screen-container">
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
