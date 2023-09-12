import React from 'react';
import { useState } from 'react';

// temp
import { useNavigate } from 'react-router-dom';
// temp end

function LoginForm() {
  //temp
  const navigate = useNavigate();

  const routeChange = () => {
    const path = '/datasets';
    navigate(path);
  };
  //temp end

  return (
    <form id="login-form">
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          id="username"
          className="form-control form-control-lg"
          name="username"
          type="text"
          value="admin"
          placeholder="username"
        />
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          className="form-control form-control-lg"
          name="password"
          type="password"
          value="admin"
          placeholder="password"
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
    </form>
  );
}

function RegisterForm() {
  return (
    <form id="login-form">
      <div className="mb-3">
        <label htmlFor="fullname" className="form-label">
          Full Name
        </label>
        <input
          id="fullname"
          className="form-control form-control-lg"
          name="fullname"
          type="text"
          placeholder="Full Name"
        />
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          id="username"
          className="form-control form-control-lg"
          name="username"
          type="text"
          placeholder="Username"
        />
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          className="form-control form-control-lg"
          name="password"
          type="password"
          placeholder="Password"
        />
        <label htmlFor="confirm-password" className="form-label">
          Confirm Password
        </label>
        <input
          id="confirm-password"
          className="form-control form-control-lg"
          name="confirm-password"
          type="password"
          placeholder="Confirm Password"
        />
        <button className="btn btn-primary" type="submit">
          Register
        </button>
      </div>
    </form>
  );
}

export default function AuthForm() {
  const [mode, setMode] = useState<string>('login');

  return (
    <div id="auth-form">
      <div id="tabs">
        <button onClick={() => setMode('login')}>Login</button>
        <button onClick={() => setMode('register')}>Register</button>
      </div>
      {mode === 'login' ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}
