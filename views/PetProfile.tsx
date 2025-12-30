
import React, { useState } from 'react';
import { SectionHeader, Card, Button } from '../components/UI';
import { ICONS, COLORS } from '../constants';

const PetProfile: React.FC = () => {
  const [tab, setTab] = useState<'info' | 'photos' | 'health'>('info');

  return (
    <div className="bg-white">
      <div className="relative h-[240px] w-full">
        <img src="https://picsum.photos/seed/paw/800/400" className="w-full h-full object-cover rounded-b-[40px]" alt="Cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
          <h1 className="text-4xl font-bold">糯米</h1>
          <p className="opacity-90">英国短毛猫 · 2岁</p>
        </div>
      </div>

      <div className="mt-6 px-5">
        <div className="flex bg-[#F2F2F7] p-1 rounded-xl mb-8">
          {(['info', 'photos', 'health'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                tab === t ? 'bg-white shadow-sm text-black' : 'text-[#8E8E93]'
              }`}
            >
              {t === 'info' ? '基本信息' : t === 'photos' ? '照片墙' : '健康管家'}
            </button>
          ))}
        </div>

        {tab === 'info' && (
          <div className="space-y-6">
            <div className="space-y-4">
              {[
                { label: '名字', value: '糯米 (Nomi)' },
                { label: '品种', value: '英国短毛猫' },
                { label: '性格', value: '温柔、粘人、有点社恐' },
                { label: 'PetID', value: 'PAW-2024-8891' },
              ].map((item) => (
                <div key={item.label} className="border-b border-[#F2F2F7] pb-3 flex justify-between items-center">
                  <span className="text-sm text-[#8E8E93]">{item.label}</span>
                  <span className="text-lg font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">编辑信息</Button>
          </div>
        )}

        {tab === 'photos' && (
          <div className="grid grid-cols-3 gap-2">
            {[1,2,3,4,5].map(i => (
              <img key={i} src={`https://picsum.photos/seed/${i}/300/300`} className="w-full aspect-square object-cover rounded-xl" alt="Pet" />
            ))}
            <div className="w-full aspect-square border-2 border-dashed border-[#F2F2F7] rounded-xl flex items-center justify-center text-[#8E8E93]">
              <ICONS.Plus size={32} />
            </div>
          </div>
        )}

        {tab === 'health' && (
          <div className="space-y-4">
            <Card className="p-4 flex items-center gap-4">
              <div className="w-1.5 h-12 bg-[#FF3B30] rounded-full" />
              <div className="flex-1">
                <h4 className="font-bold">打疫苗 (狂犬疫苗)</h4>
                <p className="text-xs text-[#8E8E93]">明天 10:00 AM · 宠物医院</p>
              </div>
              <Button variant="ghost" className="px-0">提醒我</Button>
            </Card>
            <Card className="p-4 flex items-center gap-4 opacity-50">
              <div className="w-1.5 h-12 bg-[#34C759] rounded-full" />
              <div className="flex-1">
                <h4 className="font-bold line-through">驱虫 (体内+体外)</h4>
                <p className="text-xs text-[#8E8E93]">已于上周二完成</p>
              </div>
              <div className="p-1 bg-[#34C759] text-white rounded-full">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            </Card>
            <Button className="w-full mt-4">
              <ICONS.Plus size={20} className="mr-2" /> 新增健康提醒
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetProfile;
