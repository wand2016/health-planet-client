import React from "react";
import AppBar from "@/layouts/AppBar";
import { Body } from "@/components/Body";
import { Box } from "@mui/material";

// TODO: split
export function Layout() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar />
      <Body />
    </Box>
  );
}
