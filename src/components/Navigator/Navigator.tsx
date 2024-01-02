import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {
  ClickAwayListener,
  Divider,
  Grow,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from '@mui/material';
import { RouteMode } from 'App';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { DatasetsIcon, ModelsIcon, ProfileIcon } from 'Icons';
import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { clearSAM } from 'routes/Annotator/slices/SAMSlice';
import { clearAnnotator } from 'routes/Annotator/slices/annotatorSlice';
import {
  clearAuth,
  setIsAuthenticated,
  setUser,
} from 'routes/Auth/slices/authSlice';
import {
  Container,
  DropDownContainer,
  LogoContainer,
  Nav,
  NavMenuItem,
  NavMenuList,
  UserInfoButton,
} from './Navigator.style';
import { OnboardingButton } from 'components/Onboarding';
import { useTypedSWRMutation } from 'hooks';

interface NavigatorProps {
  currentMode: RouteMode;
  setCurrentMode: React.Dispatch<React.SetStateAction<RouteMode>>;
}

export default function Navigator(props: NavigatorProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const route = useLocation().pathname.split('/')[1];

  const { trigger: logout } = useTypedSWRMutation<{
    userId: string;
    userName: string;
    isOnline: boolean;
  }>(
    {
      method: 'post',
      endpoint: '/user/logout',
    },
    {
      user_id: user.userId,
    },
  );

  const onLogout = async () => {
    if (!user.userId) return;
    const response = await logout();
    dispatch(setIsAuthenticated(response.isOnline));
    dispatch(
      setUser({
        userId: '',
        userName: '',
        isOnline: response.isOnline,
      }),
    );

    dispatch(clearAuth());
    dispatch(clearAnnotator());
    dispatch(clearSAM());
  };
  const handleLogout = () => {
    console.log('logout');
    onLogout();
    handleClose(new Event('click'));
  };

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  const prevOpen = useRef(open);
  useEffect(() => {
    if (anchorRef.current === null) return;

    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Container>
      <Nav>
        <LogoContainer>
          <NavLink to="/datasets" className="nav-link">
            <Typography sx={{ marginRight: '20px' }} variant="h6">
              Annotator{process.env.NODE_ENV === 'development' && ' (dev)'}
            </Typography>
          </NavLink>
        </LogoContainer>
        <NavMenuList>
          <NavMenuItem>
            <NavLink className="nav-link" to="/datasets">
              <DatasetsIcon
                sx={{
                  fontSize: '19px',
                }}
              />
              <span>Datasets</span>
            </NavLink>
          </NavMenuItem>
          <NavMenuItem>
            <NavLink className="nav-link" to="models">
              <ModelsIcon
                sx={{
                  fontSize: '21px',
                }}
              />
              <span>Models</span>
            </NavLink>
          </NavMenuItem>
        </NavMenuList>
        <DropDownContainer>
          <OnboardingButton page={route} />
          <UserInfoButton
            ref={anchorRef}
            id="composition-button"
            aria-controls={open ? 'composition-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            sx={{}}
          >
            <ProfileIcon />
            <Typography display="inline" variant="button" className="user-info">
              {user.userId}
            </Typography>
          </UserInfoButton>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-end"
            transition
          >
            {({ TransitionProps }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: 'right top',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id="composition-menu"
                      aria-labelledby="composition-button"
                      onKeyDown={handleListKeyDown}
                      dense
                      sx={{
                        border: '1px solid rgba(0, 0, 0, 0.125)',
                        marginTop: '8px',
                      }}
                    >
                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <BadgeOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Profile</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <SettingsOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Settings</ListItemText>
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={() => handleLogout()}>
                        <ListItemIcon>
                          <LogoutOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </DropDownContainer>
      </Nav>
    </Container>
  );
}
