
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader, Card } from '../components/UI';
import { ICONS, COLORS } from '../constants';
import { useTranslation } from '../contexts/LanguageContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useTranslation();
  const user = JSON.parse(localStorage.getItem('paw_user') || 'null');
  const [showSettings, setShowSettings] = useState(false);

  const paths = [
    {
      id: 'text',
      title: t('home.wizard'),
      subtitle: t('home.wizardSub'),
      icon: <ICONS.Text size={24} className="text-white" />,
      color: 'bg-gradient-to-br from-[#FF6B9D] to-[#FF9A8B]',
      route: '/naming/wizard'
    },
    {
      id: 'vision',
      title: t('home.lens'),
      subtitle: t('home.lensSub'),
      icon: <ICONS.Camera size={24} className="text-white" />,
      color: 'bg-gradient-to-br from-[#A1C4FD] to-[#C2E9FB]',
      route: '/naming/lens'
    },
    {
      id: 'live',
      title: t('home.live'),
      subtitle: t('home.liveSub'),
      icon: <ICONS.Mic size={24} className="text-white" />,
      color: 'bg-gradient-to-br from-[#007AFF] to-[#5AC8FA]',
      route: '/naming/live'
    },
    {
      id: 'astro',
      title: t('home.astro'),
      subtitle: t('home.astroSub'),
      icon: <ICONS.Stars size={24} className="text-white" />,
      color: 'bg-gradient-to-br from-[#5856D6] to-[#AF52DE]',
      route: '/naming/astro'
    }
  ];

  const handleProfileClick = () => {
    setShowSettings(true);
  };

  const handleLogout = () => {
    if (confirm(t('home.logoutConfirm'))) {
      localStorage.removeItem('paw_user');
      window.location.reload();
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pb-8 overflow-y-auto h-full no-scrollbar relative"
    >
      {/* iOS Style Header */}
      <motion.div variants={itemVariants} className="px-5 pt-8 mb-6 flex items-center justify-between">
        <div>
          <p className="text-[#8E8E93] text-sm font-medium">{t('home.welcome')}</p>
          <h2 className="text-2xl font-bold tracking-tight">{user ? user.username : t('home.guest')}</h2>
        </div>
        <button 
          onClick={handleProfileClick}
          className="w-12 h-12 rounded-full bg-[#F2F2F7] flex items-center justify-center overflow-hidden border border-[#F2F2F7] active:scale-95 transition-all shadow-sm"
        >
          {user ? (
            <div className="w-full h-full bg-[#007AFF] flex items-center justify-center text-white font-bold text-lg">
              {user.username[0].toUpperCase()}
            </div>
          ) : (
            <ICONS.User size={24} className="text-[#8E8E93]" />
          )}
        </button>
      </motion.div>

      {/* Mock Search Bar */}
      <motion.div variants={itemVariants} className="px-5 mb-8">
        <div className="bg-[#F2F2F7] h-12 rounded-2xl flex items-center px-4 gap-3 text-[#8E8E93] active:bg-[#E5E5EA] transition-colors cursor-text">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span className="text-[16px] font-medium">{t('home.searchPlaceholder')}</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-4">
        <SectionHeader title={t('home.discovery')} subtitle={t('home.discoverySub')} />
      </motion.div>

      {/* 2x2 Grid Layout */}
      <motion.div variants={itemVariants} className="px-5 grid grid-cols-2 gap-4 mb-10">
        {paths.map((path) => (
          <Card 
            key={path.id}
            onClick={() => navigate(path.route)}
            className="group relative h-[140px] border-0 overflow-hidden active:scale-[0.98] transition-all"
          >
            <div className={`absolute inset-0 ${path.color} opacity-90 transition-transform group-hover:scale-105 duration-700`} />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
            <div className="absolute inset-0 p-4 flex flex-col justify-between items-start">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md shadow-sm">
                {path.icon}
              </div>
              <div className="text-white">
                <h3 className="text-[17px] font-bold tracking-tight mb-0.5">{path.title}</h3>
                <p className="text-[11px] opacity-80 font-medium">{path.subtitle}</p>
              </div>
            </div>
            {(path.id === 'live' || path.id === 'astro') && (
              <div className="absolute top-3 right-3 bg-white/30 px-2 py-0.5 rounded-full text-[9px] text-white font-bold backdrop-blur-md border border-white/20">
                {path.id === 'live' ? 'HOT' : 'PRO'}
              </div>
            )}
          </Card>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="mt-8">
        <SectionHeader title={t('home.hotList')} actionLabel={t('common.all')} />
        <div className="px-5 space-y-3">
          {[
            { name: language === 'zh' ? '糯米' : 'Nomi', type: language === 'zh' ? '猫咪' : 'Cat', count: '2.4w', rank: 1 },
            { name: language === 'zh' ? '奥利奥' : 'Oreo', type: language === 'zh' ? '狗狗' : 'Dog', count: '1.8w', rank: 2 },
            { name: language === 'zh' ? '可乐' : 'Cola', type: language === 'zh' ? '通用' : 'Universal', count: '1.5w', rank: 3 },
          ].map((item) => (
            <Card key={item.name} className="p-4 flex items-center gap-4 active:bg-[#F2F2F7] border-0 bg-slate-50/50">
              <span className={`text-2xl font-black w-8 ${item.rank === 1 ? 'text-[#FFD700]' : 'text-[#C7C7CC]'}`}>
                {item.rank}
              </span>
              <div className="flex-1">
                <h4 className="font-bold text-lg">{item.name}</h4>
                <p className="text-sm text-[#8E8E93]">{item.type} · {item.count}</p>
              </div>
              <ICONS.ChevronRight size={20} className="text-[#C7C7CC]" />
            </Card>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-10 px-5 mb-10">
        <Card className="bg-gradient-to-r from-[#FF6B9D] to-[#FFD700] p-7 text-white text-center border-0 shadow-xl overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#007AFF]/10 rounded-full blur-2xl"></div>
          <h3 className="text-2xl font-bold mb-2 relative z-10">{t('home.certTitle')}</h3>
          <p className="text-sm mb-6 opacity-90 leading-relaxed relative z-10">{t('home.certSub')}</p>
          <button 
            onClick={() => navigate('/certificate')}
            className="bg-white text-[#FF6B9D] px-8 py-3 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-transform relative z-10"
          >
            {t('home.certBtn')}
          </button>
        </Card>
      </motion.div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[300]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6 pb-12 z-[301] shadow-2xl max-w-md mx-auto"
            >
              <div className="w-12 h-1 bg-[#F2F2F7] rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-6 text-center">{t('home.settings')}</h3>
              
              <div className="space-y-4">
                <div className="bg-[#F2F2F7] p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ICONS.Globe size={20} className="text-[#007AFF]" />
                    <span className="font-bold">{t('home.language')}</span>
                  </div>
                  <div className="flex bg-white rounded-xl p-1 shadow-sm">
                    <button 
                      onClick={() => setLanguage('zh')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${language === 'zh' ? 'bg-[#007AFF] text-white' : 'text-[#8E8E93]'}`}
                    >
                      中文
                    </button>
                    <button 
                      onClick={() => setLanguage('en')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${language === 'en' ? 'bg-[#007AFF] text-white' : 'text-[#8E8E93]'}`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleLogout}
                  className="w-full bg-[#FF3B30]/5 text-[#FF3B30] p-4 rounded-2xl flex items-center gap-3 font-bold active:bg-[#FF3B30]/10 transition-colors"
                >
                  <ICONS.LogOut size={20} />
                  <span>{t('home.logout')}</span>
                </button>
              </div>

              <button 
                onClick={() => setShowSettings(false)}
                className="w-full mt-8 py-4 bg-[#F2F2F7] rounded-2xl font-bold active:scale-95 transition-all"
              >
                {t('common.cancel')}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;
