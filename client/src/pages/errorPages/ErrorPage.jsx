import { useRouteError } from 'react-router-dom';
import NavHeader from '../../components/layout/NavHeader';
import PageContent from '../../components/layout/PageContent';

function ErrorPage() {
  const error = useRouteError();

  let title = 'An error occurred!';
  let message = 'Something went wrong!';

  if (error && error.status === 500) {
    message = 'Our fault. We are working on fixing it!';
  }

  if (error && error.status === 404) {
    title = 'Not found!';
    message = 'Could not find resource or page.';
  }

  return (
    <>
      <NavHeader />
      <PageContent title={title}>
        <p>{message}</p>
      </PageContent>
    </>
  );
}

export default ErrorPage;
