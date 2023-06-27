import React from "react";
import { SxProps, Theme } from "@mui/material";

export const sidebar: SxProps<Theme> = {
  width: "3rem",
  height: "100rem",
  left: 0,
  zIndex: 1,
  boxShadow: "none",
  justifyContent: "space-around",
  alignItems: "center",
};

export const chat: SxProps<Theme> = {
  flex: 1,

  position: "relative",
  background: "url(chat_background.png) fixed",
};

export const main: SxProps = {
  display: "flex",

  overflow: "hidden",
  marginTop: "3rem",
  marginLeft: "3rem",
  height: "calc(100vh - 3rem)",
};

export const avatar: SxProps<Theme> = {
  textTransform: "uppercase",
  background: "#444",
};

export const emptyChatArea: SxProps<Theme> = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  justifyContent: "center",
  alignItems: "center",
  color: "#d7d7d7",
  background: "var(--light_gray)",
  "& h3": {
    color: "white",
    fontFamily: "Montserrat",
  },
  userSelect: "none",
};
