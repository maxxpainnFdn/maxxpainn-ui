import { useEffect, useRef, useState } from "react";
import ImageAvatar from "../ImageAvatar";
import utils, { cn } from "@/lib/utils";
import MediaPreview, { MediaFile } from "./MediaPreview";
import { Paperclip, SendHorizonal, Smile } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import { AccountData } from "@/types/AccountData";
import { useApi } from "@/hooks/useApi";
import toast from "@/hooks/toast";
import Spinner from "../spinner/Spinner";
import { CommentData } from "@/types/CommentData";
import EventBus from "@/core/EventBus";

interface PostInputBoxProps {
  postId: number;
  currentUser: AccountData;
  onComment?: (comment: CommentData)=>void;
}

export default function CommentBox({ postId, currentUser, onComment }: PostInputBoxProps) {
  
  
  const api = useApi()
  
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isPosting, setPosting] = useState(false)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX = 280;

  // Auto-grow textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [text]);
  

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => { mediaFiles.forEach((m) => URL.revokeObjectURL(m.url)); };
  }, [mediaFiles]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const clearInputBox = () => {
    setText("");
    setShowEmoji(false);
    mediaFiles.forEach((m) => URL.revokeObjectURL(m.url));
    setMediaFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const handleSubmit = async () => {
    
    const trimmedText = text.trim();
    
    if (!trimmedText && mediaFiles.length === 0) return;
    
    const fd = new FormData();
    
    fd.append("postId", postId.toString())
    fd.append("content", trimmedText)
    
    /*for (const fileInfo of mediaFiles) {
      fd.append("media[]", fileInfo.file)
    }*/
    
    setPosting(true)
   
    const resultStatus = await api.postWithAuth("/posts/new-comment", fd)
    
    setPosting(false)
    
    if (resultStatus.isError()) {
      toast.error(resultStatus.getMessage())
      return;
    }
    
    //onsole.log("resultStatus===>", resultStatus)
    onComment?.(resultStatus.getData())
    EventBus.emit(`onComment_${postId}`, resultStatus.getData())
    
    clearInputBox();
  };
  

  const insertEmoji = (em: string) => {
    setText((prev) => prev + em);
    setShowEmoji(false); // close picker after selection
    textareaRef.current?.focus();
  };
  
  /* 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const allowed = files.filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
    const mapped: MediaFile[] = allowed.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
      type: f.type.startsWith("image/") ? "image" : "video",
    }));
    setMediaFiles((prev) => [...prev, ...mapped]);
    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };
  */
  
  const remaining = MAX - text.length;
  const isOverLimit = remaining < 0;
  const isNearLimit = remaining <= 30 && !isOverLimit;
  const canSubmit = (text.trim().length > 0 || mediaFiles.length > 0) && !isOverLimit;
  
  if(!currentUser) return (<></>)

  return (
    <div className="pt-3 pb-4">
      
      <div className=" flex gap-3 items-start">
        {/* Avatar */}
        <div className="flex-shrink-0 mt-0.5">
          <ImageAvatar
            className="h-[40px] w-[40px] mx-auto border-4 shadow-2xl"
            src={utils.getServerImage(currentUser.photo, "profile/photo", "tiny")}
            alt=""
            seed={currentUser.address}
            size={40}
          />
        </div>

        {/* Input area */}
        <div className="flex-1 min-w-0">
          <div className={cn(
            "relative rounded-2xl border transition-all duration-200",
            "bg-maxx-bg0/60 border-maxx-violet/[0.16]",
            "focus-within:border-maxx-violet/40 focus-within:bg-maxx-bg0/80 focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.06)]"
          )}>
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a reply… (Enter to send)"
              disabled={isPosting}
              rows={1}
              className={cn(
                "w-full bg-transparent text-maxx-mid placeholder-maxx-dim/50 text-[0.9rem]",
                "resize-none px-4 pt-3 pb-2 outline-none rounded-2xl",
                "font-medium",
              )}
            />

            {/* Media previews 
            <MediaPreview files={mediaFiles} onRemove={removeMedia} />
            */}
            
            {/* Toolbar row */}
            <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
              {/* Left: emoji + attachment */}
              <div className="flex items-center gap-0.5 relative">
                <button
                  onMouseDown={(e) => {
                    // Prevent the document mousedown (click-outside) from firing
                    // before this toggle, which would cause a flicker close→open
                    e.preventDefault();
                    setShowEmoji((v) => !v);
                  }}
                  className={cn(
                    "action-btn p-1.5 rounded-lg transition-colors bg-transparent border-none cursor-pointer",
                    showEmoji
                      ? "text-maxx-violet bg-maxx-violet/10"
                      : "text-maxx-dim hover:text-maxx-sub hover:bg-maxx-violet/5"
                  )}
                  title="Emoji"
                >
                  <Smile size={15} />
                </button>
                
                {/* 
                <label
                  className={cn(
                    "action-btn p-1.5 rounded-lg transition-colors cursor-pointer",
                    mediaFiles.length > 0
                      ? "text-maxx-violet bg-maxx-violet/10"
                      : "text-maxx-dim hover:text-maxx-sub hover:bg-maxx-violet/5"
                  )}
                  title="Attach image or video"
                >
                  <Paperclip size={15} />
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
                */}

                {/* Emoji picker popover */}
                {showEmoji && (
                  <EmojiPicker onSelect={insertEmoji} onClose={() => setShowEmoji(false)} />
                )}
              </div>

              {/* Right: char count + send */}
              <div className="flex items-center gap-2.5">
                {text.length > 0 && (
                  <span className={cn(
                    "font-mono text-[0.68rem] tabular-nums transition-colors",
                    isOverLimit ? "text-red-400" : isNearLimit ? "text-amber-400" : "text-maxx-dim"
                  )}>
                    {remaining}
                  </span>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={cn(
                    "action-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.78rem] font-semibold font-mono transition-all duration-200 border-none cursor-pointer",
                    canSubmit
                      ? "bg-maxx-violet text-white hover:bg-maxx-violet-lt shadow-[0_2px_12px_rgba(139,92,246,0.35)] hover:shadow-[0_4px_18px_rgba(139,92,246,0.45)]"
                      : "bg-maxx-violet/10 text-maxx-dim cursor-not-allowed"
                  )}
                >
                  {isPosting
                    ? <Spinner size={14} /> 
                    : <><SendHorizonal size={13} />{ " " }<span>Reply</span></>
                  }
                 
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
