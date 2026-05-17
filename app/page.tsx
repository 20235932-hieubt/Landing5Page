"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Leaf,
  Play,
  Pause,
  Volume2,
  ShieldCheck,
  Menu,
  X,
  Clock,
  Navigation
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data
const MOCK_DATA = {
  farmer: {
    name: "Nguyễn Văn Hùng",
    village: "Bản Phùng, Mộc Châu, Sơn La",
    photo: "/farmer-placeholder.png", // Using the generated photo for the profile
  },
  harvest: {
    date: "15/05/2026",
    time: "06:30 AM",
  },
  gps: {
    lat: "20.8492° N",
    lng: "104.6433° E",
  },
  cultivationMethod: "VietGAP",
  voiceMessage: {
    duration: 30,
    subtitles: {
      vi: "Xin chào, tôi là Hùng. Cảm ơn quý khách đã tin dùng sản phẩm của chúng tôi. Những búp trà này được chúng tôi chăm sóc bằng cả tấm lòng...",
      hmo: "Nyob zoo, kuv yog Hung. Ua tsaug uas koj ntseeg...",
      en: "Hello, I am Hung. Thank you for trusting our products. These tea buds are cared for with all our heart..."
    }
  }
};

const MENU_ITEMS = [
  { id: "farmer", label: "Người Nông Dân" },
  { id: "harvest", label: "Thu Hoạch & Vị Trí" },
  { id: "cultivation", label: "Phương Pháp Canh Tác" },
  { id: "message", label: "Thông Điệp" },
];

export default function ProductLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Voice player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSubtitle, setActiveSubtitle] = useState<'vi' | 'hmo' | 'en'>('vi');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      if (progress >= 100) setProgress(0);

      timerRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            clearInterval(timerRef.current!);
            return 100;
          }
          return prev + (100 / (MOCK_DATA.voiceMessage.duration * 10));
        });
      }, 100);
    }
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll spy to update active menu
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", ...MENU_ITEMS.map(item => item.id)];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-800">

      {/* Sticky Navigation Menu */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => scrollToSection("home")}
            >
              <Image
                src="/6775c585-1340-45f7-9c4f-b5292b83fde5.jpg"
                alt="FarmBridge Logo"
                width={64}
                height={64}
                className="rounded-lg object-cover"
              />
              <span className="font-bold text-xl text-green-800">FarmBridge</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-semibold transition-colors ${activeSection === item.id ? "text-green-600" : "text-neutral-600 hover:text-green-500"
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-neutral-600 hover:text-green-600 focus:outline-none p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-green-100 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-4 space-y-1">
                {MENU_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${activeSection === item.id
                        ? "bg-green-50 text-green-700"
                        : "text-neutral-700 hover:bg-neutral-50 hover:text-green-600"
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* Hero Banner Section using user's image */}
        <section id="home" className="w-full pt-16 bg-white flex justify-center">
          <div className="w-full max-w-[1200px] shadow-sm">
            <Image
              src="/3caf38b9-a7ad-4a23-9db5-4d30817de9dc.jpg"
              alt="FarmBridge Banner"
              width={1200}
              height={675}
              className="w-full h-auto"
              priority
            />
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-16 space-y-24">

          {/* Section 1: Farmer Profile */}
          <section id="farmer" className="scroll-mt-24">
            <div className="flex flex-col md:flex-row items-center gap-10 bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-neutral-200/50 border border-neutral-100">
              <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                <div className="absolute inset-0 bg-green-200 rounded-full blur-2xl opacity-50"></div>
                <Image
                  src={MOCK_DATA.farmer.photo}
                  alt={MOCK_DATA.farmer.name}
                  fill
                  className="object-cover rounded-full shadow-lg border-4 border-white relative z-10"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-green-900 mb-2">{MOCK_DATA.farmer.name}</h2>
                <div className="flex items-center text-neutral-600 mb-6 font-medium">
                  <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  {MOCK_DATA.farmer.village}
                </div>
                <p className="text-neutral-600 leading-relaxed text-lg">
                  "Tôi luôn tâm huyết với từng mầm cây, từng luống đất. Sản phẩm bạn đang cầm trên tay là thành quả của sự lao động miệt mài và tình yêu với thiên nhiên của gia đình chúng tôi."
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Harvest & Location */}
          <section id="harvest" className="scroll-mt-24">
            <h3 className="text-2xl font-bold text-center mb-10 text-neutral-800">Thông Tin Mùa Vụ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-neutral-100 hover:border-orange-200 transition-colors group">
                <div className="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                  <Calendar className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-semibold text-neutral-900 mb-2">Thời Gian Thu Hoạch</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-50">
                    <span className="text-neutral-500">Ngày:</span>
                    <span className="font-bold text-neutral-800">{MOCK_DATA.harvest.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500">Giờ:</span>
                    <span className="font-bold text-neutral-800">{MOCK_DATA.harvest.time}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-neutral-100 hover:border-blue-200 transition-colors group">
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                  <Navigation className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-semibold text-neutral-900 mb-2">Tọa Độ Nông Trại</h4>
                <div className="space-y-3 font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-50">
                    <span className="text-neutral-500 font-sans">Vĩ độ:</span>
                    <span className="font-bold text-neutral-800">{MOCK_DATA.gps.lat}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 font-sans">Kinh độ:</span>
                    <span className="font-bold text-neutral-800">{MOCK_DATA.gps.lng}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Cultivation Method */}
          <section id="cultivation" className="scroll-mt-24">
            <div className="bg-gradient-to-br from-green-600 to-emerald-800 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 opacity-10">
                <Leaf className="w-64 h-64 -mt-10 -mr-10" />
              </div>
              <div className="relative z-10 text-center">
                <div className="inline-flex bg-white/20 p-4 rounded-full mb-6 backdrop-blur-md">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Phương Pháp Canh Tác</h3>
                <h2 className="text-5xl font-extrabold text-green-200 tracking-tight mb-6">
                  {MOCK_DATA.cultivationMethod}
                </h2>
                <p className="max-w-2xl mx-auto text-green-50 text-lg leading-relaxed">
                  Sản phẩm được trồng theo tiêu chuẩn Thực hành Nông nghiệp Tốt, đảm bảo an toàn thực phẩm, chất lượng nông sản, sức khỏe người lao động và bảo vệ môi trường.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Voice Message */}
          <section id="message" className="scroll-mt-24 pb-20">
            <h3 className="text-2xl font-bold text-center mb-10 text-neutral-800">Lời Nhắn Từ Nông Trại</h3>
            <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-xl max-w-2xl mx-auto">

              {/* Player UI */}
              <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 mb-6">
                <div className="flex items-center gap-6">
                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 flex-shrink-0 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                  </button>

                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-green-800 flex items-center gap-2">
                        <Volume2 className="w-4 h-4" /> Băng Ghi Âm
                      </span>
                      <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">0:30</span>
                    </div>
                    <div className="h-3 w-full bg-neutral-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-medium text-neutral-500">
                      <span>0:{(progress / 100 * 30).toFixed(0).padStart(2, '0')}</span>
                      <span>0:30</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtitles */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(['vi', 'hmo', 'en'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setActiveSubtitle(lang)}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeSubtitle === lang
                          ? 'bg-neutral-800 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                    >
                      {lang === 'vi' ? 'Tiếng Việt' : lang === 'hmo' ? "H'Mông" : 'English'}
                    </button>
                  ))}
                </div>

                <div className="bg-green-50 p-6 rounded-2xl border border-green-100 relative">
                  <div className="absolute top-0 left-6 -mt-3 text-4xl text-green-300 font-serif">"</div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeSubtitle}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-lg text-green-900 italic leading-relaxed relative z-10 font-medium"
                    >
                      {MOCK_DATA.voiceMessage.subtitles[activeSubtitle]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-8 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Leaf className="w-5 h-5 text-green-500" />
          <span className="text-white font-bold text-lg">FarmBridge</span>
        </div>
        <p>The Green Bridge Between the Field and the Table.</p>
        <p className="mt-2 text-neutral-600">© 2026 FarmBridge Social Enterprise. Presented by Team 8.</p>
      </footer>
    </div>
  );
}
