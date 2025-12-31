
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card } from '../components/UI';
import { ICONS, COLORS } from '../constants';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        username: formData.username || formData.email.split('@')[0],
        email: formData.email,
        joinedAt: new Date().toISOString()
      };
      
      localStorage.setItem('paw_user', JSON.stringify(mockUser));
      setLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pt-safe px-6">
      <div className="flex justify-between items-center pt-4">
        <button onClick={() => navigate('/')} className="p-2 bg-[#F2F2F7] rounded-full text-[#8E8E93] active:scale-90 transition-transform">
          <ICONS.Home size={20} />
        </button>
        <button onClick={() => navigate('/')} className="text-[#8E8E93] p-2">
          跳过
        </button>
      </div>

      <div className="mt-8 mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          {mode === 'login' ? '欢迎回来' : '创建账号'}
        </h1>
        <p className="text-[#8E8E93] font-medium">
          {mode === 'login' ? '继续您的 Petsoul 灵感之旅' : '加入 Petsoul，为爱宠寻觅灵魂之名'}
        </p>
      </div>

      <div className="bg-[#F2F2F7] p-1 rounded-xl flex mb-8">
        <button 
          onClick={() => setMode('login')}
          className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-white shadow-sm text-black' : 'text-[#8E8E93]'}`}
        >
          登录
        </button>
        <button 
          onClick={() => setMode('register')}
          className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${mode === 'register' ? 'bg-white shadow-sm text-black' : 'text-[#8E8E93]'}`}
        >
          注册
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
            className="space-y-4"
          >
            {mode === 'register' && (
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]">
                  <ICONS.User size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="昵称"
                  required
                  className="w-full h-14 bg-[#F2F2F7] rounded-2xl pl-12 pr-4 text-[17px] focus:bg-white focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>
            )}

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]">
                <ICONS.Mail size={20} />
              </div>
              <input 
                type="email" 
                placeholder="邮箱地址"
                required
                className="w-full h-14 bg-[#F2F2F7] rounded-2xl pl-12 pr-4 text-[17px] focus:bg-white focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]">
                <ICONS.Lock size={20} />
              </div>
              <input 
                type="password" 
                placeholder="密码"
                required
                className="w-full h-14 bg-[#F2F2F7] rounded-2xl pl-12 pr-4 text-[17px] focus:bg-white focus:ring-2 focus:ring-[#007AFF]/20 outline-none transition-all"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="pt-4">
          <Button loading={loading} className="w-full text-lg h-[56px] font-bold">
            {mode === 'login' ? '立即登录' : '立即注册'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
