import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  name?: string;
  address?: string;
  walletAddress?: string;
  description?: string;
  clanId?: string;
  profilePhoto?: string;
  backgroundImage?: string;
  customColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

// Mock data for demonstration - replace with your backend later
const mockProfiles: Record<string, UserProfile> = {
  '1': {
    id: '1',
    name: 'John Doe',
    address: '123 Main St, New York, NY',
    walletAddress: '0x1234...5678',
    description: 'Crypto enthusiast and NFT collector. Living the pain, minting the gain.',
    clanId: 'clan-1',
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    backgroundImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    customColors: {
      primary: '220 70% 50%',
      secondary: '280 60% 50%',
      accent: '340 75% 55%',
    },
    followersCount: 1234,
    followingCount: 567,
    isFollowing: false,
  },
};

const mockFollowers: UserProfile[] = [
  { id: '2', name: 'Alice Smith', profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', walletAddress: '0xabcd...efgh' },
  { id: '3', name: 'Bob Johnson', profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', walletAddress: '0x9876...5432' },
  { id: '4', name: 'Carol White', profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol', walletAddress: '0xdef0...1234' },
];

const mockFollowing: UserProfile[] = [
  { id: '5', name: 'David Brown', profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', walletAddress: '0x1111...2222' },
  { id: '6', name: 'Eve Davis', profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eve', walletAddress: '0x3333...4444' },
];

export function useProfile() {
  const [loading, setLoading] = useState(false);

  const getProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
    return mockProfiles[userId] || mockProfiles['1'];
  }, []);

  const updateProfile = useCallback(async (userId: string, data: Partial<UserProfile>) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update mock data
    if (mockProfiles[userId]) {
      mockProfiles[userId] = { ...mockProfiles[userId], ...data };
    }
    
    toast.success("Profile updated successfully");
    setLoading(false);
    return true;
  }, []);

  const followUser = useCallback(async (userId: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (mockProfiles[userId]) {
      mockProfiles[userId].isFollowing = true;
      mockProfiles[userId].followersCount = (mockProfiles[userId].followersCount || 0) + 1;
    }
    
    toast.success("Now following user");
    setLoading(false);
    return true;
  }, []);

  const unfollowUser = useCallback(async (userId: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (mockProfiles[userId]) {
      mockProfiles[userId].isFollowing = false;
      mockProfiles[userId].followersCount = Math.max(0, (mockProfiles[userId].followersCount || 0) - 1);
    }
    
    toast.success("Unfollowed user");
    setLoading(false);
    return true;
  }, []);

  const getFollowers = useCallback(async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockFollowers;
  }, []);

  const getFollowing = useCallback(async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockFollowing;
  }, []);

  return {
    loading,
    getProfile,
    updateProfile,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
  };
}
