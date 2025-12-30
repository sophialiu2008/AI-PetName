
import React from 'react';
import { 
  House, 
  Sparkles, 
  PawPrint, 
  MessageCircle, 
  ChevronRight,
  Heart,
  Volume2,
  BarChart3,
  Camera,
  Stars,
  TextCursorInput,
  Plus,
  ArrowLeft,
  Share2,
  Download,
  Eye,
  Mic,
  Phone,
  X,
  Globe
} from 'lucide-react';

export const COLORS = {
  primary: '#FF6B9D',
  secondary: '#FFD700',
  background: '#FFFFFF',
  divider: '#F2F2F7',
  textMain: '#000000',
  textSecondary: '#8E8E93',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FFCC00'
};

export const ICONS = {
  Home: House,
  Naming: Sparkles,
  MyPet: PawPrint,
  Community: MessageCircle,
  ChevronRight: ChevronRight,
  Heart: Heart,
  Volume: Volume2,
  Chart: BarChart3,
  Camera: Camera,
  Stars: Stars,
  Text: TextCursorInput,
  Plus: Plus,
  Back: ArrowLeft,
  Share: Share2,
  Download: Download,
  View: Eye,
  Mic: Mic,
  Phone: Phone,
  Close: X,
  Globe: Globe
};

export const APP_CONFIG = {
  MODELS: {
    TEXT: 'gemini-3-flash-preview',
    VISION: 'gemini-3-flash-preview',
    TTS: 'gemini-2.5-flash-preview-tts',
    LIVE: 'gemini-2.5-flash-native-audio-preview-09-2025'
  }
};
