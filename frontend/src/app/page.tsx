'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  MapPin,
  Wallet,
  MessageCircle,
  Luggage,
  ShieldCheck,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/common/Button';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';

const features = [
  {
    icon: Sparkles,
    bg: 'bg-indigo-50',
    title: 'AI Itinerary Generation',
    description:
      'Get a complete day-by-day travel plan for any Indian destination — Rajasthan, Kerala, Ladakh, Goa — in seconds.',
  },
  {
    icon: Wallet,
    bg: 'bg-emerald-50',
    title: 'Smart Budget Optimizer',
    description:
      'Over budget? AI finds cheaper dhabas, dharamshalas, and state bus routes without killing the experience.',
  },
  {
    icon: MessageCircle,
    bg: 'bg-violet-50',
    title: 'Trip AI Assistant',
    description:
      'Ask about local festivals, train timings, best street food, or what to avoid — all contextual to your trip.',
  },
  {
    icon: Luggage,
    bg: 'bg-rose-50',
    title: 'Packing Assistant',
    description:
      'Climate-aware packing lists for Ladakh winters, Kerala monsoons, Rajasthan summers and everything in between.',
  },
  {
    icon: TrendingUp,
    bg: 'bg-amber-50',
    title: 'Progress Tracking',
    description:
      'Check off ghats, forts, and temples as you visit them. Watch your Bharat Darshan unfold in real time.',
  },
  {
    icon: ShieldCheck,
    bg: 'bg-slate-50',
    title: 'Secure & Private',
    description:
      'Your itineraries are yours alone — strict data isolation ensures no one else can access your trips.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Pick your destination',
    description: 'Choose anywhere in India — hill station, beach, heritage city, or pilgrimage.',
  },
  {
    step: '02',
    title: 'AI builds your plan',
    description: 'Get a full itinerary with hotels, budget in ₹, and local tips instantly.',
  },
  {
    step: '03',
    title: 'Customize everything',
    description: 'Edit activities, regenerate days, chat with your AI travel assistant.',
  },
  {
    step: '04',
    title: 'Travel with confidence',
    description: 'Pack smart with climate-aware lists and track your journey on the go.',
  },
];

const stats = [
  { value: '10s',  label: 'Avg generation time' },
  { value: '28+',  label: 'Indian states covered' },
  { value: '5+',   label: 'AI-powered features' },
  { value: '∞',    label: 'Destinations supported' },
];

const destinations = [
  { name: 'Rajasthan', emoji: '🏰', desc: 'Forts & Deserts' },
  { name: 'Kerala',    emoji: '🌴', desc: 'Backwaters & Beaches' },
  { name: 'Ladakh',    emoji: '🏔️', desc: 'Mountains & Monasteries' },
  { name: 'Goa',       emoji: '🏖️', desc: 'Sun, Sand & Culture' },
  { name: 'Varanasi',  emoji: '🛕', desc: 'Ghats & Spirituality' },
  { name: 'Himachal',  emoji: '⛰️', desc: 'Trekking & Snow' },
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden">

      {/* ===================== HERO ===================== */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">

        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

            {/* LEFT SIDE */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
                Plan your perfect India trip with{" "}
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-300 bg-clip-text text-transparent">
                  YATRIK
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-400 max-w-2xl lg:max-w-none mb-10 leading-relaxed">
                Plan train journeys, hill station escapes, spiritual yatras,
                beach vacations, road trips, and family holidays across India
                in seconds.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
                <Link href={ROUTES.REGISTER}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      size="lg"
                      icon={<ArrowRight className="w-5 h-5" />}
                      iconPosition="right"
                      className="bg-orange-500 hover:bg-orange-400 shadow-lg shadow-orange-500/25 px-8"
                    >
                      Start planning free
                    </Button>
                  </motion.div>
                </Link>

                <Link href={ROUTES.LOGIN}>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 px-8"
                  >
                    Sign in
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-slate-500 text-sm">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  No credit card required
                </div>

                <div className="hidden sm:block w-px h-4 bg-slate-700" />

                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  All 28 Indian states
                </div>

                <div className="hidden sm:block w-px h-4 bg-slate-700" />

                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Ready in seconds
                </div>
              </div>
            </motion.div>

            {/* RIGHT SIDE - LADAKH PREVIEW */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-3xl border border-white/10 bg-slate-800/50 backdrop-blur-xl shadow-2xl overflow-hidden">

                {/* Browser Bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/80 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>

                  <div className="flex-1 mx-4 bg-slate-700/60 rounded-md px-3 py-1 text-xs text-slate-400">
                    yatrik.app/dashboard/trip/ladakh
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-7">

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        <span className="text-white font-semibold">
                          Ladakh, India
                        </span>
                      </div>

                      <div className="text-slate-500 text-sm mt-1">
                        7 Days • Mid-Range Adventure
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-orange-400 text-xs">
                        Est. Budget
                      </div>
                      <div className="text-white font-bold text-xl">
                        ₹36,500
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      "Pangong Lake Sunrise View",
                      "Khardung La Mountain Pass",
                      "Thiksey Monastery Exploration",
                      "Magnetic Hill Experience",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-700/40 border border-white/5"
                      >
                        <div className="w-2 h-2 rounded-full bg-orange-400" />

                        <div className="flex-1">
                          <div className="text-sm text-slate-300">
                            {item}
                          </div>
                          <div className="text-xs text-slate-500">
                            Morning • ₹800
                          </div>
                        </div>

                        <div className="w-5 h-5 rounded border border-white/10 bg-slate-600" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-slate-700/30 border border-white/5">
                    <div className="text-xs text-slate-400 mb-2">
                      Recommended Hotels
                    </div>

                    <div className="space-y-2">
                      {[
                        "The Grand Dragon Ladakh",
                        "Ladakh Sarai Resort",
                      ].map((hotel, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-slate-300"
                        >
                          <Star className="w-3 h-3 text-amber-400" />
                          {hotel}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-24 bg-orange-500/20 blur-3xl" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ===================== POPULAR DESTINATIONS ===================== */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <motion.div
            {...fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-3">
              Popular Indian Destinations
            </h2>

            <p className="text-lg text-slate-500">
              Click any destination to start planning
            </p>
          </motion.div>

          {/* Destination Cards */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5"
          >
            {destinations.map((dest) => (
              <motion.div
                key={dest.name}
                variants={staggerItem}
                className="h-full"
              >
                <Link href={ROUTES.REGISTER}>
                  <div
                    className="
                      h-44
                      bg-white
                      rounded-2xl
                      border
                      border-slate-200
                      p-5
                      flex
                      flex-col
                      items-center
                      justify-center
                      text-center
                      hover:border-orange-300
                      hover:shadow-xl
                      hover:-translate-y-1
                      transition-all
                      duration-300
                      cursor-pointer
                      group
                    "
                  >
                    <div className="text-4xl mb-4">
                      {dest.emoji}
                    </div>

                    <h3 className="font-semibold text-slate-900 text-lg group-hover:text-orange-600">
                      {dest.name}
                    </h3>

                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                      {dest.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="
                  bg-white
                  rounded-2xl
                  border
                  border-slate-200
                  py-8
                  px-4
                  text-center
                  hover:shadow-md
                  transition-all
                "
              >
                <div className="text-4xl font-bold text-slate-900 mb-2">
                  {stat.value}
                </div>

                <div className="text-sm text-slate-500">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Built for Indian travellers
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Everything you need for smarter travel
            </h2>

            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              AI-powered tools built specifically for planning unforgettable
              journeys across India.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  variants={staggerItem}
                  className="
                    group
                    bg-white
                    rounded-3xl
                    border
                    border-slate-200
                    p-6
                    shadow-sm
                    hover:shadow-xl
                    hover:border-orange-200
                    hover:-translate-y-1
                    transition-all
                    duration-300
                  "
                >
                  <div
                    className={`
                      w-12 h-12
                      rounded-2xl
                      ${feature.bg}
                      flex
                      items-center
                      justify-center
                      mb-5
                      group-hover:scale-105
                      transition-transform
                      duration-300
                    `}
                  >
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="relative py-24 bg-white overflow-hidden">

        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-0 w-72 h-72 bg-orange-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-0 w-72 h-72 bg-indigo-100/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <motion.div
            {...fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-20"
          >

            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Your journey planned in minutes
            </h2>

            <p className="max-w-2xl mx-auto text-lg text-slate-500">
              Tell us where you want to go and let AI create the perfect trip.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">

            {/* Mobile Road */}
            <div className="lg:hidden absolute left-7 top-8 bottom-8 w-[3px] bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600 rounded-full" />

            {/* Desktop Road */}
            <svg
              className="hidden lg:block absolute inset-0 w-full h-full"
              viewBox="0 0 1200 320"
              preserveAspectRatio="none"
            >
              <path
                d="
                  M100 160
                  C250 40,
                  350 40,
                  500 160
                  S850 280,
                  1100 160
                "
                fill="none"
                stroke="#64748B"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="18 14"
                opacity="0.75"
              />
            </svg>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">

              {[
                {
                  icon: "📍",
                  step: "01",
                  title: "Choose Destination",
                  description:
                    "Pick any city, beach, mountain or cultural destination.",
                },
                {
                  icon: "🤖",
                  step: "02",
                  title: "AI Creates Plan",
                  description:
                    "Receive a complete itinerary with stays, activities and routes.",
                },
                {
                  icon: "✨",
                  step: "03",
                  title: "Customize Trip",
                  description:
                    "Adjust budgets, hotels, attractions and daily schedules.",
                },
                {
                  icon: "✈️",
                  step: "04",
                  title: "Travel Smarter",
                  description:
                    "Access packing lists, AI guidance and trip tracking.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  variants={staggerItem}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className={`
                    relative
                    pl-16
                    lg:pl-0
                    ${index % 2 === 1 ? "lg:mt-10" : ""}
                  `}
                >

                  {/* Mobile Marker */}
                  <div
                    className="
                      lg:hidden
                      absolute
                      left-0
                      top-2
                      w-14
                      h-14
                      rounded-full
                      bg-white
                      border
                      border-slate-200
                      shadow-lg
                      flex
                      items-center
                      justify-center
                      text-xl
                      z-10
                    "
                  >
                    {item.icon}
                  </div>

                  {/* Desktop Marker */}
                  <div className="hidden lg:flex justify-center mb-5 relative z-10">
                    <div
                      className="
                        w-16
                        h-16
                        rounded-full
                        bg-white
                        border
                        border-slate-200
                        shadow-xl
                        flex
                        items-center
                        justify-center
                        text-2xl
                        transition-all
                        duration-300
                        hover:scale-110
                      "
                    >
                      {item.icon}
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className="
                      bg-white
                      border
                      border-slate-200
                      rounded-2xl
                      p-5
                      shadow-sm
                      hover:shadow-xl
                      hover:border-orange-200
                      transition-all
                      duration-300
                      min-h-[185px]
                    "
                  >
                    <div className="text-orange-500 text-xs font-bold tracking-widest mb-2">
                      STEP {item.step}
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="relative overflow-hidden py-28 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">

        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-300 text-sm font-medium mb-8">
            ✈️ AI Travel Planning
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
            Your next adventure starts here
          </h2>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Create personalized itineraries, optimize your budget,
            discover hidden gems, and explore India with confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            <Link href={ROUTES.REGISTER}>
              <Button
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                className="
                  bg-orange-500
                  hover:bg-orange-400
                  text-white
                  shadow-xl
                  shadow-orange-500/25
                  px-8
                "
              >
                Start Planning Free
              </Button>
            </Link>

            <Link href={ROUTES.LOGIN}>
              <Button
                size="lg"
                variant="ghost"
                className="
                  border
                  border-white/10
                  text-slate-300
                  hover:bg-white/5
                "
              >
                Sign In
              </Button>
            </Link>

          </div>

          <div className="mt-10 text-sm text-slate-500">
            No credit card required • Free to get started
          </div>

        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-slate-950 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            <div className="flex items-center gap-3">
              <Image
                src="/logo.jpeg"
                alt="Yatrik"
                width={42}
                height={42}
                className="rounded-lg"
              />

              <span className="text-slate-400 text-sm">
                Plan. Explore. Travel.
              </span>
            </div>

            <p className="text-slate-500 text-sm">
              © 2026 YATRIK
            </p>

          </div>

        </div>
      </footer>
    </div>
  );
}