import { X } from "lucide-react";

// ---------------------------------------------------------------------------
export interface MediaFile {
  file: File;
  url: string;
  type: "image" | "video";
}

export default function MediaPreview({ files, onRemove }: { files: MediaFile[]; onRemove: (i: number) => void }) {
  if (!files.length) return null;
  return (
    <div className="flex gap-2 flex-wrap px-4 pt-2 pb-1">
      {files.map((m, i) => (
        <div key={i} className="relative group/media rounded-xl overflow-hidden border border-maxx-violet/20 bg-maxx-bg0">
          {m.type === "image" ? (
            <img
              src={m.url}
              alt=""
              className="h-[72px] w-auto max-w-[120px] object-cover block"
            />
          ) : (
            <video
              src={m.url}
              className="h-[72px] w-auto max-w-[140px] object-cover block"
              muted
              playsInline
              onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
              onMouseLeave={(e) => { const v = e.currentTarget as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
            />
          )}
          {/* Remove button */}
          <button
            onClick={() => onRemove(i)}
            className="action-btn absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 transition-opacity opacity-0 group-hover/media:opacity-100 border-none cursor-pointer"
          >
            <X size={11} />
          </button>
          {/* Video badge */}
          {m.type === "video" && (
            <span className="absolute bottom-1 left-1.5 font-mono text-[0.58rem] text-white/70 bg-black/50 rounded px-1 py-0.5 leading-none">
              VIDEO
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
