
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ICONS, COLORS } from '../constants';
import { useTranslation } from '../contexts/LanguageContext';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const hideTabBar = location.pathname.includes('/onboarding') || 
                     location.pathname.includes('/naming/wizard') ||
                     location.pathname.includes('/naming/live') ||
                     location.pathname.includes('/naming/lens') ||
                     location.pathname.includes('/naming/astro') ||
                     location.pathname.includes('/auth') ||
                     location.pathname.includes('/certificate');

  const tabs = [
    { path: '/', label: t('tabs.home'), Icon: ICONS.Home },
    { path: '/naming', label: t('tabs.naming'), Icon: ICONS.Naming },
    { path: '/pets', label: t('tabs.myPet'), Icon: ICONS.MyPet },
    { path: '/community', label: t('tabs.community'), Icon: ICONS.Community },
  ];

  return (
    <div className="flex flex-col h-screen bg-black max-w-md mx-auto relative shadow-2xl overflow-hidden">
      <main className="flex-1 relative overflow-hidden h-full bg-white rounded-none">
        {children}
      </main>

      <AnimatePresence>
        {!hideTabBar && (
          <motion.nav 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 ios-blur border-t border-[#F2F2F7] pb-safe z-[200]"
          >
            <div className="flex justify-around items-center h-[49px] relative">
              {tabs.map(({ path, label, Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) => 
                    `relative flex flex-col items-center justify-center space-y-0.5 transition-colors duration-300 w-full ${isActive ? 'text-[#007AFF]' : 'text-[#8E8E93]'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div 
                          layoutId="tab-highlight"
                          className="absolute inset-0 bg-[#007AFF]/5 rounded-lg -z-10 mx-2 my-1"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <motion.div
                        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.4 }}
                      >
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                      </motion.div>
                      <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-normal'}`}>
                        {label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
