import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    console.error(error);

    return (
      <div id="error-page">
        <h1>Error</h1>
        <p>Unexpected error has occured.</p>
        <p>{error.status}</p>
        <p>{error.statusText || error.data.message}</p>
      </div>
    );
  } else {
    return <div>Unknown Error</div>;
  }
}
