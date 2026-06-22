'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/store/uiStore';
import api from '@/services/api';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/lib/constants';

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const toast = useToast();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}

    clearAuth();
    toast.success('Signed out successfully');
    router.push(ROUTES.HOME);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
            <Link
              href={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME}
              className="flex items-center group"
              onClick={() => {
                setProfileOpen(false);
                setMenuOpen(false);
              }}
            >
            <Image
              src="/logo.jpeg"
              alt="Yatrik"
              width={170}
              height={170}
              priority
              className="rounded-xl transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<LayoutDashboard className="w-4 h-4" />}
                  onClick={() => {
                    setProfileOpen(false);
                    setMenuOpen(false);
                    router.push(ROUTES.DASHBOARD);
                  }}
                  className="rounded-xl"
                >
                  Dashboard
                </Button>

                {/* <Button
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => {
                                  setProfileOpen(false);
                                  setMenuOpen(false);
                                  router.push(ROUTES.CREATE_TRIP);
                                }}
                  className="bg-orange-500 hover:bg-orange-400 shadow-lg shadow-orange-500/20"
                >
                  New Trip
                </Button> */}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all duration-300">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-orange-500/20">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <span className="text-sm font-semibold text-slate-800 hidden lg:block">
                      {user?.name?.split(' ')[0]}
                    </span>

                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                        profileOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        onMouseLeave={() => setProfileOpen(false)}
                        className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden py-2 z-50">
                        <div className="px-4 py-4 border-b border-slate-100">
                          <p className="text-sm font-medium text-slate-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {user?.email}
                          </p>
                        </div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link href={ROUTES.LOGIN}>
                  <Button
                    variant="ghost"
                    size="md"
                    className="rounded-xl"
                  >
                    Sign In
                  </Button>
                </Link>

                <Link href={ROUTES.REGISTER}>
                 <Button
                    size="md"
                    className="bg-orange-500 hover:bg-orange-400 shadow-lg shadow-orange-500/25"
                  >
                  Get Started
                </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm">
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 overflow-hidden">
            <div className="px-4 py-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href={ROUTES.DASHBOARD}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-100"
                    onClick={() => {
                      setMenuOpen(false);
                      setProfileOpen(false);
                    }}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>

                  {/* <Link
                    href={ROUTES.CREATE_TRIP}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-100"
                    onClick={() => {
                                    setMenuOpen(false);
                                    setProfileOpen(false);
                                  }}
                  >
                    <Plus className="w-4 h-4" />
                    New Trip
                  </Link> */}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={ROUTES.LOGIN}
                    className="block px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-100"
                    onClick={() => {
                      setMenuOpen(false);
                      setProfileOpen(false);
                    }}
                  >
                    Sign In
                  </Link>

                  <Link
                    href={ROUTES.REGISTER}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-orange-600 hover:bg-orange-50"
                    onClick={() => {
                      setMenuOpen(false);
                      setProfileOpen(false);
                    }}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
