import { FaStar, FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "Rafiul Islam",
    role: "E-commerce Merchant, Dhaka",
    quote:
      "Profast transformed my online shop. Cash on delivery collection is fast, parcels reach customers on time, and the tracking system keeps everyone informed. Highly recommended!",
    rating: 5,
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Nusrat Jahan",
    role: "Online Clothing Store Owner, Chattogram",
    quote:
      "The rider network is excellent. Even in remote areas of Chattogram my orders get delivered within 48 hours. Customer support responds within minutes whenever I need help.",
    rating: 5,
    avatar: "https://i.pravatar.cc/100?img=47",
  },
  {
    name: "Tanim Ahmed",
    role: "Freelancer, Sylhet",
    quote:
      "I send documents and small parcels regularly. The delivery charge is fair, the app is easy to use, and the live tracking gives me peace of mind every single time.",
    rating: 4,
    avatar: "https://i.pravatar.cc/100?img=33",
  },
];

const Testimonials = () => {
  return (
    <section className="py-10 md:py-16" data-aos="fade-up">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content">
            What Our Customers Say
          </h2>
          <p className="text-base-content/70 mt-3 max-w-2xl mx-auto">
            Thousands of merchants and individuals trust Profast with their
            parcels every day. Here is what a few of them have to say.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="card bg-base-100 text-base-content shadow-lg border border-base-300 flex flex-col h-full"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className="card-body p-7">
                <FaQuoteLeft className="text-primary text-3xl mb-3" />
                <p className="text-base-content/80 leading-relaxed flex-1">
                  "{item.quote}"
                </p>

                <div className="flex gap-1 mt-4 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className={i < item.rating ? "" : "opacity-25"} />
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/30"
                  />
                  <div>
                    <h4 className="font-bold text-base-content">{item.name}</h4>
                    <p className="text-sm text-base-content/60">{item.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
