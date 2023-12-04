import { styled } from '@mui/material';

export const Container = styled('header')`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #20252c !important;
  padding: 10px 32px 10px 16px !important;
`;

export const Nav = styled('nav')`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const LogoContainer = styled('div')`
  display: flex;
  align-items: center;
  h6 {
    color: #0e1116;
  }
`;

export const NavMenuList = styled('ul')`
  display: flex;
  align-items: center;
  flex-direction: row;
  list-style: none;
  margin: 0;
`;

export const NavMenuItem = styled('li')`
  a {
    font-size: 14px;
    color: #0e1116;
    padding: 6px;
  }
  a:hover {
    border-radius: 6px;
    background-color: #e7ecf0;
    transition: background-color 0.2s ease-in-out;
  }
  a.active {
    font-weight: 500;
  }
`;

export const DropDownContainer = styled('div')`
  margin-left: auto;

  .user-info {
    font-size: 14px;
    color: #0e1116;
  }
`;
