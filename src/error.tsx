import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Error</h1>
      <p>Unexpected error has occured.</p>
      <p>{error.status}</p>
      <p>{error.statusText || error.message}</p>
    </div>
  );
}
