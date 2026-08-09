import { useEffect, useRef, useState } from "react";
import { FaTruck, FaMapMarkedAlt, FaUsers, FaStar } from "react-icons/fa";

const stats = [
  { icon: <FaTruck className="text-4xl" />, value: 25000, suffix: "+", label: "Parcels Delivered" },
  { icon: <FaMapMarkedAlt className="text-4xl" />, value: 64, suffix: "", label: "Districts Covered" },
  { icon: <FaUsers className="text-4xl" />, value: 1200, suffix: "+", label: "Active Riders" },
  { icon: <FaStar className="text-4xl" />, value: 98, suffix: "%", label: "On-time Delivery" },
];

const Counter = ({ target, suffix }) => {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            setValue(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
};

const Stats = () => {
  return (
    <section className="mb-5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className="card bg-base-100 text-base-content shadow-lg border border-base-300 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className="card-body items-center text-center p-8">
                <div className="mb-4 p-5 rounded-2xl bg-base-200 text-primary">
                  {item.icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-base-content">
                  <Counter target={item.value} suffix={item.suffix} />
                </h3>
                <p className="text-base-content/70 font-medium">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
