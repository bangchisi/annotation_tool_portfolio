import { Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'App.hooks';
import { Link } from 'react-router-dom';
import AuthModel from 'routes/Auth/models/Auth.model';
import { setIsAuthenticated, setUser } from 'routes/Auth/slices/authSlice';
import { RouteMode } from 'App';

interface NavigatorProps {
  currentMode: RouteMode;
  setCurrentMode: React.Dispatch<React.SetStateAction<RouteMode>>;
}

export default function Navigator(props: NavigatorProps) {
  // const { currentMode, setCurrentMode } = props;
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  console.log('nav, user');
  console.dir(user);

  const onLogout = async (userId: string) => {
    if (!user.userId) return;
    const response = await AuthModel.logout(userId);
    console.log('dispatch setUser');
    dispatch(setIsAuthenticated(response.data.isOnline));
    dispatch(
      setUser({
        userId: '',
        userName: '',
        isOnline: response.data.isOnline,
      }),
    );
  };

  return (
    <nav
      id="nav"
      className="navbar navbar-expand-lg bg-body-tertiary p-2 pe-3 border-bottom"
    >
      <div className="container-fluid">
        <Link to="/datasets" className="nav-link">
          <Typography sx={{ marginRight: '10px' }} variant="h6">
            Annotator
          </Typography>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              {/* <NavigatorLink
                data-selected={true}
                to="/datasets"
                onClick={() => {
                  setCurrentMode(RouteMode.DATASET);
                }}
              >
                Datasets
              </NavigatorLink> */}
              <Link
                className="nav-link active"
                aria-current="page"
                to="/datasets"
              >
                Datasets
              </Link>
            </li>
            <li className="nav-item">
              {/* <NavigatorLink
                data-selected={true}
                to="/models"
                onClick={() => {
                  setCurrentMode(RouteMode.MODELS);
                }}
              >
                Models
              </NavigatorLink> */}
              <Link className="nav-link" to="/models">
                Models
              </Link>
            </li>
          </ul>
          <div className="nav-item dropstart">
            <a
              className="nav-link"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Typography display="inline" variant="button">
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
      </div>
    </nav>
  );
}
