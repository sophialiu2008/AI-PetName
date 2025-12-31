
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/UI';
import { ICONS, COLORS } from '../constants';

const BirthCertificate: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, meaning } = location.state || { name: '糯米', meaning: '温润如玉，纯净无暇' };
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert('证书已成功保存至您的系统相册');
    }, 1500);
  };

  return (
    <div className="px-5 pb-10 bg-[#FAFAFA] min-h-screen">
      <div className="pt-12 mb-10">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white shadow-sm rounded-full active:scale-90 transition-transform">
            <ICONS.Back size={20} className="text-black" />
          </button>
          <button onClick={() => navigate('/')} className="p-2.5 bg-white shadow-sm rounded-full text-[#8E8E93] active:scale-90 transition-transform">
            <ICONS.Home size={20} />
          </button>
        </div>
        <h1 className="brand-font text-4xl font-bold tracking-widest text-black mb-2">Soul ID</h1>
        <p className="slogan-font text-[11px] text-black/40 uppercase tracking-[0.4em]">“名字 是爱的第一份礼物”</p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-[#FF6B9D]/10 to-[#FFD700]/10 rounded-[40px] blur-2xl opacity-50" />
        <Card className="relative bg-white border-0 p-10 flex flex-col items-center text-center shadow-[0_30px_60px_rgba(0,0,0,0.08)] rounded-[40px] overflow-hidden">
          {/* Subtle Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black opacity-[0.02] brand-font select-none pointer-events-none rotate-[-15deg]">
            PETSOUL
          </div>
          
          <div className="w-24 h-24 bg-gradient-to-br from-[#FF6B9D] to-[#FF9A8B] rounded-full flex items-center justify-center text-white mb-8 shadow-[0_15px_30px_rgba(255,107,157,0.25)] relative z-10">
            <ICONS.MyPet size={48} />
          </div>
          
          <div className="sf-mono text-[10px] text-black/30 tracking-[0.4em] mb-4 uppercase relative z-10 font-bold border-b border-black/5 pb-2 px-4">
            Petsoul 官方命名档案
          </div>
          
          <h2 className="brand-font text-6xl font-bold mb-6 tracking-[0.05em] text-black relative z-10">{name}</h2>
          
          <div className="flex items-center gap-4 mb-8 opacity-20 relative z-10">
            <div className="w-8 h-[1px] bg-black"></div>
            <div className="w-2 h-2 rounded-full bg-black"></div>
            <div className="w-8 h-[1px] bg-black"></div>
          </div>
          
          <p className="slogan-font text-[16px] text-black/80 leading-[2] mb-12 px-6 relative z-10 italic">
            “{meaning}”
          </p>

          <div className="w-full pt-10 border-t border-gray-50 flex justify-between items-end relative z-10 mt-4">
            <div className="text-left">
              <p className="text-[10px] text-black/40 sf-mono font-bold tracking-widest mb-1">
                编号. {Math.floor(Math.random()*1000000).toString().padStart(8, '0')}
              </p>
              <p className="brand-font text-[9px] text-black/60 uppercase tracking-[0.2em] font-black">
                Petsoul AI Studio • 灵感实验室
              </p>
            </div>
            <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-inner group">
               <div className="text-[8px] text-black/10 font-black text-center leading-none tracking-tighter transition-opacity group-hover:opacity-100 uppercase">
                P E T<br/>S O U L<br/>2 0 2 5
               </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-14 space-y-4">
        <Button onClick={handleDownload} loading={isDownloading} className="w-full h-[68px] text-[16px] font-bold tracking-[0.3em] shadow-xl rounded-2xl bg-black text-white border-0">
          <ICONS.Download size={20} className="mr-3" /> 保存至相册
        </Button>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => navigate('/community')} className="w-full h-[60px] border-black/5 bg-white text-black font-bold tracking-wider rounded-2xl shadow-sm">
            <ICONS.Share size={20} className="mr-2 opacity-40" /> 分享灵感
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} className="w-full h-[60px] border-black/5 bg-white text-black font-bold tracking-wider rounded-2xl shadow-sm">
            <ICONS.Home size={20} className="mr-2 opacity-40" /> 返回首页
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BirthCertificate;
