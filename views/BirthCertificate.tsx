
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
      alert('已模拟保存至系统相册');
    }, 1500);
  };

  return (
    <div className="px-5 pb-10">
      <div className="mt-8 mb-8">
        <button onClick={() => navigate(-1)} className="mb-6">
          <ICONS.Back size={24} className="text-[#007AFF]" />
        </button>
        <h1 className="text-3xl font-bold">宠物灵魂 ID</h1>
        <p className="text-[#8E8E93]">这是一份属于 TA 的独一无二的礼物</p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-2 bg-gradient-to-r from-[#FF6B9D] to-[#FFD700] rounded-[32px] blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
        <Card className="relative bg-gradient-to-br from-white via-white to-[#F2F2F7] border-0 p-8 flex flex-col items-center text-center shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B9D] to-[#FF9A8B] rounded-full flex items-center justify-center text-white mb-6 shadow-lg">
            <ICONS.MyPet size={40} />
          </div>
          
          <div className="sf-mono text-[10px] text-[#8E8E93] tracking-[0.2em] mb-2 uppercase">Official Birth Certificate</div>
          <h2 className="text-4xl font-bold mb-4 tracking-tight">{name}</h2>
          <div className="w-12 h-1 bg-[#FF6B9D] rounded-full mb-6 opacity-30" />
          
          <p className="text-[#8E8E93] text-sm leading-relaxed mb-10 px-4">
            “{meaning}”
          </p>

          <div className="w-full pt-8 border-t border-[#F2F2F7] flex justify-between items-end">
            <div className="text-left">
              <p className="text-[10px] text-[#8E8E93] sf-mono">ID: PAW-2025-{Math.floor(Math.random()*9000)+1000}</p>
              <p className="text-[10px] text-[#8E8E93]">ISSUED BY PAWNAMES AI</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 border border-[#E5E5EA] rounded-lg flex items-center justify-center">
              <div className="text-[6px] text-[#C7C7CC] text-center leading-tight">PET<br/>QR</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-12 space-y-4">
        <Button onClick={handleDownload} loading={isDownloading} className="w-full">
          <ICONS.Download size={20} className="mr-2" /> 保存到相册
        </Button>
        <Button variant="outline" onClick={() => navigate('/community')} className="w-full">
          <ICONS.Share size={20} className="mr-2" /> 分享到社区
        </Button>
      </div>
    </div>
  );
};

export default BirthCertificate;
