import { useRouteError } from "react-router-dom";
import RootLayout from "../../layouts/RootLayout";
import NotFound from "./NotFound";

const ErrorPage = () => {
  const error = useRouteError();
  const isNotFound =
    error?.status === 404 ||
    error?.statusText === "Not Found" ||
    !error?.status;

  return (
    <RootLayout>
      <NotFound isNotFound={isNotFound} error={error} />
    </RootLayout>
  );
};

export default ErrorPage;
