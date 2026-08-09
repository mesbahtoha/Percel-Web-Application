import { Link, useLocation } from "react-router-dom";
import { FiHome, FiMapPin, FiAlertTriangle } from "react-icons/fi";

const NotFound = ({ isNotFound = true, error }) => {
  const location = useLocation();
  const errorMessage = error?.message || error?.data || "";

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl text-center">
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-error/10 text-error"
          aria-hidden="true"
        >
          <FiAlertTriangle size={40} />
        </div>

        <p className="text-7xl font-extrabold tracking-tight text-primary md:text-8xl">
          {isNotFound ? "404" : "Oops!"}
        </p>

        <h1 className="mt-4 text-2xl font-bold text-base-content md:text-3xl">
          {isNotFound ? "Page Not Found" : "Something Went Wrong"}
        </h1>

        <p className="mx-auto mt-3 max-w-md text-base-content/70">
          {isNotFound ? (
            <>
              The page you are looking for doesn't exist or may have been moved.
              Check the address{" "}
              <span className="font-mono text-sm text-base-content/60">
                {location.pathname}
              </span>{" "}
              and try again.
            </>
          ) : (
            <>
              An unexpected error occurred while loading this page. Please go
              back to the home page and try again.
            </>
          )}
        </p>

        {errorMessage && (
          <p className="mx-auto mt-3 max-w-md rounded-xl bg-base-100 px-4 py-2 text-xs text-base-content/50">
            {errorMessage}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn btn-primary rounded-lg px-8">
            <FiHome size={18} />
            Back to Home
          </Link>
          <Link
            to="/coverage"
            className="btn btn-outline btn-primary rounded-lg px-8"
          >
            <FiMapPin size={18} />
            Check Coverage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
