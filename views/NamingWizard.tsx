
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, SectionHeader } from '../components/UI';
import { ICONS, COLORS } from '../constants';
import { geminiService } from '../services/geminiService';
import { useTranslation } from '../contexts/LanguageContext';

const NamingWizard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useTranslation();

  const OPTIONS = {
    types: language === 'zh' 
      ? ['小狗', '小猫', '小鸟', '兔兔', '仓鼠', '其他']
      : ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Other'],
    genders: language === 'zh'
      ? ['男孩子', '女孩子', '不确定']
      : ['Boy', 'Girl', 'Not sure'],
    personalities: language === 'zh'
      ? ['调皮活泼', '温柔粘人', '高冷傲娇', '憨态可掬', '聪明伶俐', '贪吃懒做', '安静乖巧', '充满好奇']
      : ['Playful', 'Sweet', 'Cavalier', 'Cuddly', 'Smart', 'Greedy', 'Quiet', 'Curious']
  };
  
  const [formData, setFormData] = useState<Record<string, any>>({
    type: '',
    gender: '',
    personality: [],
    ...location.state?.formData
  });
  
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const togglePersonality = (option: string) => {
    const current = formData.personality || [];
    const updated = current.includes(option) 
      ? current.filter((o: string) => o !== option)
      : [...current, option];
    setFormData({ ...formData, personality: updated });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          await handleVoiceIntent(base64Audio);
        };
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessingVoice(true);
    }
  };

  const handleVoiceIntent = async (base64Audio: string) => {
    try {
      const intent = await geminiService.extractIntentFromAudio(base64Audio, 'audio/webm', {
        type: OPTIONS.types,
        gender: OPTIONS.genders,
        personality: OPTIONS.personalities
      });
      
      setFormData(prev => ({
        ...prev,
        type: intent.petType || prev.type,
        gender: intent.gender || prev.gender,
        personality: intent.personality?.length ? [...new Set([...prev.personality, ...intent.personality])] : prev.personality
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await geminiService.generateNamesWithGrounding({
        petType: formData.type,
        personality: formData.personality || [],
        language: language
      });
      navigate('/naming/results', { state: { results: response.data, formData } });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isComplete = formData.type && formData.gender;

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      {/* Fixed Header */}
      <div className="pt-12 px-5 pb-4 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-[#F2F2F7]">
        <div className="flex gap-3 items-center">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:scale-90 transition-transform">
            <ICONS.Back size={24} className="text-[#007AFF]" />
          </button>
          <button onClick={() => navigate('/')} className="p-2 bg-[#F2F2F7] rounded-full text-[#8E8E93] active:scale-90 transition-transform">
            <ICONS.Home size={18} />
          </button>
        </div>
        <h2 className="text-lg font-bold">{t('wizard.title')}</h2>
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-2.5 rounded-full transition-all ${
            isRecording ? 'bg-[#FF3B30] text-white animate-pulse' : 'bg-[#FF6B9D]/10 text-[#FF6B9D]'
          }`}
        >
          {isRecording ? <ICONS.Close size={20} /> : <ICONS.Mic size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32 no-scrollbar relative z-10">
        <SectionHeader 
          title={t('wizard.header')} 
          subtitle={t('wizard.subHeader')} 
        />

        {/* Section: Type */}
        <div className="mt-8">
          <label className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider ml-1 mb-3 block">{t('wizard.petType')}</label>
          <div className="grid grid-cols-3 gap-3">
            {OPTIONS.types.map(t => (
              <motion.button
                key={t}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({...formData, type: t})}
                className={`py-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                  formData.type === t ? 'border-[#FF6B9D] bg-[#FF6B9D]/5 text-[#FF6B9D]' : 'border-[#F2F2F7] text-black'
                }`}
              >
                {t}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Section: Gender */}
        <div className="mt-10">
          <label className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider ml-1 mb-3 block">{t('wizard.gender')}</label>
          <div className="bg-[#F2F2F7] p-1 rounded-2xl flex">
            {OPTIONS.genders.map(g => (
              <button
                key={g}
                onClick={() => setFormData({...formData, gender: g})}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                  formData.gender === g ? 'bg-white shadow-sm text-black' : 'text-[#8E8E93]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Section: Personality */}
        <div className="mt-10">
          <label className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider ml-1 mb-3 block">{t('wizard.personality')}</label>
          <div className="flex flex-wrap gap-2.5">
            {OPTIONS.personalities.map(p => {
              const selected = formData.personality.includes(p);
              return (
                <motion.button
                  key={p}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => togglePersonality(p)}
                  className={`px-5 py-3 rounded-full border-2 text-sm font-bold transition-all ${
                    selected ? 'border-[#FF6B9D] bg-[#FF6B9D] text-white' : 'border-[#F2F2F7] bg-white text-black'
                  }`}
                >
                  {p}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Action Bottom */}
      <div className="p-5 pb-10 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pointer-events-none z-20">
        <div className="pointer-events-auto">
          <Button 
            onClick={handleSubmit} 
            disabled={!isComplete} 
            loading={loading}
            className="w-full h-[56px] text-lg shadow-xl"
          >
            {loading ? t('wizard.btnLoading') : t('wizard.btnActive')}
          </Button>
        </div>
      </div>

      {/* Voice Overlay */}
      <AnimatePresence>
        {(isRecording || isProcessingVoice) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end justify-center p-5 pb-20"
          >
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="w-full bg-white rounded-[40px] p-8 shadow-2xl flex flex-col items-center"
            >
              {isRecording ? (
                <>
                  <div className="flex gap-1.5 items-end h-10 mb-6">
                    {[1,2,3,4,5,6,5,4,3,2,1].map((h, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: [12, 36, 12] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.05 }}
                        className="w-1.5 bg-[#FF6B9D] rounded-full"
                      />
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t('wizard.listening')}</h3>
                  <p className="text-sm text-[#8E8E93] mb-8">{t('wizard.listeningSub')}</p>
                  <button 
                    onClick={stopRecording}
                    className="w-20 h-20 bg-[#FF3B30] rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
                  >
                    <ICONS.Close size={32} />
                  </button>
                </>
              ) : (
                <div className="py-10 flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-[#FF6B9D]/20 border-t-[#FF6B9D] rounded-full animate-spin mb-4" />
                  <p className="font-bold">{t('wizard.processing')}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NamingWizard;
