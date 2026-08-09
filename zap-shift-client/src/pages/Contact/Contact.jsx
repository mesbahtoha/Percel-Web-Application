import { useForm } from "react-hook-form";
import { useState } from "react";
import { httpClient, getErrorMessage } from "../../api/http";
import {
  FiMail,
  FiMapPin,
  FiPhone,
  FiClock,
} from "react-icons/fi";

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setStatus(null);
    try {
      await httpClient.post("/contact", data);
      setStatus({ type: "success", message: "Message sent successfully. We will get back to you soon." });
      reset();
    } catch (error) {
      setStatus({ type: "error", message: getErrorMessage(error, "Failed to send message. Please try again.") });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-base-content">
          Contact Us
        </h1>
        <p className="text-base-content/70 mt-2 max-w-2xl mx-auto">
          Have a question, feedback, or need support with your parcel? Send us a
          message and our team will get back to you within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Contact info */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <FiMail size={22} className="text-primary mb-3" />
            <h3 className="font-bold text-base-content">Email Us</h3>
            <p className="text-base-content/70 text-sm mt-1">support@profast.com</p>
          </div>

          <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <FiMapPin size={22} className="text-primary mb-3" />
            <h3 className="font-bold text-base-content">Visit Us</h3>
            <p className="text-base-content/70 text-sm mt-1">
              House 12, Road 5, Dhanmondi,
              <br />
              Dhaka 1205, Bangladesh
            </p>
          </div>

          <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <FiPhone size={22} className="text-primary mb-3" />
            <h3 className="font-bold text-base-content">Call Us</h3>
            <p className="text-base-content/70 text-sm mt-1">
              +880 1700-000000 (9AM – 9PM)
            </p>
          </div>

          <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <FiClock size={22} className="text-primary mb-3" />
            <h3 className="font-bold text-base-content">Working Hours</h3>
            <p className="text-base-content/70 text-sm mt-1">
              Saturday – Thursday: 9AM – 9PM
              <br />
              Friday: 2PM – 8PM
            </p>
          </div>
        </div>

        {/* Contact form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm lg:col-span-2 space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="block font-semibold mb-1 text-base-content">
                Name
              </label>
              <input
                id="contact-name"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                })}
                type="text"
                placeholder="Your full name"
                className="w-full border border-base-300 bg-base-100 text-base-content rounded-lg px-4 py-2 placeholder:text-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="contact-email" className="block font-semibold mb-1 text-base-content">
                Email
              </label>
              <input
                id="contact-email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                type="email"
                placeholder="Your email address"
                className="w-full border border-base-300 bg-base-100 text-base-content rounded-lg px-4 py-2 placeholder:text-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="contact-subject" className="block font-semibold mb-1 text-base-content">
              Subject
            </label>
            <input
              id="contact-subject"
              {...register("subject", {
                required: "Subject is required",
                minLength: { value: 3, message: "Subject must be at least 3 characters" },
              })}
              type="text"
              placeholder="What is this about?"
              className="w-full border border-base-300 bg-base-100 text-base-content rounded-lg px-4 py-2 placeholder:text-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.subject && <p className="text-error text-sm mt-1">{errors.subject.message}</p>}
          </div>

          <div>
            <label htmlFor="contact-message" className="block font-semibold mb-1 text-base-content">
              Message
            </label>
            <textarea
              id="contact-message"
              {...register("message", {
                required: "Message is required",
                minLength: { value: 10, message: "Message must be at least 10 characters" },
              })}
              rows={5}
              placeholder="Write your message here..."
              className="w-full border border-base-300 bg-base-100 text-base-content rounded-lg px-4 py-2 placeholder:text-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary resize-y"
            />
            {errors.message && <p className="text-error text-sm mt-1">{errors.message.message}</p>}
          </div>

          {status && (
            <div
              role="alert"
              className={`rounded-lg px-4 py-3 text-sm ${
                status.type === "success"
                  ? "bg-success/10 text-success border border-success/30"
                  : "bg-error/10 text-error border border-error/30"
              }`}
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full sm:w-auto rounded-lg px-8"
          >
            {submitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
