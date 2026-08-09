import Banner from "./Banner/Banner";
import BeMerchant from "./BeMerchant/BeMerchant";
import CallToAction from "./CallToAction/CallToAction";
import Faq from "./Faq/Faq";
import Features from "./Features/Features";
import Logos from "./Logos/Logos";
import Services from "./Services/Services";
import Stats from "./Stats/Stats";
import Testimonials from "./Testimonials/Testimonials";

const Home = () => {
    return (
        <div className="max-w-11/12 mx-auto">
            <Banner></Banner>
            <Services></Services>
            <Stats></Stats>
            <Logos></Logos>
            <Features></Features>
            <Testimonials></Testimonials>
            <Faq></Faq>
            <BeMerchant></BeMerchant>
            <CallToAction></CallToAction>
        </div>
    )
}

export default Home;
