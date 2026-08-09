const faqs = [
  {
    question: "How can I send a parcel with Profast?",
    answer:
      "Simply sign up for a free account, go to the 'Add Parcel' section, enter the sender and receiver details with the parcel type, and pay online via card or choose cash on delivery. A rider will pick up your parcel and it will be delivered to the destination.",
  },
  {
    question: "How can I track my parcel?",
    answer:
      "After booking, you will receive a unique tracking ID. You can use it on the 'Track Parcel' page to follow your parcel's journey in real time — from pickup to final delivery, with every status update.",
  },
  {
    question: "How does cash on delivery (COD) work?",
    answer:
      "Our riders collect the payment amount from your customer at the time of delivery. The collected amount is then transferred to you and shown in your payment history. You can also track the cash collection status from your dashboard.",
  },
  {
    question: "How do I become a rider?",
    answer:
      "Go to the 'Be a Rider' page, fill in your details and submit the application. Our admin team reviews your application and approves it. Once approved, you can receive parcel delivery tasks and earn per delivery.",
  },
  {
    question: "What areas do you cover?",
    answer:
      "We currently deliver to all 64 districts of Bangladesh. Check the 'Coverage' page to see our service centers and delivery zones near you.",
  },
  {
    question: "What if a parcel is returned or undeliverable?",
    answer:
      "If a parcel cannot be delivered after multiple attempts, it is returned to the sender through our reverse logistics facility. You can arrange the return from your dashboard.",
  },
];

const Faq = () => {
  return (
    <section className="py-10 md:py-16" data-aos="fade-up">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content">
            Frequently Asked Questions
          </h2>
          <p className="text-base-content/70 mt-3">
            Everything you need to know about sending parcels with Profast.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              tabIndex={0}
              className="collapse collapse-arrow bg-base-100 text-base-content border border-base-300 shadow-sm"
            >
              <input type="checkbox" />
              <div className="collapse-title text-lg font-semibold pr-10">
                {item.question}
              </div>
              <div className="collapse-content text-base-content/80 leading-relaxed">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
