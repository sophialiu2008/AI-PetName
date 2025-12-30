
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionHeader, Card } from '../components/UI';
import { ICONS, COLORS } from '../constants';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const paths = [
    {
      id: 'live',
      title: 'AI 语音专家',
      subtitle: '开启实时通话，寻找灵感',
      icon: <ICONS.Mic size={32} className="text-white" />,
      color: 'bg-gradient-to-br from-[#007AFF] to-[#5AC8FA]',
      route: '/naming/live'
    },
    {
      id: 'text',
      title: '向导起名',
      subtitle: '描述你的宠物，AI精准定制',
      icon: <ICONS.Text size={32} className="text-white" />,
      color: 'bg-gradient-to-br from-[#FF6B9D] to-[#FF9A8B]',
      route: '/naming/wizard'
    },
    {
      id: 'vision',
      title: '灵眸起名',
      subtitle: '上传照片，捕捉气质灵感',
      icon: <ICONS.Camera size={32} className="text-white" />,
      color: 'bg-gradient-to-br from-[#A1C4FD] to-[#C2E9FB]',
      route: '/naming/lens'
    }
  ];

  return (
    <div className="pb-8">
      {/* Mock Search Bar */}
      <div className="px-5 pt-4 mb-6">
        <div className="bg-[#F2F2F7] h-10 rounded-xl flex items-center px-3 gap-2 text-[#8E8E93]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span className="text-[15px]">搜索你喜欢的宠物名...</span>
        </div>
      </div>

      <div className="mb-6">
        <SectionHeader title="发现灵感" subtitle="为你的小伙伴，找到灵魂之名" />
      </div>

      <div className="px-5 overflow-x-auto flex gap-4 no-scrollbar pb-4">
        {paths.map((path) => (
          <Card 
            key={path.id}
            onClick={() => navigate(path.route)}
            className="flex-shrink-0 w-[280px] h-[180px] relative p-6 flex flex-col justify-end group border-0"
          >
            <div className={`absolute inset-0 ${path.color} opacity-90 transition-transform group-active:scale-105`} />
            <div className="absolute top-6 left-6 p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              {path.icon}
            </div>
            <div className="relative z-10 text-white">
              <h3 className="text-xl font-bold">{path.title}</h3>
              <p className="text-sm opacity-90">{path.subtitle}</p>
            </div>
            <div className="absolute top-4 right-4 bg-white/30 px-2 py-0.5 rounded-full text-[10px] text-white font-bold backdrop-blur-md">
              {path.id === 'live' ? 'HOT' : 'NEW'}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <SectionHeader title="热门榜单" actionLabel="全部" />
        <div className="px-5 space-y-3">
          {[
            { name: '糯米', type: '猫咪', count: '2.4w人使用', rank: 1 },
            { name: '奥利奥', type: '狗狗', count: '1.8w人使用', rank: 2 },
            { name: '可乐', type: '通用', count: '1.5w人使用', rank: 3 },
          ].map((item) => (
            <Card key={item.name} className="p-4 flex items-center gap-4 active:bg-[#F2F2F7] border-0 bg-slate-50/50">
              <span className={`text-2xl font-black w-8 ${item.rank === 1 ? 'text-[#FFD700]' : 'text-[#C7C7CC]'}`}>
                {item.rank}
              </span>
              <div className="flex-1">
                <h4 className="font-bold text-lg">{item.name}</h4>
                <p className="text-sm text-[#8E8E93]">{item.type} · {item.count}</p>
              </div>
              <ICONS.ChevronRight size={20} className="text-[#C7C7CC]" />
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10 px-5">
        <Card className="bg-gradient-to-r from-[#FF6B9D] to-[#FFD700] p-7 text-white text-center border-0 shadow-xl">
          <h3 className="text-2xl font-bold mb-2">生成出生证明</h3>
          <p className="text-sm mb-6 opacity-90 leading-relaxed">为心爱的宠物留下第一份正式记录，<br/>永久珍藏那份命名的喜悦。</p>
          <button 
            onClick={() => navigate('/certificate')}
            className="bg-white text-[#FF6B9D] px-8 py-3 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-transform"
          >
            立即生成
          </button>
        </Card>
      </div>
    </div>
  );
};

export default Home;
