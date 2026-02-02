 export const getBadge = (days) => {
   if (days < 90)
     return {
       icon: "🧻",
       label: "Paper Hands",
       color: "text-green-400",
       border: "border-green-500/30",
     };
   if (days < 365)
     return {
       icon: "🗿",
       label: "Stone Hands",
       color: "text-purple-400",
       border: "border-purple-500/30",
     };
   if (days < 730)
     return {
       icon: "💎",
       label: "Diamond Hands",
       color: "text-pink-400",
       border: "border-pink-500/30",
     };
   return {
     icon: "👑",
     label: "God Tier",
     color: "text-red-500",
     border: "border-red-500/30",
   };
 };
