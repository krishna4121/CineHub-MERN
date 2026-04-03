import React from "react";
import NavbarComp from "../Components/Navbar/NavbarComp";
import FooterComp from "../Components/Footer/FooterComp";

const DefaultLayout = (Component) => (props) => {
  return (
    <>
      <NavbarComp />
      <Component {...props} />
      <FooterComp />
    </>
  );
};

export default DefaultLayout;
