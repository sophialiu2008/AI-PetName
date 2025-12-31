
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, SectionHeader } from '../components/UI';
import { ICONS, COLORS } from '../constants';
import { geminiService } from '../services/geminiService';
import { useTranslation } from '../contexts/LanguageContext';

const NamingLens: React.FC = () => {
  const navigate = useNavigate();
  // Get current language context
  const { language } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setAnalyzing(true);
    try {
      // Fixed: Pass language argument as required by analyzePetImage
      const data = await geminiService.analyzePetImage(image, language);
      setAnalysis(data);
      
      const formData = {
        type: data.species,
        personality: data.traits || []
      };

      setTimeout(() => {
        navigate('/naming/wizard', { state: { formData } });
      }, 1500);
    } catch (e) {
      console.error(e);
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-white overflow-hidden relative">
      <div className="p-5 pt-12 flex items-center justify-between z-20 relative">
        <button onClick={() => navigate(-1)} className="p-2 active:scale-90 transition-transform">
          <ICONS.Back size={24} />
        </button>
        <h2 className="text-lg font-bold tracking-tight">灵眸起名</h2>
        <button onClick={() => navigate('/')} className="p-2 bg-white/10 rounded-full active:scale-90 transition-transform">
          <ICONS.Home size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-10 relative z-10">
        {/* Decorative Light Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#007AFF]/10 rounded-full blur-[80px]" />

        <div className="w-full aspect-square rounded-[40px] border-2 border-dashed border-white/20 flex flex-col items-center justify-center relative overflow-hidden group bg-white/[0.02]">
          {image ? (
            <img src={image} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <div className="text-center group-active:scale-95 transition-transform cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <ICONS.Camera size={32} className="opacity-80" />
              </div>
              <p className="text-sm opacity-50 font-medium">点击上传宠物照片</p>
            </div>
          )}
          
          {analyzing && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 z-30">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
              <p className="font-bold animate-pulse text-[17px]">AI正在解读宠物气质...</p>
              {analysis && <p className="text-xs opacity-60 mt-2 font-medium tracking-wide">识别到：{analysis.species} · {analysis.breed}</p>}
            </div>
          )}
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />

        {!analyzing && (
          <div className="mt-12 space-y-4 w-full relative z-10">
            <Button 
              onClick={startAnalysis} 
              disabled={!image}
              className="w-full bg-[#007AFF] text-white border-0 shadow-lg shadow-[#007AFF]/20 h-[56px] text-lg font-bold"
            >
              开始气质分析
            </Button>
            <p className="text-[11px] text-white/40 text-center px-8 leading-tight font-medium">
              建议拍摄宠物的正面或其最显着特征部位，以获得最精准的AI性格推测。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NamingLens;
