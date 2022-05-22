import React, { PropsWithChildren } from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import Menu from "@/layouts/AppBar/Menu";

const MyAppBar: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography
          variant="h6"
          color="inherit"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          Health Planet Client
        </Typography>
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu anchorEl={anchorEl} onClose={handleClose} />
        </div>
      </Toolbar>
      {children}
    </AppBar>
  );
};
export default MyAppBar;
