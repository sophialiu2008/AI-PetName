
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, SectionHeader } from '../components/UI';
import { ICONS, COLORS } from '../constants';
import { geminiService } from '../services/geminiService';
import { useTranslation } from '../contexts/LanguageContext';

const ZODIACS = [
  { name: '白羊座', range: '03.21-04.19', icon: '♈️' },
  { name: '金牛座', range: '04.20-05.20', icon: '♉️' },
  { name: '双子座', range: '05.21-06.21', icon: '♊️' },
  { name: '巨蟹座', range: '06.22-07.22', icon: '♋️' },
  { name: '狮子座', range: '07.23-08.22', icon: '♌️' },
  { name: '处女座', range: '08.23-09.22', icon: '♍️' },
  { name: '天秤座', range: '09.23-10.23', icon: '♎️' },
  { name: '天蝎座', range: '10.24-11.22', icon: '♏️' },
  { name: '射手座', range: '11.23-12.21', icon: '♐️' },
  { name: '摩羯座', range: '12.22-01.19', icon: '♑️' },
  { name: '水瓶座', range: '01.20-02.18', icon: '♒️' },
  { name: '双鱼座', range: '02.19-03.20', icon: '♓️' },
];

const ELEMENTS = [
  { name: '金', color: 'bg-yellow-100 text-yellow-600', desc: '刚毅、果断', icon: '✨' },
  { name: '木', color: 'bg-green-100 text-green-600', desc: '仁慈、生长', icon: '🌿' },
  { name: '水', color: 'bg-blue-100 text-blue-600', desc: '聪明、灵动', icon: '💧' },
  { name: '火', color: 'bg-red-100 text-red-600', desc: '热烈、勇敢', icon: '🔥' },
  { name: '土', color: 'bg-amber-100 text-amber-900', desc: '稳重、忠诚', icon: '⛰️' },
];

const AstroNaming: React.FC = () => {
  const navigate = useNavigate();
  // Get current language context
  const { language } = useTranslation();
  const [selectedZodiac, setSelectedZodiac] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!selectedZodiac || !selectedElement) return;
    setLoading(true);
    try {
      // Fixed: Pass required language property to generateAstroNames
      const response = await geminiService.generateAstroNames({
        zodiac: selectedZodiac,
        element: selectedElement,
        language: language,
      });
      navigate('/naming/results', { 
        state: { 
          results: response.data, 
          formData: { zodiac: selectedZodiac, element: selectedElement, type: '星象起名' } 
        } 
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0F0C29] text-white overflow-hidden relative">
      {/* Background Star Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2, scale: 0.5 }}
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: Math.random() * 3 + 2, delay: Math.random() * 5 }}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
            }}
          />
        ))}
      </div>

      <div className="pt-12 px-5 pb-4 flex items-center justify-between relative z-10">
        <div className="flex gap-3 items-center">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:scale-90 transition-transform">
            <ICONS.Back size={24} />
          </button>
          <button onClick={() => navigate('/')} className="p-2 bg-white/10 rounded-full active:scale-90 transition-transform">
            <ICONS.Home size={18} />
          </button>
        </div>
        <h2 className="text-lg font-bold tracking-widest uppercase">星象起名</h2>
        <div className="w-10 h-10 flex items-center justify-center">
          <ICONS.Stars size={24} className="text-[#FFD700] animate-pulse" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32 no-scrollbar relative z-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-[#FFD700] to-[#FF9A8B] bg-clip-text text-transparent">观星觅名</h1>
          <p className="text-white/40 text-sm">连接星轨能量，为爱宠寻找宿命称呼</p>
        </div>

        {/* Section: Zodiac */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-[#FFD700] rounded-full" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#FFD700]">所属星座</h3>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {ZODIACS.map((z) => (
              <motion.button
                key={z.name}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedZodiac(z.name)}
                className={`flex flex-col items-center justify-center aspect-square rounded-2xl border transition-all ${
                  selectedZodiac === z.name 
                    ? 'bg-white/20 border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)]' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <span className="text-2xl mb-1">{z.icon}</span>
                <span className="text-[10px] font-bold">{z.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Section: Elements */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-[#5AC8FA] rounded-full" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#5AC8FA]">能量平衡</h3>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {ELEMENTS.map((e) => (
              <motion.button
                key={e.name}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedElement(e.name)}
                className={`flex flex-col items-center justify-center aspect-[3/4] rounded-2xl border transition-all ${
                  selectedElement === e.name 
                    ? 'bg-white/20 border-white/60 shadow-lg' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <span className="text-xl mb-1">{e.icon}</span>
                <span className="text-xs font-bold">{e.name}</span>
                <span className="text-[8px] opacity-40 mt-1 scale-90">{e.desc}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Bottom */}
      <div className="p-5 pb-10 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0F0C29] via-[#0F0C29] to-transparent pointer-events-none z-20">
        <div className="pointer-events-auto">
          <Button 
            onClick={handleGenerate} 
            disabled={!selectedZodiac || !selectedElement} 
            loading={loading}
            className="w-full h-[56px] text-lg bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] border-0 shadow-[0_0_20px_rgba(142,45,226,0.5)]"
          >
            {loading ? '星轨演算中...' : '开始星象解析'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AstroNaming;
