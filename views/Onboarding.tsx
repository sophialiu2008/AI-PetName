
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/UI';
import { ICONS } from '../constants';

const FEATURES = [
  {
    title: "AI 灵魂命名",
    desc: "捕捉生命情感波动，寻找契合称呼。",
    icon: <ICONS.Naming size={18} className="text-[#FF6B9D]" />,
    accent: "bg-[#FF6B9D]/5"
  },
  {
    title: "灵感引擎",
    desc: "照片分析与星象推导，探索隐秘魅力。",
    icon: <ICONS.Stars size={18} className="text-[#5856D6]" />,
    accent: "bg-[#5856D6]/5"
  },
  {
    title: "心动时刻",
    desc: "生成出生证明，分享名字温度。",
    icon: <ICONS.Community size={18} className="text-[#007AFF]" />,
    accent: "bg-[#007AFF]/5"
  }
];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    localStorage.setItem('has_onboarded', 'true');
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-white z-[200] flex flex-col pt-safe px-8 pb-12 overflow-hidden">
      
      {/* 1. 品牌中心区 - 视觉黄金点 */}
      <div className="flex-1 flex flex-col items-center justify-center translate-y-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6B9D] to-[#FFD700] blur-[80px] opacity-[0.12] scale-[2.5]" />
          
          <div className="w-24 h-24 bg-gradient-to-br from-[#1A1A1A] to-[#333333] rounded-[28px] flex items-center justify-center relative shadow-[0_40px_80px_rgba(0,0,0,0.12)] border border-white/10 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <ICONS.MyPet size={52} className="text-white drop-shadow-md" />
          </div>
        </motion.div>
        
        <div className="text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="brand-font text-[68px] leading-none text-black mb-10 text-glow"
          >
            Petsoul
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1.2 }}
            className="flex flex-col items-center"
          >
            <div className="h-[0.5px] w-20 bg-black/10 mb-6" />
            <p className="slogan-font text-[11px] text-black/50 uppercase text-center leading-loose tracking-[0.6em]">
              名字 是爱的第一份礼物
            </p>
          </motion.div>
        </div>
      </div>

      {/* 2. 压缩功能区 - 保持简洁 */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="grid grid-cols-1 gap-4 mb-14 max-w-xs mx-auto w-full"
      >
        {FEATURES.map((f, i) => (
          <div key={i} className="flex items-center gap-4 py-2.5 border-b border-black/[0.03] last:border-0">
            <div className={`w-9 h-9 rounded-xl ${f.accent} flex items-center justify-center shrink-0`}>
              {f.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-[14px] font-bold text-black/80 tracking-tight">{f.title}</h3>
              <p className="text-[11px] text-black/30 truncate">{f.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* 3. 操作与背书区 */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="w-full max-w-xs mx-auto flex flex-col items-center"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <img 
                key={i} 
                src={`https://picsum.photos/seed/vip${i}/100/100`} 
                className="w-6 h-6 rounded-full border border-white shadow-sm ring-1 ring-black/5" 
                alt="User"
              />
            ))}
          </div>
          <span className="text-[10px] text-black/30 font-bold tracking-[0.1em] uppercase">全球 24,000+ 宠主的灵感之选</span>
        </div>

        <Button 
          onClick={handleStart} 
          className="w-full h-[64px] bg-black text-white text-[15px] font-bold tracking-[0.4em] uppercase border-0 rounded-2xl shadow-2xl active:scale-[0.98] transition-all hover:shadow-black/10"
        >
          开启灵感之旅
        </Button>
        
        <div className="mt-8 text-center space-y-1">
          <p className="text-[10px] text-black/20 uppercase tracking-[0.2em] font-medium leading-relaxed">
            在此，开启灵魂的契约
          </p>
          <p className="text-[9px] text-black/30 font-bold uppercase tracking-[0.15em]">
            隐私护航 • AI 赋能 • 艺术底蕴
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
