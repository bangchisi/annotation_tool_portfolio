import { useAppDispatch, useAppSelector } from 'App.hooks';
import { Link } from 'react-router-dom';
import AuthModel from 'routes/Auth/models/Auth.model';
import { setIsAuthenticated, setUser } from 'routes/Auth/slices/authSlice';

export default function Navigator(props: {
  currentMode: string | null;
  handleCurrentMode: (nextmode: string) => void;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  console.log('nav, user');
  console.dir(user);

  const onLogout = async () => {
    if (!user.userId) return;
    const response = await AuthModel.logout(user.userId);
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
        <a className="navbar-brand" href="#">
          Annotator
        </a>
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
              <Link
                className="nav-link active"
                aria-current="page"
                to="/datasets"
                style={{
                  fontWeight:
                    // props.currentMode === null ||
                    props.currentMode === 'datasets' ? 'bold' : 'normal',
                }}
              >
                Datasets
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/models"
                style={{
                  fontWeight:
                    props.currentMode === 'models' ? 'bold' : 'normal',
                }}
              >
                Models
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/annotator/1"
                style={{
                  fontWeight:
                    props.currentMode === 'annotator' ? 'bold' : 'normal',
                }}
              >
                Annotator
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/auth"
                style={{
                  fontWeight: props.currentMode === 'auth' ? 'bold' : 'normal',
                }}
              >
                Auth_temp
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
              user_1
            </a>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item">Settings</a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" onClick={onLogout}>
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
