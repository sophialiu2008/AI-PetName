
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SectionHeader, Card, Button, Skeleton } from '../components/UI';
import { ICONS, COLORS } from '../constants';
import { NameSuggestion } from '../types';
import { geminiService } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext';

const NamingResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const results = location.state?.results as any[] || [];
  const originalFormData = location.state?.formData || {};
  
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavs = new Set(favorites);
    if (newFavs.has(id)) newFavs.delete(id);
    else newFavs.add(id);
    setFavorites(newFavs);
  };

  const handleAdjustStyle = () => {
    navigate('/naming/wizard', { 
      state: { 
        formData: originalFormData,
        startStep: 2
      } 
    });
  };

  return (
    <div className="px-5 pb-10 bg-white min-h-screen">
      <div className="pt-8 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:scale-90 transition-transform">
            <ICONS.Back size={24} className="text-[#007AFF]" />
          </button>
          <button onClick={() => navigate('/')} className="p-2 bg-[#F2F2F7] rounded-full text-[#8E8E93] active:scale-90 transition-transform">
            <ICONS.Home size={18} />
          </button>
        </div>
        <button onClick={handleAdjustStyle} className="text-[14px] font-bold text-[#007AFF]">
          {t('results.fineTune')}
        </button>
      </div>

      <div className="mb-6">
        <SectionHeader 
          title={t('results.title')} 
          subtitle={loading ? t('results.subLoading') : t('results.subReady').replace('{count}', results.length.toString())} 
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((res, index) => {
            const id = `res-${index}`;
            const isFav = favorites.has(id);
            const isExpanded = expanded === id;

            return (
              <Card key={id} className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'ring-2 ring-[#FF6B9D]/30 shadow-lg' : ''}`}>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl font-bold tracking-tight">{res.name}</h3>
                        {res.trends && (
                          <span className="bg-[#34C759]/10 text-[#34C759] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#34C759]/20 whitespace-nowrap">
                            {t('results.hotCheck')}
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#8E8E93] line-clamp-2 leading-relaxed">{res.meaning}</p>
                    </div>
                    <div className="flex flex-col gap-3 ml-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(id); }} 
                        className={`p-2 rounded-full transition-colors ${isFav ? 'bg-[#FF6B9D]/10 text-[#FF6B9D]' : 'text-[#C7C7CC] hover:bg-slate-50'}`}
                      >
                        <ICONS.Heart size={20} fill={isFav ? COLORS.primary : 'none'} />
                      </button>
                      <button 
                        onClick={() => setExpanded(isExpanded ? null : id)} 
                        className={`p-2 rounded-full transition-all ${isExpanded ? 'bg-[#F2F2F7] text-black' : 'text-[#C7C7CC]'}`}
                      >
                        <ICONS.ChevronRight size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-[#F2F2F7]">
                          <div className="flex items-center gap-1.5 mb-3">
                            <ICONS.Globe size={14} className="text-[#007AFF]" />
                            <h4 className="text-[11px] font-bold text-[#007AFF] uppercase tracking-wider">{t('results.analysis')}</h4>
                          </div>
                          <div className="bg-[#F2F2F7]/50 rounded-xl p-3.5 mb-5 border border-[#E5E5EA]/30">
                            <p className="text-[12.5px] text-black/80 leading-relaxed italic">
                              "{res.trends || 'This name is unique and holds a steady global trend.'}"
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2.5">
                            <motion.button 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={() => navigate('/certificate', { state: { name: res.name, meaning: res.meaning } })}
                              className="flex-[2] bg-black text-white py-3.5 rounded-xl text-xs font-bold shadow-md active:opacity-90 transition-shadow"
                            >
                              {t('results.certBtn')}
                            </motion.button>
                            
                            <motion.button 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={handleAdjustStyle}
                              className="flex-1 border border-[#007AFF]/20 bg-white text-black py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:bg-[#F2F2F7] shadow-sm relative group overflow-hidden"
                            >
                              <motion.div 
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 1 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#007AFF]/5 to-transparent -skew-x-12"
                              />
                              <ICONS.Chart size={15} className="text-[#007AFF] group-hover:rotate-12 transition-transform" />
                              <span className="relative z-10 text-[#007AFF]">{t('results.adjust')}</span>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button variant="outline" onClick={() => navigate('/')} className="w-full border-[#007AFF]/30 text-[#007AFF]">
            <ICONS.Home size={18} className="mr-2" /> {t('common.home')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NamingResults;
