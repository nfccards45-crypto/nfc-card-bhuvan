import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Star,
  Smartphone,
  QrCode,
  Phone,
  MessageCircle,
  Utensils,
  Wine,
  Scissors,
  Hotel,
  CheckCircle2,
  ArrowRight,
  Lock,
  Send,
  X,
  CreditCard,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [_activeTab] = useState<'restaurant' | 'hotel' | 'salon' | 'pub'>('restaurant');
  const [simulatedTaps, setSimulatedTaps] = useState(148);
  const [isTapping, setIsTapping] = useState(false);
  const [tapSuccess, setTapSuccess] = useState(false);

  // Inquiry Form State
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    businessName: '',
    phone: '',
    industry: 'Restaurant / Cafe',
    cardQuantity: '25 Cards',
    notes: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const phoneBhuvan = '+916363603365';
  const phoneBhuvanDisplay = '+91 63636 03365';
  const phoneManish = '+918105055737';
  const phoneManishDisplay = '+91 81050 55737';

  const handleSimulateTap = () => {
    setIsTapping(true);
    setTimeout(() => {
      setIsTapping(false);
      setTapSuccess(true);
      setSimulatedTaps(prev => prev + 1);
      setTimeout(() => setTapSuccess(false), 3000);
    }, 600);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hello! I would like to order Smart NFC Google Review Cards.%0A%0A*Name:* ${inquiryForm.name}%0A*Business:* ${inquiryForm.businessName}%0A*Phone:* ${inquiryForm.phone}%0A*Industry:* ${inquiryForm.industry}%0A*Quantity:* ${inquiryForm.cardQuantity}%0A*Notes:* ${inquiryForm.notes || 'N/A'}`;
    window.open(`https://wa.me/916363603365?text=${message}`, '_blank');
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsOrderModalOpen(false);
    }, 2000);
  };

  const industries = [
    {
      id: 'restaurant',
      name: 'Fine Dining & Restaurants',
      icon: Utensils,
      tag: '5x More Reviews on Bill Folders',
      desc: 'Placed right on the table or inside bill presenter folders. Guests tap with their iPhone or Android to leave a 5-star review before paying.',
      rating: '4.9 ★',
      reviewCount: '+420 reviews/mo',
    },
    {
      id: 'hotel',
      name: 'Hotels & Luxury Resorts',
      icon: Hotel,
      tag: 'Front Desk & Concierge Tap',
      desc: 'Seamless guest checkout experience. Front desk staff invite guests to tap during key card return to capture glowing TripAdvisor and Google reviews.',
      rating: '4.8 ★',
      reviewCount: '+650 reviews/mo',
    },
    {
      id: 'pub',
      name: 'Resto Bars & High-Energy Pubs',
      icon: Wine,
      tag: 'Bar Counter & VIP Booths',
      desc: 'Durable, waterproof, and scratch-resistant matte PVC cards built to withstand drinks and bar environments while converting happy vibes into verified ratings.',
      rating: '4.9 ★',
      reviewCount: '+380 reviews/mo',
    },
    {
      id: 'salon',
      name: 'Spas, Salons & Aesthetics',
      icon: Scissors,
      tag: 'Stylist Station & Reception',
      desc: 'Place on mirrors and payment counters. Customers love the futuristic touchless tap experience right after their premium styling service.',
      rating: '5.0 ★',
      reviewCount: '+290 reviews/mo',
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-brand-500 selection:text-white font-sans relative overflow-x-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/3 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#030712]/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-blue-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <QrCode className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                NFC CARDS <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold font-mono">PRO</span>
              </span>
              <span className="text-[11px] text-slate-400 block font-medium">Smart Dynamic Google Review Cards</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#industries" className="hover:text-white transition-colors">Industries</a>
            <a href="#live-demo" className="hover:text-white transition-colors">Live Interactive Demo</a>
            <a href="#packages" className="hover:text-white transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/916363603365?text=Hello!%20I%20want%20to%20order%20NFC%20Google%20Review%20Cards`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-emerald-400 hover:bg-slate-800 transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Us</span>
            </a>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsOrderModalOpen(true)}
              className="bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-400 hover:to-blue-500 text-white font-semibold text-xs px-4 shadow-lg shadow-brand-500/20 cursor-pointer"
            >
              Order Cards Now
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Next-Gen Reputation Infrastructure</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Multiply Your Google Reviews by <span className="bg-gradient-to-r from-brand-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">5X in 1-Tap.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Transform every happy customer into a verified 5-star Google Review. Premium, custom-branded NFC + Dynamic QR PVC Cards engineered for high-end hotels, fine dining restaurants, resto bars, and salons.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero App Needed</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Works on All iPhone & Android</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant Dynamic Redirection</span>
              </div>
            </div>

            {/* Direct Phone Numbers & Order CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsOrderModalOpen(true)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto bg-gradient-to-r from-brand-500 via-brand-600 to-blue-600 hover:opacity-95 text-white font-bold text-sm px-7 py-3.5 shadow-xl shadow-brand-600/30 cursor-pointer"
              >
                Order Custom Cards Now
              </Button>

              <a
                href={`tel:${phoneBhuvan}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sm font-semibold text-white transition-all shadow-md"
              >
                <Phone className="w-4 h-4 text-brand-400" />
                <span>Call Bhuvan: {phoneBhuvanDisplay}</span>
              </a>
            </div>

            {/* Sub-contact callout */}
            <div className="text-xs text-slate-400 pt-1 flex items-center justify-center lg:justify-start gap-4">
              <span>Direct Sales & Inquiries:</span>
              <a href={`tel:${phoneManish}`} className="text-brand-400 hover:underline font-medium">
                Manish ({phoneManishDisplay})
              </a>
            </div>
          </div>

          {/* Right Interactive 3D Card Simulator */}
          <div className="lg:col-span-5 flex justify-center" id="live-demo">
            <div className="relative w-full max-w-sm">
              {/* Outer Card Glow Halo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 via-emerald-500 to-cyan-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-100 transition duration-1000 animate-pulse" />

              {/* Physical Card Representation */}
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-black rounded-3xl p-7 border border-slate-700/80 shadow-2xl space-y-6 text-left overflow-hidden">
                {/* Metallic Accent Top Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-brand-400" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-300">NFC Smart Tap</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/40">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>5.0 Rating</span>
                  </div>
                </div>

                {/* Center NFC Wave Animation */}
                <div className="py-4 text-center space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center relative">
                    <Smartphone className={`w-9 h-9 text-brand-400 transition-transform duration-300 ${isTapping ? 'scale-125 text-emerald-400' : ''}`} />
                    {isTapping && (
                      <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-extrabold text-base">Tap to Leave 5-Star Review</h4>
                    <p className="text-xs text-slate-400">Hold near top of phone (No app required)</p>
                  </div>
                </div>

                {/* Simulated Taps Counter & Action */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Live Card Scan Counter</span>
                    <span className="font-mono font-bold text-brand-300 bg-brand-950 px-2 py-0.5 rounded border border-brand-800/50">
                      {simulatedTaps} Verified Taps
                    </span>
                  </div>

                  <button
                    onClick={handleSimulateTap}
                    disabled={isTapping}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{isTapping ? 'Simulating NFC Tap...' : 'Test Tap Simulation (+1)'}</span>
                  </button>

                  {tapSuccess && (
                    <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[11px] font-semibold text-center animate-bounce">
                      ✨ Tap Verified! Redirected to Google Review page.
                    </div>
                  )}
                </div>

                {/* Bottom Card Footer */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                  <span>CHIP: NTAG216 DUAL-MODE</span>
                  <span>WATERPROOF PVC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES & USE CASES SECTION */}
      <section id="industries" className="py-20 bg-slate-950/70 border-t border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Built For High-Profile Venues</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Engineered for Premium Hospitality & Luxury Spaces
            </h2>
            <p className="text-sm text-slate-400">
              Over 92% of diners and hotel guests look at Google Ratings before booking. Here is how leading businesses capture instant 5-star ratings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-brand-500/50 transition-all duration-300 shadow-xl space-y-4 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{item.name}</h3>
                      <span className="text-[11px] font-semibold text-emerald-400 block mt-0.5">{item.tag}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                    <span className="text-amber-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {item.rating}
                    </span>
                    <span className="text-brand-300 font-mono">{item.reviewCount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / KEY FEATURES */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Simple 3-Step Process</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How It Works In Real Life
          </h2>
          <p className="text-sm text-slate-400">
            No friction, no searching, no spelling business names. Straight to your 5-star review box in 2 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/40 flex items-center justify-center font-mono font-extrabold text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Present Card to Customer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Place the smart card on tables, bill folders, salon mirrors, or hand it to guests at checkout.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-mono font-extrabold text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Customer Taps or Scans</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customer taps their smartphone against the card or scans the high-resolution backup dynamic QR on the back.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-mono font-extrabold text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Direct 5-Star Review Box</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Their native Google app pops open directly with your rating modal pre-opened. They press post in 5 seconds.
            </p>
          </div>
        </div>
      </section>

      {/* PACKAGES & PRICING */}
      <section id="packages" className="py-20 bg-slate-950/80 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Hardware Packages</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Order Your Custom Branded NFC Cards
            </h2>
            <p className="text-sm text-slate-400">
              One-time purchase. Zero monthly subscription fees. Unlimited scans & lifetime dynamic URL updates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Package 1 */}
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Starter Pack</span>
                <h3 className="text-2xl font-black text-white">5 Smart Cards</h3>
                <p className="text-xs text-slate-400">Ideal for single-location cafes, boutique salons & clinics.</p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>5x Custom Branded PVC Cards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>NFC Dual-Chip + Dynamic QR</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Free Destination Link Setup</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Lifetime Scan Redirection</span>
                  </li>
                </ul>
              </div>

              <Button
                variant="outline"
                size="md"
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
              >
                Inquire Starter Pack
              </Button>
            </div>

            {/* Package 2 - Popular */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-brand-950/90 via-slate-900 to-slate-950 border-2 border-brand-500 shadow-2xl shadow-brand-500/20 space-y-6 flex flex-col justify-between relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-500 text-slate-950 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                Most Popular
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Venue Pro Pack</span>
                <h3 className="text-2xl font-black text-white">25 Smart Cards</h3>
                <p className="text-xs text-slate-300">Designed for busy dining rooms, resto-bars & busy spas.</p>

                <ul className="space-y-2.5 text-xs text-slate-200 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400" />
                    <span>25x Custom Full-Color PVC Cards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400" />
                    <span>Table-Level & Staff Scan Analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400" />
                    <span>Matte Velvet Waterproof Finish</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400" />
                    <span>Priority Dispatch & Setup Support</span>
                  </li>
                </ul>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold shadow-lg shadow-brand-500/30 cursor-pointer"
              >
                Order 25-Card Pro Pack
              </Button>
            </div>

            {/* Package 3 - Enterprise */}
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Hospitality Enterprise</span>
                <h3 className="text-2xl font-black text-white">50 to 500+ Cards</h3>
                <p className="text-xs text-slate-400">Large hotel chains, restaurant franchises & multi-location bars.</p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Bulk Batch Serialization (CARD-0001 to N)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Custom Metallic & Gold Foil Stamping</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Dedicated Account Manager</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>ZIP Package QR Print Assets Included</span>
                  </li>
                </ul>
              </div>

              <Button
                variant="outline"
                size="md"
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
              >
                Inquire Enterprise Bulk
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & DIRECT ORDER CALL-OUT */}
      <section id="contact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 p-8 sm:p-12 border border-brand-500/40 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-brand-300 uppercase tracking-widest">Fast Delivery & Custom Branding</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Ready to Boost Your Ratings?</h2>
            <p className="text-sm text-slate-300">
              Speak directly with our team to customize your card design and configure your dynamic review link.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={`tel:${phoneBhuvan}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-all shadow-xl"
            >
              <Phone className="w-4 h-4 text-brand-600" />
              <span>Call Bhuvan: {phoneBhuvanDisplay}</span>
            </a>

            <a
              href={`tel:${phoneManish}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-white font-bold text-sm hover:bg-slate-700 transition-all shadow-xl"
            >
              <Phone className="w-4 h-4 text-brand-400" />
              <span>Call Manish: {phoneManishDisplay}</span>
            </a>

            <a
              href={`https://wa.me/916363603365?text=Hello%20Bhuvan,%20I%20want%20to%20order%20NFC%20Google%20Review%20Cards`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-xl"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER & DISCREET ADMIN PORTAL */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <QrCode className="w-3.5 h-3.5" />
            </div>
            <span>© 2026 NFC Cards Pro. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Direct Support: {phoneBhuvanDisplay} / {phoneManishDisplay}</span>
            
            {/* Discreet Admin Portal Link */}
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850 hover:border-slate-700 transition-all cursor-pointer"
              title="Staff & Management CRM Portal"
            >
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Staff CRM Portal</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ORDER / INQUIRY MODAL */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-400" />
                Order Smart NFC Review Cards
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Fill this quick form and our team (Bhuvan & Manish) will reach out to confirm your logo and link.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 bg-emerald-950/70 border border-emerald-700/60 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-white font-bold text-base">Inquiry Sent via WhatsApp!</h4>
                <p className="text-xs text-emerald-300">We are opening your WhatsApp chat to finalize your order.</p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={inquiryForm.name}
                    onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    className="w-full text-sm py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Business / Hotel Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Palm Resort"
                      value={inquiryForm.businessName}
                      onChange={e => setInquiryForm({ ...inquiryForm, businessName: e.target.value })}
                      className="w-full text-sm py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={inquiryForm.phone}
                      onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      className="w-full text-sm py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Industry
                    </label>
                    <select
                      value={inquiryForm.industry}
                      onChange={e => setInquiryForm({ ...inquiryForm, industry: e.target.value })}
                      className="w-full text-sm py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-500"
                    >
                      <option value="Restaurant / Cafe">Restaurant / Cafe</option>
                      <option value="Hotel / Resort">Hotel / Resort</option>
                      <option value="Pub / Resto-Bar">Pub / Resto-Bar</option>
                      <option value="Salon / Spa / Aesthetic">Salon / Spa / Aesthetic</option>
                      <option value="Retail / Healthcare / Other">Retail / Healthcare / Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Card Quantity
                    </label>
                    <select
                      value={inquiryForm.cardQuantity}
                      onChange={e => setInquiryForm({ ...inquiryForm, cardQuantity: e.target.value })}
                      className="w-full text-sm py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-500"
                    >
                      <option value="5 Cards (Starter)">5 Cards (Starter)</option>
                      <option value="25 Cards (Venue Pro)">25 Cards (Venue Pro)</option>
                      <option value="50 Cards (Hospitality)">50 Cards (Hospitality)</option>
                      <option value="100+ Cards (Bulk Chain)">100+ Cards (Bulk Chain)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit & WhatsApp Bhuvan / Manish</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
