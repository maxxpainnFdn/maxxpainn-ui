// @/components/button/FollowButton.tsx

import React, { useState, useRef } from 'react';
import { Heart, UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import toast from '@/hooks/toast';
import Button from '@/components/button/Button';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  followingAccountId: string;
  initialFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const FollowButton = ({
  followingAccountId,
  initialFollowing = false,
  onFollowChange,
  size = 'md',
  showIcon = true,
  className
}: FollowButtonProps) => {

  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const api = useApi();

  ///console.log("accountToFollow===>", accountToFollow)

  const handleFollowToggle = async () => {
    if (isLoading) return;

    const previousState = isFollowing;
    const newState = !isFollowing;

    // Optimistic update
    setIsFollowing(newState);
    setIsLoading(true);

    const endpoint = newState ? '/account/follow' : '/account/unfollow';

    try {


      const result = await api.post(endpoint, { followingAccountId });

      if (result.isError()) {
        // Revert on error
        setIsFollowing(previousState);
        toast.error(result.getMessage() || 'Something went wrong');
        return;
      }

      // Success
      onFollowChange?.(newState);

      if (newState) {
        toast.success('Following!');
      }
    } catch (error) {
      // Revert on error
      setIsFollowing(previousState);
      toast.error('Failed to update follow status');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          {showIcon && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isFollowing ? 'Following...' : 'Following...'}</span>
        </>
      );
    }

    if (isFollowing) {
      // Show "Unfollow" on hover, "Following" otherwise
      if (isHovering) {
        return (
          <>
            {showIcon && <UserMinus className="w-4 h-4" />}
            <span>Unfollow</span>
          </>
        );
      }
      return (
        <>
          {showIcon && <Heart className="w-4 h-4 fill-current" />}
          <span>Following</span>
        </>
      );
    }

    return (
      <>
        {showIcon && <UserPlus className="w-4 h-4" />}
        <span>Follow</span>
      </>
    );
  };

  return (
    <Button
      variant={isFollowing ? 'outline' : 'primary'}
      size={size}
      onClick={handleFollowToggle}
      disabled={isLoading}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        'gap-2 transition-all duration-200 min-w-[120px]',
        isFollowing && isHovering && 'border-red-500/50 text-red-400 hover:bg-red-500/10',
        className
      )}
    >
      {getButtonContent()}
    </Button>
  );
};

export default FollowButton;
