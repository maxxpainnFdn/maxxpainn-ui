import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export interface ImageAvatarProps {
    src: string;
    alt: string;
    seed: string;
    radius: number;
    size: number;
    fallbackText?: string;
    className?: string;
    avatarType: any // bootsNeutral | botts |
}

export default function ImageAvatar({
    src="",
    alt="",
    seed = "",
    radius = 30,
    avatarType = null,
    fallbackText = "",
    className = "",
    fallbackTextClass = "",
    ...props
}) {    

   // if(avatarType == null){
      avatarType = botttsNeutral;
      //}

    const getDicebearAvatar = () => (
         createAvatar(avatarType, {
            seed: (seed ?? ""), 
            radius: 0        
        }).toDataUri()
    );
    

    return (
        <Avatar className={className} {...props}>
            <AvatarImage src={src} alt={alt} style={{ width: '100%'}}  />
            <AvatarFallback className={fallbackTextClass}>
                { fallbackText != "" ? 
                    <>{fallbackText.split("")[0]}</> : 
                    <img src={getDicebearAvatar()} alt={alt} loading="lazy" />
                }
            </AvatarFallback>
        </Avatar>
    )
}
