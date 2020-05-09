import { styled } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { AppBar } from "@material-ui/core";

import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import {Link} from "react-router-dom";

export const MyAppBar = styled(AppBar)({
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
});

export const MyContainer = styled(Container)({
   marginTop: '50px',
});

export const BlankLink = styled(Link)({
  color: "white",
  textDecoration: "none!important",
});

export const MyButton = styled(Button)({
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "white",
  height: 48,
  padding: "0 30px",
});

export const MyCard = styled(Card)({
  maxWidth: "300px",
});

export const CardSVGContainer = styled(Box)({
  width: "100%",
  height: "150px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});