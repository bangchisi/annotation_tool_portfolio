import React from 'react';

import 'assets/css/auth.css';

import AuthForm from 'components/AuthForm';

export default function Auth() {
  return (
    <div id="auth">
      <div id="auth-title">
        <h1>Annotator</h1>
      </div>
      <AuthForm />
    </div>
  );
}
