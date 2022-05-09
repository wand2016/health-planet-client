import { Menu, MenuItem } from "@mui/material";
import React from "react";

type Props = {
  anchorEl: HTMLElement | null;
  onClose: () => void;
};

const MyMenu: React.FC<Props> = (props) => {
  return (
    <Menu
      id="menu-appbar"
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(props.anchorEl)}
      onClose={props.onClose}
    >
      <MenuItem onClick={props.onClose}>OAuth2.0 Settings</MenuItem>
      <MenuItem onClick={props.onClose}>Logout</MenuItem>
    </Menu>
  );
};

export default MyMenu;
