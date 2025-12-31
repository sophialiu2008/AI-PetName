
import React, { useEffect, useState, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import Home from './views/Home';
import NamingWizard from './views/NamingWizard';
import NamingLens from './views/NamingLens';
import NamingResults from './views/NamingResults';
import PetProfile from './views/PetProfile';
import Community from './views/Community';
import Onboarding from './views/Onboarding';
import BirthCertificate from './views/BirthCertificate';
import LiveConsultation from './views/LiveConsultation';
import AstroNaming from './views/AstroNaming';
import Auth from './views/Auth';
import { LanguageProvider } from './contexts/LanguageContext';

// 页面深度定义
const PAGE_DEPTH: Record<string, number> = {
  '/auth': 0,
  '/onboarding': 0,
  '/': 1,
  '/naming': 1,
  '/pets': 1,
  '/community': 1,
  '/naming/wizard': 2,
  '/naming/lens': 10,
  '/naming/live': 10,
  '/naming/astro': 10, // 全屏 Modal
  '/naming/results': 3,
  '/certificate': 4
};

// 判断是否为全屏 Modal 模式
const checkIsModal = (path: string) => {
  return path === '/naming/live' || 
         path === '/naming/lens' || 
         path === '/naming/astro' || 
         path === '/auth' ||
         path === '/onboarding';
};

const Initializer = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('has_onboarded');
    if (!hasOnboarded && location.pathname !== '/onboarding') {
      navigate('/onboarding');
    }
  }, [navigate, location]);

  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const [direction, setDirection] = useState<'forward' | 'backward' | 'fade'>('fade');

  const isCurrentModal = checkIsModal(location.pathname);
  const isPrevModal = checkIsModal(prevPathRef.current);

  useEffect(() => {
    const prevDepth = PAGE_DEPTH[prevPathRef.current] ?? 1;
    const currentDepth = PAGE_DEPTH[location.pathname] ?? 1;

    if (isCurrentModal || isPrevModal) {
      setDirection('fade');
    } else if (prevDepth === currentDepth) {
      setDirection('fade');
    } else if (currentDepth > prevDepth) {
      setDirection('forward');
    } else {
      setDirection('backward');
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname, isCurrentModal, isPrevModal]);

  const variants = {
    initial: (custom: any) => {
      if (custom.isModal) return { y: '100%', opacity: 1 };
      if (custom.direction === 'forward') return { x: '100%', opacity: 1 };
      if (custom.direction === 'backward') return { x: '-30%', opacity: 0.8 };
      return { opacity: 0 };
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
        mass: 1,
      }
    },
    exit: (custom: any) => {
      if (custom.isNextModal) return { opacity: 0.9, x: 0, scale: 0.96, transition: { duration: 0.4 } };
      if (custom.isModal) return { y: '100%', transition: { duration: 0.4, ease: [0.32, 1, 0.68, 1] } };
      if (custom.direction === 'forward') return { x: '-30%', opacity: 0.5, transition: { duration: 0.45 } };
      if (custom.direction === 'backward') return { x: '100%', transition: { duration: 0.45 } };
      return { opacity: 0, transition: { duration: 0.2 } };
    }
  };

  const wrapperBg = isCurrentModal ? 
    (location.pathname === '/naming/lens' || location.pathname === '/naming/live' || location.pathname === '/naming/astro' ? 'bg-[#0A0A0A]' : 'bg-white') 
    : 'bg-white';

  return (
    <div className={`relative w-full h-full overflow-hidden ${wrapperBg}`}>
      <AnimatePresence mode="popLayout" custom={{ direction, isModal: isCurrentModal, isNextModal: isCurrentModal }} initial={false}>
        <motion.div
          key={location.pathname}
          custom={{ direction, isModal: isCurrentModal, isNextModal: isCurrentModal }}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full h-full will-change-transform absolute top-0 left-0 overflow-hidden"
          style={{ 
            zIndex: isCurrentModal ? 100 : 1,
            backgroundColor: isCurrentModal && (location.pathname.includes('lens') || location.pathname.includes('live') || location.pathname.includes('astro')) ? '#0A0A0A' : 'white',
            boxShadow: direction === 'forward' && !isCurrentModal ? '-10px 0 30px rgba(0,0,0,0.08)' : 'none'
          }}
        >
          <Routes location={location}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Home />} />
            <Route path="/naming" element={<Home />} />
            <Route path="/naming/wizard" element={<NamingWizard />} />
            <Route path="/naming/lens" element={<NamingLens />} />
            <Route path="/naming/live" element={<LiveConsultation />} />
            <Route path="/naming/astro" element={<AstroNaming />} />
            <Route path="/naming/results" element={<NamingResults />} />
            <Route path="/pets" element={<PetProfile />} />
            <Route path="/community" element={<Community />} />
            <Route path="/certificate" element={<BirthCertificate />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <Router>
        <Initializer>
          <Layout>
            <AnimatedRoutes />
          </Layout>
        </Initializer>
      </Router>
    </LanguageProvider>
  );
};

export default App;
