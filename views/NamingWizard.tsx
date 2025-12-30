
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar, Button, SectionHeader } from '../components/UI';
import { ICONS, COLORS } from '../constants';
import { geminiService } from '../services/geminiService';

const STEPS = [
  {
    id: 'type',
    title: '你的宠物是？',
    options: ['小狗', '小猫', '小鸟', '兔兔', '仓鼠', '其他']
  },
  {
    id: 'gender',
    title: '它的性别？',
    options: ['男孩子', '女孩子', '不确定']
  },
  {
    id: 'personality',
    title: '它的性格特点？',
    multi: true,
    options: ['调皮活泼', '温柔粘人', '高冷傲娇', '憨态可掬', '聪明伶俐', '贪吃懒做']
  }
];

const NamingWizard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Start from a specific step if coming back to "tweak"
  const [step, setStep] = useState(location.state?.startStep ?? 0);
  
  // Initialize with passed state if coming back from results
  const [formData, setFormData] = useState<Record<string, any>>(location.state?.formData || {});
  const [loading, setLoading] = useState(false);
  
  // Voice Input State
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Update form data if location state changes (for direct lens-to-wizard fills)
  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData);
    }
    if (location.state?.startStep !== undefined) {
      setStep(location.state.startStep);
    }
  }, [location.state]);

  const currentStep = STEPS[step];
  const progress = ((step + 1) / (STEPS.length + 1)) * 100;

  const handleSelect = (option: string) => {
    if (currentStep.multi) {
      const current = formData[currentStep.id] || [];
      const updated = current.includes(option) 
        ? current.filter((o: string) => o !== option)
        : [...current, option];
      setFormData({ ...formData, [currentStep.id]: updated });
    } else {
      setFormData({ ...formData, [currentStep.id]: option });
    }
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
      console.error('Error accessing microphone:', err);
      alert('请允许麦克风访问权限以使用语音输入');
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
      const options = {
        type: STEPS[0].options,
        gender: STEPS[1].options,
        personality: STEPS[2].options
      };
      
      const intent = await geminiService.extractIntentFromAudio(base64Audio, 'audio/webm', options);
      
      const newFormData = { ...formData };
      let anyUpdate = false;

      if (intent.petType) {
        newFormData.type = intent.petType;
        anyUpdate = true;
      }
      if (intent.gender) {
        newFormData.gender = intent.gender;
        anyUpdate = true;
      }
      if (intent.personality && intent.personality.length > 0) {
        newFormData.personality = intent.personality;
        anyUpdate = true;
      }

      if (anyUpdate) {
        setFormData(newFormData);
      }
    } catch (error) {
      console.error('Voice intent error:', error);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        const response = await geminiService.generateNamesWithGrounding({
          petType: formData.type,
          personality: formData.personality || [],
        });
        // Pass both results and formData to enable "Adjust Style" later
        navigate('/naming/results', { state: { results: response.data, formData } });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ProgressBar progress={progress} />
      
      <div className="pt-12 px-5 flex-1 relative">
        <div className="flex justify-between items-start mb-8">
          <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}>
            <ICONS.Back size={24} className="text-[#007AFF]" />
          </button>
          
          {/* Voice Input Trigger */}
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-3 rounded-full transition-all duration-300 ${
              isRecording ? 'bg-[#FF3B30] animate-pulse text-white' : 'bg-[#F2F2F7] text-[#FF6B9D]'
            }`}
          >
            {isRecording ? <ICONS.Close size={20} /> : <ICONS.Mic size={20} />}
          </button>
        </div>

        <SectionHeader 
          title={currentStep.title} 
          subtitle={isProcessingVoice ? "AI 正在智能识别您的描述..." : "手动点击或点击上方麦克风语音输入"} 
        />

        <div className="mt-8 grid grid-cols-2 gap-4">
          {currentStep.options.map((option) => {
            const isSelected = currentStep.multi 
              ? formData[currentStep.id]?.includes(option)
              : formData[currentStep.id] === option;

            return (
              <motion.div
                key={option}
                onClick={() => handleSelect(option)}
                whileTap={{ scale: 0.95 }}
                className={`h-[120px] rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-300 relative overflow-hidden ${
                  isSelected 
                  ? `border-[${COLORS.primary}] bg-[#FF6B9D]/10 text-[#FF6B9D]` 
                  : 'border-[#F2F2F7] bg-white text-[#8E8E93]'
                }`}
                style={isSelected ? { borderColor: COLORS.primary } : {}}
              >
                {isSelected && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-2 right-2"
                  >
                    <ICONS.Stars size={12} className="text-[#FF6B9D]" />
                  </motion.div>
                )}
                <span className={`text-lg font-bold ${isSelected ? 'scale-110' : ''} transition-transform`}>
                  {option}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Voice Overlay UI */}
        <AnimatePresence>
          {(isRecording || isProcessingVoice) && (
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute bottom-10 left-5 right-5 z-[100] bg-white/80 ios-blur p-6 rounded-[32px] shadow-2xl border border-[#F2F2F7] flex flex-col items-center"
            >
              {isRecording ? (
                <>
                  <div className="flex gap-1 items-end h-8 mb-4">
                    {[1,2,3,4,5,4,3,2,1].map((h, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: [10, 25, 10] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                        className="w-1 bg-[#FF6B9D] rounded-full"
                      />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-black">正在倾听...</p>
                  <p className="text-[11px] text-[#8E8E93] mt-1">您可以说：“我的猫很调皮”</p>
                  <Button onClick={stopRecording} variant="ghost" className="mt-4 text-[#FF3B30]">停止并识别</Button>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 border-4 border-[#FF6B9D]/20 border-t-[#FF6B9D] rounded-full animate-spin mb-4" />
                  <p className="text-sm font-bold text-black">AI 正在为您匹配选项...</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-5 pb-10">
        <Button 
          onClick={handleNext} 
          disabled={!formData[currentStep.id]} 
          loading={loading}
          className="w-full"
        >
          {step === STEPS.length - 1 ? '查看灵感' : '下一步'}
        </Button>
      </div>
    </div>
  );
};

export default NamingWizard;
