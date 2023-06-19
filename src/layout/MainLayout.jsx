import { Outlet } from "react-router-dom";

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

import React from "react";

const MainLayout = () => {
  return (
      <div id={'master-layout'} className='page d-flex flex-row flex-column-fluid min-vh-100'>
          <div className='wrapper d-flex flex-column flex-row-fluid w-100'>
              <Header />
                <div className={'h-100'}>
                    <Outlet />
                </div>
              <Footer />
          </div>
    </div>
  );
};

export default MainLayout;
