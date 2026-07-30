import Navbar from "../components/navbar";
import HeroSection from "../components/customers/herosection";
// import CategoriesPage from "./categories/page";
import CategorySection from "./categories/categorySection";
import Footer from "../components/footer";
import HistorySection from "./history/historySection";
// import HistoryPage from "./history/page";
import FeedbackSection from "../components/customers/feedback";
import ContactSupportSection from "../components/customers/contactSupportSection";
export default function CustomerPage() {
  return (
<>
    <Navbar/>
 <HeroSection />

<CategorySection/>

<HistorySection />

<FeedbackSection />

<ContactSupportSection />

<Footer />
    </>
  );
}