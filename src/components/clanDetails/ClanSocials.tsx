import { Globe } from "lucide-react"
import { SiDiscord, SiX, SiTelegram } from '@icons-pack/react-simple-icons';


export default function ClanSocials({ socials }: { socials: Record<string, string>}) {
    
  if(Object.keys(socials).length == 0) return <></>
  
  const iconClasses = "h-5 w-5 text-primary group-hover:scale-110 transition-transform"

  const icons = {
    x: <SiX  className={iconClasses} />,
    telegram: <SiTelegram  className={iconClasses} />,
    discord: <SiDiscord className={iconClasses} />,
    website: <Globe className={iconClasses} />
  }

  const getSocialLink = (name, username) => {
      
    if(name == 'discord' || name == "website"){
        return username
    }

    if(name == "x"){
        return `https://x.com/${username}`
    } else if (name == "telegram") {
        return `https://t.me/${username}`
    }

    return "";
  }



  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {Object.keys(socials).map(name => {
        
        if (!(name in icons)) {
          return <span key={name}></span>
        }
        
        return (
          <a key={name}
            href={getSocialLink(name, socials[name])}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center  gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all duration-300 border border-border/40 hover:border-primary/40 group"
          >
            {icons[name]}
            <span className="capitalize text-sm font-medium ">
              {name}
            </span>
          </a>
        )
      })}
    </div>
  )
}
