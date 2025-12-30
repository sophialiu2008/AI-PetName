
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SectionHeader, Card, Button, Skeleton } from '../components/UI';
import { ICONS, COLORS } from '../constants';
import { NameSuggestion } from '../types';
import { geminiService } from '../services/geminiService';
import { motion } from 'framer-motion';

const NamingResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
    // Navigate back to wizard with the current form data and skip to personality step
    navigate('/naming/wizard', { 
      state: { 
        formData: originalFormData,
        startStep: 2 // Jump to the personality traits step for quick tweaking
      } 
    });
  };

  return (
    <div className="px-5 pb-10">
      <div className="mt-8 mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)}>
          <ICONS.Back size={24} className="text-[#007AFF]" />
        </button>
        <SectionHeader title="建议名字" subtitle={loading ? "AI 正在联网查证流行度..." : `已为您精准匹配 ${results.length} 个灵感`} />
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
              <Card key={id} className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'ring-2 ring-[#FF6B9D]/30' : ''}`}>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl font-bold">{res.name}</h3>
                        {res.trends && (
                          <span className="bg-[#34C759]/10 text-[#34C759] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            热门查证
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#8E8E93] line-clamp-2">{res.meaning}</p>
                    </div>
                    <div className="flex flex-col gap-3 ml-4">
                      <button onClick={() => toggleFavorite(id)} className={`p-2 rounded-full ${isFav ? 'text-[#FF6B9D]' : 'text-[#C7C7CC]'}`}>
                        <ICONS.Heart size={20} fill={isFav ? COLORS.primary : 'none'} />
                      </button>
                      <button onClick={() => setExpanded(isExpanded ? null : id)} className={`p-2 rounded-full ${isExpanded ? 'bg-[#F2F2F7]' : ''}`}>
                        <ICONS.ChevronRight size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[#F2F2F7] animate-fadeIn">
                      <div className="flex items-center gap-1 mb-3">
                        <ICONS.Globe size={14} className="text-[#007AFF]" />
                        <h4 className="text-xs font-bold text-[#007AFF] uppercase tracking-wider">全网实时分析</h4>
                      </div>
                      <div className="bg-[#F2F2F7]/50 rounded-xl p-3 mb-4">
                        <p className="text-[12px] text-black/80 leading-relaxed italic">
                          "{res.trends || '该名字极具独特性，目前在全球范围内呈现稳健的流行趋势。'}"
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <motion.button 
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/certificate', { state: { name: res.name, meaning: res.meaning } })}
                          className="flex-[2] bg-black text-white py-3 rounded-xl text-xs font-bold shadow-lg active:opacity-90"
                        >
                          选用并生成证书
                        </motion.button>
                        <motion.button 
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAdjustStyle}
                          className="flex-1 border border-[#E5E5EA] bg-white text-black py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:bg-[#F2F2F7]"
                        >
                          <ICONS.Chart size={14} />
                          调整风格
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-10">
        <Button variant="outline" onClick={handleAdjustStyle} className="w-full">
          重新调整偏好
        </Button>
      </div>
    </div>
  );
};

export default NamingResults;
