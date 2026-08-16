
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { InsertChartOutlined, Language, MilitaryTech, MoneyOffOutlined, PersonOutlineOutlined, Shield, Shuffle, Speed, Token, WaterDropOutlined, WbSunnyOutlined, EmojiEvents, Security, TrendingUp, Verified } from "@mui/icons-material";
import CountUp from "./pages/CountUp";
import MktTableWithTest from "./pages/MktTableWithTest";
import RatingComponent from "../utils/RatingComponent";
import CoinlibWidget from "./pages/CoinlibWidgets";
import Plans from "./pages/Plans";
import HeroSection from "./HeroSection"
import Markets from "./pages/Markets"
import GetStarted from "./pages/GetStarted"
import MiningSection from "./pages/MiningSection"

const Layout = () => {
  

  return (
    <div className="pt-20">
     

    {/* hero section */}
    <HeroSection />
      
      {/* market section */}
      <Markets />

      {/* plans section */}
      <div>
        <Plans />
      </div>
      
      {/* mining section */}
      <MiningSection />

      {/* getstarted section */}
      <div>
        <GetStarted />
      </div>
    </div>
  );
};

export default Layout;
