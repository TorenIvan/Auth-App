import { Fragment } from 'react';
import { Outlet } from 'react-router';
import { Footer, Header, Main } from '../../../layouts';

function Layout() {
  return (
    <Fragment>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Fragment>
  );
}

export default Layout;
