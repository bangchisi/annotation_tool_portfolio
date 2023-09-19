// temp
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer } from './LoginForm.style';
// temp end

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  //temp
  const navigate = useNavigate();

  const routeChange = () => {
    const path = '/datasets';
    navigate(path);
  };
  //temp end

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setUsername(event?.target?.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event?.target?.value);
  };

  return (
    <FormContainer>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          id="username"
          className="form-control form-control-lg"
          name="username"
          type="text"
          value={process.env.NODE_ENV === 'development' ? 'admin' : username}
          placeholder="username"
          onChange={handleUsernameChange}
        />
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          className="form-control form-control-lg"
          name="password"
          type="password"
          value={process.env.NODE_ENV === 'development' ? 'admin' : password}
          placeholder="password"
          onChange={handlePasswordChange}
        />
        <button
          className="btn btn-primary"
          onClick={(e) => {
            // this onClick is temporary for mock-up
            e.preventDefault();
            routeChange();
          }}
          type="submit"
        >
          Login
        </button>
      </div>
    </FormContainer>
  );
}
