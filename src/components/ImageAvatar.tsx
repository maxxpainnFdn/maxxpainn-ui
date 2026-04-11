import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

// L1: module-level Map — sync, avoids re-running createAvatar for same seed
const CACHE_MAX = 100;
const dicebearCache = new Map<string, string>();

function getCachedAvatar(avatarType: any, seed: string): string {
  const key = seed ?? '';
  if (dicebearCache.has(key)) return dicebearCache.get(key)!;
  if (dicebearCache.size >= CACHE_MAX) {
    dicebearCache.delete(dicebearCache.keys().next().value);
  }
  const uri = createAvatar(avatarType, { seed: key, radius: 0 }).toDataUri();
  dicebearCache.set(key, uri);
  return uri;
}

// L2: TanStack Query — survives unmounts, dedupes concurrent renders
function useDicebearAvatar(avatarType: any, seed: string) {
  return useQuery({
    queryKey: ['dicebear', seed],
    queryFn: () => getCachedAvatar(avatarType, seed),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 10,
  });
}

export interface ImageAvatarProps {
  src?: string;
  alt?: string;
  seed?: string;
  radius?: number;
  size?: number;
  fallbackText?: string;
  className?: string;
  fallbackTextClass?: string;
  avatarType?: any;
}

export default function ImageAvatar({
  src = '',
  alt = '',
  seed = '',
  radius = 30,
  avatarType = null,
  fallbackText = '',
  className = '',
  fallbackTextClass = '',
  ...props
}: ImageAvatarProps) {
  const resolvedType = avatarType ?? botttsNeutral;

  const [srcLoaded, setSrcLoaded] = useState(false);
  const [srcError, setSrcError] = useState(false);
  const prevSrc = useRef(src);

  useEffect(() => {
    if (prevSrc.current !== src) {
      setSrcLoaded(false);
      setSrcError(false);
      prevSrc.current = src;
    }
  }, [src]);

  const { data: dicebearSrc, isSuccess } = useDicebearAvatar(resolvedType, seed);

  const showSrc = src && !srcError;

  return (
    <Avatar className={className} {...props}>
      {showSrc && (
        <AvatarImage
          src={src}
          alt={alt}
          onLoad={() => setSrcLoaded(true)}
          onError={() => setSrcError(true)}
          style={{
            width: '100%',
            transition: 'filter 0.4s ease, opacity 0.4s ease',
            filter: srcLoaded ? 'none' : 'blur(8px)',
            opacity: srcLoaded ? 1 : 0.6,
          }}
        />
      )}

      <AvatarFallback className={fallbackTextClass}>
        {fallbackText !== '' ? (
          <span>{fallbackText[0]}</span>
        ) : (
          <img
            src={dicebearSrc}
            alt={alt}
            loading="lazy"
            style={{
              width: '100%',
              transition: 'filter 0.35s ease, opacity 0.35s ease',
              filter: isSuccess ? 'none' : 'blur(6px)',
              opacity: isSuccess ? 1 : 0.5,
            }}
          />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
