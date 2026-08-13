import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AnimatedBackground from "./components/AnimatedBackground";

import Home from "./pages/Home";
import HeartDisease from "./pages/HeartDisease";
import MentalHealth from "./pages/MentalHealth";
import HousePrediction from "./pages/HousePrediction"
import EmailSpamDetection from "./pages/EmailSpamDetection";
import CarPricePrediction from "./pages/CarPricePrediction";
import StudentPlacementPrediction from "./pages/StudentPlacementPrediction";
import WeatherPrediction from "./pages/WeatherPrediction";
import FakeNewsDetection from "./pages/FakeNewsDetection"
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050816] text-slate-100">

      <AnimatedBackground />

      <div className="relative z-10">

        <Navbar />

        <Routes>
  <Route path="/" element={<Home />} />

  <Route
    path="/heart-disease"
    element={<HeartDisease />}
  />

  <Route
    path="/mental-health"
    element={<MentalHealth />}
  />

  <Route
    path="/house-prediction"
    element={<HousePrediction />}
  />

  <Route
  path="/email-prediction"
  element={<EmailSpamDetection />}
  />

  <Route 
  path="/news-prediction"
  element= {<FakeNewsDetection />}
  />

  <Route
  path="/car-prediction"
  element= {<CarPricePrediction />}
  />

  <Route
  path="/student-prediction"
  element= {<StudentPlacementPrediction />}
  />

  <Route
  path="/weather_prediction"
  element= {<WeatherPrediction />}
  />

  <Route path="*" element={<NotFound />} />
</Routes>

      </div>
    </div>
  );
}