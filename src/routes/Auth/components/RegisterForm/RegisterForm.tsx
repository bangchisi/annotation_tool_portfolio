import { ChangeEvent, useState } from 'react';
import { FormContainer } from './RegisterForm.style';

export default function RegisterForm() {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleFullnameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setFullname(event?.target?.value);
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setUsername(event?.target?.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event?.target?.value);
  };

  const handleConfirmPasswordChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setConfirmPassword(event?.target?.value);
  };

  return (
    <FormContainer>
      <div className="mb-3">
        <label htmlFor="fullname" className="form-label">
          Full Name
        </label>
        <input
          id="fullname"
          className="form-control form-control-lg"
          name="fullname"
          value={fullname}
          type="text"
          placeholder="Full Name"
          onChange={handleFullnameChange}
        />
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          id="username"
          className="form-control form-control-lg"
          name="username"
          value={username}
          type="text"
          placeholder="Username"
          onChange={handleUsernameChange}
        />
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          className="form-control form-control-lg"
          name="password"
          value={password}
          type="password"
          placeholder="Password"
          onChange={handlePasswordChange}
        />
        <label htmlFor="confirm-password" className="form-label">
          Confirm Password
        </label>
        <input
          id="confirm-password"
          className="form-control form-control-lg"
          name="confirm-password"
          value={confirmPassword}
          type="password"
          placeholder="Confirm Password"
          onChange={handleConfirmPasswordChange}
        />
        <button className="btn btn-primary" type="submit">
          Register
        </button>
      </div>
    </FormContainer>
  );
}
