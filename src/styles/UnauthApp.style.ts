import React from "react";
import { SxProps, Theme } from "@mui/material";

export const root: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minWidth: "330px",
};

export const dialog: SxProps<Theme> = {
  background: "#fff",
  padding: "1rem",
  borderRadius: "20px",

  "& h5": {
    marginBottom: "1rem",
  },
};

export const dialogContent: SxProps<Theme> = {
  width: "400px",
};

export const submit: React.CSSProperties = {
  margin: "20px 0 5px 0",
};

export const checkBoxText: React.CSSProperties = {
  fontSize: "0.8rem",
};

export const progress: React.CSSProperties = {
  marginLeft: "1rem",
};

export const small: React.CSSProperties = {
  margin: "0.5rem 0 0.5rem",
  color: "var(--dark_gray)",
};
export const dialogActions: SxProps<Theme> = {
  "& button": {
    padding: "0.5rem 0",
  },
};
