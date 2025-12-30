
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/UI';
import { ICONS, COLORS } from '../constants';

const CreatePostSheet: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[101] flex items-end justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-white rounded-t-[32px] overflow-hidden p-6 pb-safe shadow-2xl border-t border-white/20"
          >
            <div className="w-10 h-1 bg-[#E5E5EA] rounded-full mx-auto mb-8" />
            <h3 className="text-xl font-bold mb-6 px-2 text-black tracking-tight">发起互动</h3>
            <div className="space-y-4">
              {[
                { icon: <ICONS.Text size={24} />, title: '发布故事', desc: '分享你和TA的起名缘分' },
                { icon: <ICONS.Chart size={24} />, title: '参与投票', desc: '让大家帮你选出最心仪的名字' },
                { icon: <ICONS.Stars size={24} />, title: '话题挑战', desc: '参与本周热门宠物起名挑战' },
              ].map((opt) => (
                <motion.button
                  key={opt.title}
                  whileHover={{ scale: 1.02, backgroundColor: '#F2F2F7' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#F2F2F7]/50 active:scale-[0.97] transition-all text-left group border border-transparent hover:border-[#FF6B9D]/10"
                  onClick={() => {
                    alert(`${opt.title}功能开发中...`);
                    onClose();
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#FF6B9D] shadow-sm transition-transform">
                    {opt.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[16px] text-black">{opt.title}</p>
                    <p className="text-[13px] text-[#8E8E93] leading-tight mt-0.5">{opt.desc}</p>
                  </div>
                  <ICONS.ChevronRight size={18} className="text-[#C7C7CC]" />
                </motion.button>
              ))}
            </div>
            <button 
              onClick={onClose} 
              className="w-full mt-6 py-4 font-bold text-[#8E8E93] text-[17px] active:opacity-50 transition-opacity"
            >
              取消
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const PostCard: React.FC<{ post: any }> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <Card className="mb-6 border-[#F2F2F7] overflow-hidden group">
        {/* Card Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer"
            >
              <img 
                src={post.userAvatar} 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" 
                alt="Avatar" 
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </motion.div>
            <div>
              <p className="text-[14px] font-bold text-black leading-none mb-1 hover:text-[#007AFF] transition-colors cursor-pointer">{post.userName}</p>
              <p className="text-[11px] text-[#8E8E93] font-medium tracking-tight">刚刚发布</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,122,255,0.15)' }}
            whileTap={{ scale: 0.95 }}
            className="text-[13px] font-bold text-[#007AFF] px-4 py-1.5 bg-[#007AFF]/10 rounded-full transition-all"
          >
            关注
          </motion.button>
        </div>

        {/* Card Content */}
        <div className="px-4 pb-4">
          <h4 className="font-bold text-[17px] mb-3 text-black leading-tight tracking-tight line-clamp-2">
            {post.title}
          </h4>
          
          {/* Refined Image Grid with Framer Motion Layout */}
          <motion.div 
            layout
            className={`grid gap-2 mb-4 overflow-hidden rounded-2xl ${
              post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
            }`}
          >
            {post.images.map((img: string, i: number) => (
              <motion.div 
                key={i}
                layout
                className={`bg-[#F2F2F7] overflow-hidden relative ${
                  post.images.length === 1 ? 'aspect-video' : 'aspect-square'
                }`}
              >
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  src={img} 
                  className="w-full h-full object-cover cursor-zoom-in" 
                  alt="Post Content" 
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons Footer */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#F2F2F7]">
            <motion.button 
              onClick={handleLike}
              whileHover={{ backgroundColor: liked ? 'rgba(255,107,157,0.1)' : 'rgba(142,142,147,0.05)' }}
              whileTap={{ scale: 0.9 }}
              className={`flex items-center gap-2 h-10 px-4 rounded-full transition-colors duration-300 ${
                liked ? 'text-[#FF3B30]' : 'text-[#8E8E93]'
              }`}
            >
              <motion.div
                animate={liked ? { scale: [1, 1.4, 1], rotate: [0, 15, 0] } : {}}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <ICONS.Heart 
                  size={20} 
                  fill={liked ? '#FF3B30' : 'none'}
                  strokeWidth={liked ? 0 : 2}
                />
              </motion.div>
              <span className="text-[13px] font-semibold">
                {likeCount}
              </span>
            </motion.button>

            <motion.button 
              whileHover={{ backgroundColor: 'rgba(0,122,255,0.05)', color: '#007AFF' }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 h-10 px-4 rounded-full text-[#8E8E93] transition-all duration-300"
            >
              <ICONS.Community size={20} strokeWidth={2} />
              <span className="text-[13px] font-semibold">
                {post.comments}
              </span>
            </motion.button>

            <motion.button 
              whileHover={{ backgroundColor: 'rgba(142,142,147,0.05)', scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="ml-auto w-10 h-10 flex items-center justify-center rounded-full text-[#8E8E93] transition-all duration-300"
            >
              <ICONS.Share size={20} strokeWidth={2} />
            </motion.button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [feedFilter, setFeedFilter] = useState('全部');
  const [rankFilter, setRankFilter] = useState('全球');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const posts = [
    {
      id: 1,
      userName: '糯米麻麻',
      userAvatar: 'https://picsum.photos/seed/user1/100/100',
      title: '给家里新来的小银渐层取名叫“云吞”，大家觉得怎么样？',
      images: ['https://picsum.photos/seed/cat1/800/600', 'https://picsum.photos/seed/cat2/800/600'],
      likes: 128,
      comments: 42
    },
    {
      id: 2,
      userName: '阿黄的日常',
      userAvatar: 'https://picsum.photos/seed/user2/100/100',
      title: '关于如何给大暖男金毛取一个不烂大街的名字...',
      images: ['https://picsum.photos/seed/dog1/800/600'],
      likes: 56,
      comments: 18
    }
  ];

  const rankings = [
    { name: '糯米', usage: '2.4w', trend: '+12%', rank: 1 },
    { name: '奥利奥', usage: '1.8w', trend: '+5%', rank: 2 },
    { name: '可乐', usage: '1.5w', trend: '-2%', rank: 3 },
    { name: '汤圆', usage: '1.2w', trend: '+20%', rank: 4 },
    { name: '布丁', usage: '1.1w', trend: '+8%', rank: 5 },
  ];

  return (
    <div className="bg-[#F9F9FB] min-h-screen">
      {/* Sticky Top Header */}
      <div className="sticky top-0 bg-white/80 ios-blur z-40 border-b border-[#F2F2F7]">
        <div className="pt-safe px-5 pb-2">
          <div className="flex items-center justify-between mb-4 mt-2">
            <h1 className="text-[28px] font-bold tracking-tight text-black">社区灵感</h1>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCreateOpen(true)}
              className="w-10 h-10 rounded-full bg-[#FF6B9D] text-white flex items-center justify-center shadow-lg shadow-[#FF6B9D]/20 transition-all"
            >
              <ICONS.Plus size={24} strokeWidth={2.5} />
            </motion.button>
          </div>
          <div className="flex gap-6 relative">
            {['feed', 'rank'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-[17px] font-bold transition-all duration-300 relative ${activeTab === tab ? 'text-black' : 'text-[#8E8E93]'}`}
              >
                {tab === 'feed' ? '发现' : '排行榜'}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FF6B9D] rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 pb-24">
        {activeTab === 'feed' ? (
          <>
            {/* Feed Filter Row */}
            <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar py-1">
              {['全部', '关注', '最新', '话题'].map(f => (
                <motion.button
                  key={f}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFeedFilter(f)}
                  className={`px-5 py-1.5 rounded-full text-[13px] font-bold transition-all flex-shrink-0 ${
                    feedFilter === f ? 'bg-black text-white shadow-md' : 'bg-white ios-shadow text-[#8E8E93]'
                  }`}
                >
                  {f}
                </motion.button>
              ))}
            </div>
            
            <motion.div 
              layout
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {posts.map(post => <PostCard key={post.id} post={post} />)}
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="animate-fadeIn"
          >
            {/* Rank Segmented Control */}
            <div className="flex bg-[#F2F2F7] p-1 rounded-xl mb-6">
              {['全球', '本地', '品种'].map(f => (
                <button
                  key={f}
                  onClick={() => setRankFilter(f)}
                  className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all relative ${
                    rankFilter === f ? 'text-black' : 'text-[#8E8E93]'
                  }`}
                >
                  <span className="relative z-10">{f}</span>
                  {rankFilter === f && (
                    <motion.div 
                      layoutId="rankFilter"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {rankings.map(item => (
                <motion.div 
                  layout
                  key={item.name} 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-[#F2F2F7] transition-colors group cursor-pointer"
                >
                  <span className={`text-[20px] font-black w-8 text-center transition-colors ${item.rank <= 3 ? 'text-[#FFD700]' : 'text-[#C7C7CC] group-hover:text-black'}`}>
                    {item.rank}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-bold text-[17px] text-black">{item.name}</h4>
                    <p className="text-[11px] text-[#8E8E93] font-medium tracking-wide">{item.usage} 人正在使用</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[13px] font-bold ${item.trend.startsWith('+') ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>
                      {item.trend}
                    </p>
                    <p className="text-[10px] text-[#8E8E93] font-medium">趋势</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <CreatePostSheet isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};

export default Community;
