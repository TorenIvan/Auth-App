import { Outlet } from "react-router-dom";
import { Footer, Header, Main } from "../../../layouts";

function Layout() {
  return (
    <div className="screen-container">
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </div>
  );
}

export default Layout;
