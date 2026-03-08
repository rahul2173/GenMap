
/* Added 'member' to RelationType to support generic additions and resolve type errors */
export type RelationType = 'parent' | 'child' | 'sibling' | 'spouse' | 'member';
export type GenderType = 'male' | 'female' | 'other';

export interface TreeMembership {
  id: string;
  name: string;
  code: string;
  role: string;
  memberCount: number;
  isPrimary: boolean;
}

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  gender?: GenderType;
  role: string;
  birthDate?: string;
  avatar: string;
  bio?: string;
  email?: string;
  phone?: string;
  isVerified: boolean;
  connections: Connection[];
  posts: Post[];
  x: number;
  y: number;
  trees?: TreeMembership[];
}

export interface Connection {
  toId: string;
  type: RelationType;
  flexible?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  type: 'post' | 'status' | 'event';
  imageUrl?: string;
  timestamp: string;
  likes: number;
}

export interface FamilyNotification {
  id: string;
  type: 'tree' | 'message' | 'event' | 'verification';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  senderId?: string;
  actionLabel?: string;
}

export interface VerificationChannel {
  type: 'email' | 'whatsapp' | 'sms';
}