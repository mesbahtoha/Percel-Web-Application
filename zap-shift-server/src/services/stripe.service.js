import { stripe } from "../config/stripe.js";
import { convertTakaToUsdCents } from "../utils/helpers.js";

export const createPaymentIntentForParcel = async (parcel) => {
  const takaAmount = Number(parcel.cost || parcel.price || parcel.amountTaka || 0);
  const amountInCents = convertTakaToUsdCents(takaAmount);
  const usdAmount = Number((amountInCents / 100).toFixed(2));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    payment_method_types: ["card"],
    metadata: {
      parcelId: parcel._id.toString(),
      userEmail: parcel.userEmail || "",
      takaAmount: String(takaAmount),
      usdAmount: usdAmount.toFixed(2),
    },
  });

  return { paymentIntent, takaAmount, amountInCents, usdAmount };
};
