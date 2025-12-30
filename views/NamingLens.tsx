
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, SectionHeader } from '../components/UI';
import { ICONS, COLORS } from '../constants';
import { geminiService } from '../services/geminiService';

const NamingLens: React.FC = () => {
  const navigate = useNavigate();
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
      const data = await geminiService.analyzePetImage(image);
      setAnalysis(data);
      
      // Map analysis to wizard form data
      const formData = {
        type: data.species,
        personality: data.traits || []
      };

      // Simulate "thinking" for better UX, then navigate to Wizard
      setTimeout(() => {
        navigate('/naming/wizard', { state: { formData } });
      }, 1500);
    } catch (e) {
      console.error(e);
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="p-5 pt-12 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2">
          <ICONS.Back size={24} />
        </button>
        <h2 className="text-lg font-bold">灵眸起名</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-10">
        <div className="w-full aspect-square rounded-full border-2 border-dashed border-white/30 flex flex-col items-center justify-center relative overflow-hidden group">
          {image ? (
            <img src={image} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <div className="text-center group-active:scale-95 transition-transform" onClick={() => fileInputRef.current?.click()}>
              <ICONS.Camera size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm opacity-50">点击上传宠物照片</p>
            </div>
          )}
          
          {analyzing && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
              <p className="font-medium animate-pulse">AI正在解读宠物气质...</p>
              {analysis && <p className="text-xs opacity-60 mt-2">已识别：{analysis.species} · {analysis.breed}</p>}
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
          <div className="mt-12 space-y-4 w-full">
            <Button 
              onClick={startAnalysis} 
              disabled={!image}
              className="w-full"
            >
              开始分析
            </Button>
            <p className="text-[11px] text-white/50 text-center px-6 leading-tight">
              建议拍摄宠物的正面或其最显着特征部位，以获得最精准的AI性格推测。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NamingLens;
