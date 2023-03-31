import { Header, Main, Footer } from "./components";
import { Outlet } from "react-router-dom";

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
