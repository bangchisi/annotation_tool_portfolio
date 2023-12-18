import { Button, styled } from '@mui/material';

export const Container = styled('header')`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid var(--border-color);
  padding: 10px 32px 10px 16px;
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
  gap: 8px;
`;

export const NavMenuItem = styled('li')`
  a {
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
  span {
    font-size: 14px;
    color: #57606a;
  }
  svg {
    color: #57606a;
    margin-right: 4px;
  }
`;

export const DropDownContainer = styled('div')`
  display: flex;
  align-items: center;
  margin-left: auto;

  .user-info {
    line-height: 1;
    font-size: 14px;
    color: #0e1116;
  }
`;

export const UserInfoButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  .user-info {
    margin-top: 2px;
    color: #57606a;
  }

  svg {
    color: #57606a;
    margin-right: 4px;
  }
`;
