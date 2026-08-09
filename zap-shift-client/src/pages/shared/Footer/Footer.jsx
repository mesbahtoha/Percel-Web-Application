import { Link } from "react-router-dom";
import ProfastLogo from "../ProfastLogo/ProfastLogo";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import useAuth from "../../../hooks/useAuth";

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer
      className="footer footer-horizontal footer-center bg-neutral text-neutral-content p-10 rounded-2xl max-w-11/12 mx-auto"
      data-aos="fade-left"
    >
      <div className="grid w-full max-w-6xl gap-10 text-left sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <ProfastLogo />
          <p className="mt-3 text-sm leading-relaxed text-neutral-content/80">
            Profast is Bangladesh's smartest parcel delivery platform. Send
            parcels anywhere in the country with real-time tracking, cash on
            delivery and trusted riders.
          </p>
        </div>

        <nav>
          <h6 className="footer-title text-neutral-content">Quick Links</h6>
          <Link to="/" className="link link-hover">Home</Link>
          <Link to="/about" className="link link-hover">About Us</Link>
          <Link to="/contact" className="link link-hover">Contact</Link>
          <Link to="/coverage" className="link link-hover">Coverage</Link>
          <Link to={user ? "/dashboard/overview" : "/login"} className="link link-hover">
            {user ? "My Dashboard" : "Login"}
          </Link>
        </nav>

        <nav>
          <h6 className="footer-title text-neutral-content">Services</h6>
          <Link to="/sendParcel" className="link link-hover">Send a Parcel</Link>
          <Link to="/dashboard/trackParcel" className="link link-hover">Track Parcel</Link>
          <Link to="/beARider" className="link link-hover">Become a Rider</Link>
          <Link to="/dashboard/paymentHistory" className="link link-hover">Payment History</Link>
        </nav>

        <nav>
          <h6 className="footer-title text-neutral-content">Contact Us</h6>
          <p className="flex items-center gap-2 text-sm">
            <FiMail size={16} /> support@profast.com
          </p>
          <p className="flex items-center gap-2 text-sm">
            <FiPhone size={16} /> +880 1700-000000
          </p>
          <p className="flex items-start gap-2 text-sm">
            <FiMapPin size={16} className="mt-1" /> House 12, Road 5, Dhanmondi, Dhaka 1205, Bangladesh
          </p>
        </nav>
      </div>

      <div className="mt-8 flex w-full max-w-6xl flex-col items-center justify-between gap-4 border-t border-neutral-content/20 pt-6 sm:flex-row">
        <p className="text-sm text-neutral-content/80">
          Copyright © {new Date().getFullYear()} Profast — All rights reserved
        </p>

        <div className="grid grid-flow-col gap-4">
          <a
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter / X"
            className="transition hover:text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" className="fill-current">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
          </a>
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="transition hover:text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" className="fill-current">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="transition hover:text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" className="fill-current">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
