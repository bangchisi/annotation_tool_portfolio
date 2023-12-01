import { Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { NavLink } from 'react-router-dom';
import AuthModel from 'routes/Auth/models/Auth.model';
import {
  clearAuth,
  setIsAuthenticated,
  setUser,
} from 'routes/Auth/slices/authSlice';
import { RouteMode } from 'App';
import { clearSAM } from 'routes/Annotator/slices/SAMSlice';
import { clearAnnotator } from 'routes/Annotator/slices/annotatorSlice';

interface NavigatorProps {
  currentMode: RouteMode;
  setCurrentMode: React.Dispatch<React.SetStateAction<RouteMode>>;
}

export default function Navigator(props: NavigatorProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const onLogout = async (userId: string) => {
    if (!user.userId) return;
    const response = await AuthModel.logout(userId);
    dispatch(setIsAuthenticated(response.data.isOnline));
    dispatch(
      setUser({
        userId: '',
        userName: '',
        isOnline: response.data.isOnline,
      }),
    );

    dispatch(clearAuth());
    dispatch(clearAnnotator());
    dispatch(clearSAM());
  };

  return (
    <nav id="nav" className="navbar">
      <div className="nav-container">
        <NavLink to="/datasets" className="nav-link">
          <Typography sx={{ marginRight: '20px' }} variant="h6">
            Annotator{process.env.NODE_ENV === 'development' && ' (dev)'}
          </Typography>
        </NavLink>
        <div className="navbar-menu-container">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/datasets">
                Datasets
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="models">
                Models
              </NavLink>
            </li>
            <li className="nav-item"></li>
          </ul>
        </div>
        <div className="nav-item dropstart">
          <a
            className="nav-link"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <Typography display="inline" variant="button" className="user-info">
              {user.userId}
            </Typography>
          </a>
          <ul className="dropdown-menu">
            <li>
              <a className="dropdown-item">Settings</a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => onLogout(user.userId)}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
