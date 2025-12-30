
export enum PetType {
  Dog = 'DOG',
  Cat = 'CAT',
  Bird = 'BIRD',
  Rabbit = 'RABBIT',
  Other = 'OTHER'
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

export interface CommunityPost {
  id: string;
  userName: string;
  userAvatar: string;
  title: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
}
