import { useAppSelector } from 'App.hooks';
import { Fragment, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface AuthenticatedProps {
  children: ReactNode;
}
export default function Authenticated(props: AuthenticatedProps) {
  // TODO: 로그인 했는지 확인 하기
  // const isAuthenticated = true;
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  console.log('<Authenticated, isAuthenticated: ', isAuthenticated);
  if (isAuthenticated) {
    return <Fragment {...props}></Fragment>;
  } else {
    // 로그인하지 않은 사용자는 로그인 페이지로 이동
    return <Navigate to="/auth" />;
  }
}
