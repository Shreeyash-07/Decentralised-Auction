import React from "react";
import { Menu, Header } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
const Navbar = () => {
  return (
    <Menu
      style={{
        marginTop: "10px",
        padding: "8px",
        fontSize: "15px",
        fontFamily: "poppins",
      }}
    >
      <NavLink to="/">
        <Menu.Item>Auctions</Menu.Item>
      </NavLink>

      <Menu.Menu position="right">
        <NavLink to="/mybids">
          <Menu.Item>My Bids</Menu.Item>
        </NavLink>
        <NavLink to="/">
          <Menu.Item>Auctions</Menu.Item>
        </NavLink>
        <NavLink to="/auction/newAuction">
          <Menu.Item>+</Menu.Item>
        </NavLink>
      </Menu.Menu>
    </Menu>
  );
};

export default Navbar;
