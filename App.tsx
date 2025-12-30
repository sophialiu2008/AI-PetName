
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

// 页面深度定义，用于判断是 Push 还是 Pop
const PAGE_DEPTH: Record<string, number> = {
  '/onboarding': 0,
  '/': 1,
  '/naming': 1,
  '/pets': 1,
  '/community': 1,
  '/naming/wizard': 2,
  '/naming/lens': 2,
  '/naming/live': 2,
  '/naming/results': 3,
  '/certificate': 4
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
  const [direction, setDirection] = useState<'forward' | 'backward' | 'fade'>( 'fade' );

  useEffect(() => {
    const prevDepth = PAGE_DEPTH[prevPathRef.current] || 0;
    const currentDepth = PAGE_DEPTH[location.pathname] || 0;

    if (prevDepth === currentDepth) {
      setDirection('fade');
    } else if (currentDepth > prevDepth) {
      setDirection('forward');
    } else {
      setDirection('backward');
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  // 判断是否为 Modal 页面
  const isModal = location.pathname === '/naming/live' || 
                  location.pathname === '/naming/lens' || 
                  location.pathname === '/onboarding';

  // 动画变体配置
  const variants = {
    initial: (custom: any) => {
      if (custom.isModal) return { y: '100%', opacity: 1, scale: 1 };
      if (custom.direction === 'forward') return { x: '100%', opacity: 1, scale: 1 };
      if (custom.direction === 'backward') return { x: '-30%', opacity: 0, scale: 0.95 };
      return { opacity: 0, scale: 0.98 };
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
        staggerChildren: 0.1
      }
    },
    exit: (custom: any) => {
      if (custom.isModal) return { y: '100%', opacity: 1, transition: { duration: 0.4, ease: [0.32, 1, 0.68, 1] } };
      if (custom.direction === 'forward') return { x: '-30%', opacity: 0.5, scale: 0.95, transition: { duration: 0.4 } };
      if (custom.direction === 'backward') return { x: '100%', opacity: 1, transition: { duration: 0.4 } };
      return { opacity: 0, scale: 1.02, transition: { duration: 0.2 } };
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <AnimatePresence mode="popLayout" custom={{ direction, isModal }} initial={false}>
        <motion.div
          key={location.pathname}
          custom={{ direction, isModal }}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full h-full will-change-transform absolute top-0 left-0 bg-white"
          style={{ 
            zIndex: isModal ? 100 : 1,
            // 只有当有 Modal 在上面时，下面的层才会显示圆角缩进
            borderRadius: isModal ? '0' : '0' 
          }}
        >
          <Routes location={location}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/" element={<Home />} />
            <Route path="/naming" element={<Home />} />
            <Route path="/naming/wizard" element={<NamingWizard />} />
            <Route path="/naming/lens" element={<NamingLens />} />
            <Route path="/naming/live" element={<LiveConsultation />} />
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
    <Router>
      <Initializer>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </Initializer>
    </Router>
  );
};

export default App;
