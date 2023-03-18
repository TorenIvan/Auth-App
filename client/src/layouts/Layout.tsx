import { ReactNode } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";

interface IProps {
  children: ReactNode;
}

function Layout({ children }: IProps) {
  return (
    <div className="screen-container">
      <Header />
      <Main>{children}</Main>
      <Footer />
    </div>
  );
}

export default Layout;
