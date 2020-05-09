import { styled } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import {AppBar} from "@material-ui/core";
import Link from "@material-ui/core/Link";

export const MyAppBar = styled(AppBar)({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    padding: '0 40px',
});

export const BlankLink = styled(Link)({
   color: 'white',
    textDecoration: 'none!important',
});


export const MyButton = styled(Button)({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
});