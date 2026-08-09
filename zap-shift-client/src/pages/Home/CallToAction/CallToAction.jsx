import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const CallToAction = () => {
  const { user } = useAuth();

  return (
    <section className="mb-5" data-aos="fade-up">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-2xl bg-[#03373D] px-6 py-12 md:px-12 md:py-16 text-center relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Send Your First Parcel?
            </h2>
            <p className="text-gray-200 max-w-2xl mx-auto mt-4">
              Join thousands of merchants and individuals who trust Profast for
              fast, safe and affordable parcel delivery across Bangladesh.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                to={user ? "/sendParcel" : "/register"}
                className="btn btn-primary btn-lg rounded-lg px-8"
              >
                {user ? "Send a Parcel Now" : "Create Free Account"}
              </Link>
              <Link
                to="/coverage"
                className="btn btn-outline btn-lg rounded-lg px-8 text-white border-white/40 hover:bg-white/10 hover:border-white"
              >
                Check Coverage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
