import React from "react";
import { Container } from "semantic-ui-react";
import Navbar from "./Navbar";
const Layout = (props) => {
  return (
    <div>
      <Container>
        <Navbar />
        {props.children}
      </Container>
    </div>
  );
};

export default Layout;
