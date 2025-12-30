
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/UI';
import { ICONS, COLORS } from '../constants';

const STEPS = [
  {
    title: "寻找灵魂之名",
    desc: "名字是生命的第一份礼物，AI 为你的小伙伴寻找那个命中注定的称呼。",
    icon: <ICONS.Naming size={80} className="text-[#FF6B9D]" />,
    color: "bg-pink-50"
  },
  {
    title: "多维灵感触达",
    desc: "无论是通过相片捕捉气质，还是探索星象奥秘，总有一种方式能懂TA。",
    icon: <ICONS.Stars size={80} className="text-[#FFD700]" />,
    color: "bg-yellow-50"
  },
  {
    title: "社区温情共鸣",
    desc: "加入万千宠物主的命名故事，分享那份心动与喜悦。",
    icon: <ICONS.Community size={80} className="text-[#007AFF]" />,
    color: "bg-blue-50"
  }
];

const Onboarding: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (current < STEPS.length - 1) setCurrent(current + 1);
    else {
      localStorage.setItem('has_onboarded', 'true');
      navigate('/');
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[200] flex flex-col pt-safe px-8 pb-12">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className={`w-32 h-32 ${STEPS[current].color} rounded-[40px] flex items-center justify-center mb-10 transition-colors duration-500`}>
          {STEPS[current].icon}
        </div>
        <h1 className="text-3xl font-bold mb-4 tracking-tight">{STEPS[current].title}</h1>
        <p className="text-[#8E8E93] text-lg leading-relaxed px-4">{STEPS[current].desc}</p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="flex gap-2">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-[#FF6B9D]' : 'w-1.5 bg-[#E5E5EA]'}`} />
          ))}
        </div>
        <Button onClick={next} className="w-full">
          {current === STEPS.length - 1 ? '开启探索' : '继续'}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
