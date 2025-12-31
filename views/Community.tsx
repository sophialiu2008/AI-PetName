
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/UI';
import { ICONS, COLORS } from '../constants';

const FILTERS = ['故事墙', 'PK投票', '挑战榜'];

const MOCK_POSTS = [
  {
    id: 'p1',
    type: '故事墙',
    userName: '糯米麻麻',
    userAvatar: 'https://picsum.photos/seed/u1/100/100',
    title: '给家里新来的小银渐层取名叫“云吞”',
    content: '之所以叫云吞，是因为它刚来的时候缩成一团，白白软软的，特别像一只饱满的云吞。现在它长大了，虽然调皮，但依然是我的小心肝。',
    images: ['https://picsum.photos/seed/cat1/800/600', 'https://picsum.photos/seed/cat2/800/600'],
    likes: 128,
    comments: 42
  },
  {
    id: 'p2',
    type: 'PK投票',
    userName: '金毛阿黄',
    userAvatar: 'https://picsum.photos/seed/u2/100/100',
    title: '在线纠结！新领养的拉布拉多叫什么好？',
    pollOptions: [
      { id: '1', text: '方案A：奥利奥', votes: 156 },
      { id: '2', text: '方案B：拿铁', votes: 89 }
    ],
    images: ['https://picsum.photos/seed/dog1/800/600'],
    likes: 56,
    comments: 12
  },
  {
    id: 'p3',
    type: '挑战榜',
    challengeTag: '#本周挑战：食物系萌名',
    userName: '猫奴老李',
    userAvatar: 'https://picsum.photos/seed/u3/100/100',
    title: '我的挑战作品：三色猫“舒芙蕾”',
    content: '参加本周的食物系挑战！我家猫叫舒芙蕾，软软糯糯甜度爆表！',
    images: ['https://picsum.photos/seed/cat3/800/600'],
    likes: 215,
    comments: 38,
    rank: 1
  }
];

const Community: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('故事墙');
  const [votedIds, setVotedIds] = useState<Record<string, string>>({});

  const filteredPosts = useMemo(() => {
    return MOCK_POSTS.filter(p => p.type === activeFilter);
  }, [activeFilter]);

  return (
    <div className="bg-[#F9F9FB] min-h-screen pb-24 paper-texture">
      {/* 1. 复刻截图样式的胶囊切换器 */}
      <div className="sticky top-0 bg-white/80 ios-blur z-50 border-b border-black/[0.03] pt-safe">
        <div className="px-5 py-4 flex flex-col items-center">
          <div className="flex bg-[#F2F2F7]/50 p-1 rounded-full border border-black/[0.02] mb-1 shadow-sm">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-6 py-2 rounded-full text-[13px] font-bold transition-all duration-300 ${
                  activeFilter === f 
                  ? 'bg-black text-white shadow-lg scale-[1.02]' 
                  : 'text-black/40 hover:text-black/60'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* 故事墙 特有头部 */}
            {activeFilter === '故事墙' && (
              <div className="mb-4">
                <p className="brand-font text-[14px] text-[#FF6B9D] tracking-widest uppercase mb-1">Story Wall</p>
                <h2 className="text-2xl font-black text-black">温情灵感瞬间</h2>
              </div>
            )}

            {/* 挑战榜 特有头部 */}
            {activeFilter === '挑战榜' && (
              <Card className="bg-gradient-to-r from-[#AF52DE] to-[#5856D6] p-6 text-white border-0 shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
                <div className="relative z-10">
                  <span className="bg-white/20 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">本周热榜</span>
                  <h3 className="text-xl font-black mb-1">#食物系萌名大赏</h3>
                  <p className="text-white/60 text-xs">已有 1.2k 位铲屎官参与挑战</p>
                </div>
              </Card>
            )}

            {filteredPosts.map(post => (
              <Card key={post.id} className="border-0 shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-white rounded-[32px] overflow-hidden">
                {/* Post Header */}
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={post.userAvatar} className="w-10 h-10 rounded-full border border-black/[0.05]" alt="" />
                    <div>
                      <h4 className="text-sm font-bold text-black">{post.userName}</h4>
                      <p className="text-[10px] text-black/30 font-medium tracking-tight">2小时前</p>
                    </div>
                  </div>
                  {post.rank && (
                    <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center text-white font-black text-xs shadow-lg shadow-[#FFD700]/20">
                      TOP{post.rank}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="px-5 pb-2">
                  <h3 className="text-[17px] font-black mb-3 leading-snug">{post.title}</h3>
                  {post.content && (
                    <p className={`text-sm text-black/60 leading-relaxed mb-4 ${activeFilter === '故事墙' ? 'italic border-l-2 border-[#FF6B9D]/20 pl-4 py-1' : ''}`}>
                      {post.content}
                    </p>
                  )}

                  {/* PK Poll Logic */}
                  {post.type === 'PK投票' && post.pollOptions && (
                    <div className="space-y-3 mb-6">
                      {post.pollOptions.map(opt => {
                        const total = post.pollOptions!.reduce((a, b) => a + b.votes, 0);
                        const percent = Math.round((opt.votes / total) * 100);
                        const isVoted = votedIds[post.id] === opt.id;
                        const hasVotedAny = !!votedIds[post.id];

                        return (
                          <button
                            key={opt.id}
                            onClick={() => !hasVotedAny && setVotedIds({...votedIds, [post.id]: opt.id})}
                            className={`w-full relative h-14 rounded-2xl border transition-all overflow-hidden ${
                              isVoted ? 'border-[#FF6B9D] bg-[#FF6B9D]/5' : 'border-[#F2F2F7] bg-[#FAFAFA]'
                            }`}
                          >
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: hasVotedAny ? `${percent}%` : 0 }}
                              className={`absolute inset-y-0 left-0 ${isVoted ? 'bg-[#FF6B9D]/10' : 'bg-black/[0.03]'}`}
                            />
                            <div className="absolute inset-0 flex justify-between items-center px-5">
                              <span className={`text-[14px] font-bold ${isVoted ? 'text-[#FF6B9D]' : 'text-black/80'}`}>{opt.text}</span>
                              {hasVotedAny && <span className="brand-font text-xs opacity-40">{percent}%</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Image Display */}
                  {post.images && post.images.length > 0 && (
                    <div className={`grid gap-2 rounded-[24px] overflow-hidden mb-4 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {post.images.map((img, i) => (
                        <img key={i} src={img} className="w-full h-44 object-cover hover:scale-105 transition-transform duration-700" alt="" />
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Interaction */}
                <div className="px-5 py-4 border-t border-black/[0.02] flex items-center justify-between">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1.5 text-black/30 active:text-[#FF6B9D] transition-colors">
                      <ICONS.Heart size={18} />
                      <span className="text-xs font-bold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-black/30">
                      <ICONS.Community size={18} />
                      <span className="text-xs font-bold">{post.comments}</span>
                    </button>
                  </div>
                  <button className="p-2 text-black/20 hover:text-black/40 transition-colors">
                    <ICONS.Share size={18} />
                  </button>
                </div>
              </Card>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Create Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-28 right-6 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center z-[60]"
      >
        <ICONS.Plus size={28} />
      </motion.button>
    </div>
  );
};

export default Community;
