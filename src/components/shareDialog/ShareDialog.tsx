// @/components/dialogs/ShareDialog.tsx

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Share2,
  Copy,
  Check,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  MessageCircle,
  Send,
  Link2,
  QrCode
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from '@/hooks/toast';
import Button from '@/components/button/Button';

interface ShareDialogProps {
  url: string;
  text?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  trigger?: React.ReactNode;
}

interface ShareOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  action: (url: string, text: string) => void;
}

const ShareDialog = ({
  url,
  text = '',
  dialogTitle = 'Share Profile',
  dialogDescription = "",
  trigger
}: ShareDialogProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  const shareOptions: ShareOption[] = [
    {
      id: 'twitter',
      name: 'Twitter / X',
      icon: <Twitter className="w-5 h-5" />,
      color: 'bg-black',
      hoverColor: 'hover:bg-gray-800',
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
          '_blank',
          'noopener,noreferrer,width=550,height=420'
        );
      }
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'bg-[#1877F2]',
      hoverColor: 'hover:bg-[#1664d9]',
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          '_blank',
          'noopener,noreferrer,width=550,height=420'
        );
      }
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'bg-[#0A66C2]',
      hoverColor: 'hover:bg-[#0958a8]',
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          '_blank',
          'noopener,noreferrer,width=550,height=420'
        );
      }
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-[#25D366]',
      hoverColor: 'hover:bg-[#20bd5a]',
      action: () => {
        window.open(
          `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
          '_blank',
          'noopener,noreferrer'
        );
      }
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: <Send className="w-5 h-5" />,
      color: 'bg-[#0088cc]',
      hoverColor: 'hover:bg-[#0077b3]',
      action: () => {
        window.open(
          `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
          '_blank',
          'noopener,noreferrer'
        );
      }
    },
    {
      id: 'email',
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-gray-600',
      hoverColor: 'hover:bg-gray-500',
      action: () => {
        window.location.href = `mailto:?subject=${encodedText}&body=${encodedText}%0A%0A${encodedUrl}`;
      }
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: text || 'Check out this profile',
          text: text,
          url: url
        });
      } catch (err) {
        // User cancelled or error
        if ((err as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setCopied(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange} modal={true}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[420px] flex flex-col bg-gray-900/95 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-0 gap-0 overflow-hidden"
      >
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-white/5 bg-black/20 flex-shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600" />
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Share2 className="w-6 h-6 text-purple-400" />
              </div>
              {dialogTitle}
            </DialogTitle>
            <DialogDescription className="text-gray-400 ml-1">
              {dialogDescription}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* URL Preview & Copy */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Profile Link
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-800/50 rounded-xl border border-white/5 overflow-hidden">
                <Link2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-300 truncate">{url}</span>
              </div>
              <button
                onClick={handleCopyLink}
                className={cn(
                  'p-3 rounded-xl border transition-all duration-300 flex-shrink-0',
                  copied
                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                    : 'bg-gray-800/50 border-white/5 text-gray-400 hover:bg-gray-700 hover:text-white hover:border-purple-500/50'
                )}
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Native Share Button (Mobile) */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button
              variant="primary"
              size="md"
              onClick={handleNativeShare}
              className="w-full gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share via Device
            </Button>
          )}

          {/* Share Options Grid */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Share to
            </label>
            <div className="grid grid-cols-3 gap-3">
              {shareOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => option.action(url, text)}
                  className={cn(
                    'group flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 transition-all duration-300',
                    'bg-gray-800/30 hover:bg-gray-800/60',
                    'hover:border-white/10 hover:shadow-lg'
                  )}
                >
                  <div
                    className={cn(
                      'p-2.5 rounded-lg text-white transition-all duration-300',
                      option.color,
                      option.hoverColor,
                      'group-hover:scale-110 group-hover:shadow-lg'
                    )}
                  >
                    {option.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">
                    {option.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional: QR Code Section */}
          {/*
          <div className="pt-4 border-t border-white/5">
            <button className="w-full flex items-center justify-center gap-2 p-3 text-sm text-gray-400 hover:text-white transition-colors">
              <QrCode className="w-4 h-4" />
              Show QR Code
            </button>
          </div>
          */}

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
