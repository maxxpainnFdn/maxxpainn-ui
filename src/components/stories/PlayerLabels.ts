type PlayerLabel = { name: string; color: string };

const DEFAULT_LABEL: PlayerLabel = {
  name: "Media",
  color: "#8b5cf6",
};

export function getPlayerLabel(url: string): PlayerLabel {
  if (!url) return DEFAULT_LABEL;

  // normalize once for performance + consistency
  const u = url.toLowerCase();

  // extract hostname safely
  let hostname = "";
  try {
    hostname = new URL(u).hostname.replace("www.", "");
  } catch {
    return DEFAULT_LABEL;
  }

  switch (hostname) {
    // YouTube
    case "youtube.com":
    case "youtu.be":
      return { name: "YouTube", color: "#FF0000" };

    // Vimeo
    case "vimeo.com":
      return { name: "Vimeo", color: "#1AB7EA" };

    // Twitch
    case "twitch.tv":
      return { name: "Twitch", color: "#9146FF" };

    // SoundCloud
    case "soundcloud.com":
      return { name: "SoundCloud", color: "#FF5500" };

    // Spotify
    case "spotify.com":
    case "open.spotify.com":
      return { name: "Spotify", color: "#1DB954" };

    // TikTok
    case "tiktok.com":
    case "vm.tiktok.com":
    case "tiktokcdn.com":
      return { name: "TikTok", color: "#000000" };

    // Instagram
    case "instagram.com":
    case "instagr.am":
      return { name: "Instagram", color: "#E4405F" };

    // X / Twitter
    case "x.com":
    case "twitter.com":
      return { name: "X (Twitter)", color: "#1DA1F2" };

    // Facebook
    case "facebook.com":
    case "fb.watch":
      return { name: "Facebook", color: "#1877F2" };

    // Reddit
    case "reddit.com":
    case "v.redd.it":
      return { name: "Reddit", color: "#FF4500" };

    // Dailymotion
    case "dailymotion.com":
      return { name: "Dailymotion", color: "#0066DC" };

    // Streamable
    case "streamable.com":
      return { name: "Streamable", color: "#3F3F3F" };

    // Wistia
    case "wistia.com":
      return { name: "Wistia", color: "#54BBFF" };

    // Mixcloud
    case "mixcloud.com":
      return { name: "Mixcloud", color: "#52AAD8" };

    // Loom
    case "loom.com":
      return { name: "Loom", color: "#625DF5" };

    default:
      return DEFAULT_LABEL;
  }
}
