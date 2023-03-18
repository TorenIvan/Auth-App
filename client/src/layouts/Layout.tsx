import { ReactNode } from "react";
import Footer from "./Footer";
import Main from "./Main";

interface IProps {
  children: ReactNode;
}

function Layout({ children }: IProps) {
  return (
    <div className="screen-container">
      <Main>{children}</Main>
      <Footer />
    </div>
  );
}

export default Layout;
