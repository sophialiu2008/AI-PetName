
export enum PetType {
  Dog = 'DOG',
  Cat = 'CAT',
  Bird = 'BIRD',
  Rabbit = 'RABBIT',
  Other = 'OTHER'
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  joinedAt: string;
}

export interface PetProfile {
  id: string;
  name: string;
  type: PetType;
  breed?: string;
  gender?: 'MALE' | 'FEMALE';
  personality: string[];
  photoUrl?: string;
  birthday?: string;
}

export interface NameSuggestion {
  id: string;
  name: string;
  meaning: string;
  tags: string[];
  popularity: {
    global: number;
    local: number;
    breed: number;
  };
  isFavorite: boolean;
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  time: string;
}

export interface CommunityPost {
  id: string;
  userName: string;
  userAvatar: string;
  title: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  type: 'story' | 'pk' | 'challenge';
  pollOptions?: { id: string; text: string; votes: number }[];
  challengeTag?: string;
  commentsList?: Comment[];
}
