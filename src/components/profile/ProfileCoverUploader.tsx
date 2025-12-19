import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageIcon, Sparkles } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import Dropzone from '@/components/ui/dropzone';
import { useApi } from '@/hooks/useApi';
import toast from '@/hooks/toast';
import Button from '@/components/button/Button';
import utils from '@/lib/utils';
import { profileCoverConfig } from '@/config/media';

interface ProfileCoverUploaderForm {
  cover: File[];
}

interface ProfileCoverUploaderProps {
  onSuccess?: (newCoverUrl: string) => void;
  trigger?: React.ReactNode;
}

const ProfileCoverUploader = ({
  onSuccess,
  trigger
}: ProfileCoverUploaderProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<ProfileCoverUploaderForm>();

  const api = useApi();

  const watchedCover = watch('cover');

  React.useEffect(() => {
    if (watchedCover && watchedCover.length > 0) {
      const file = watchedCover[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [watchedCover]);

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      reset();
      setPreviewUrl(null);
    }
  };

  const processFormSubmit = async (data: ProfileCoverUploaderForm) => {

    const fd = new FormData();
    fd.append('coverPhoto', data.cover[0]);

    setLoading(true);
    const result = await api.post('/account/update-cover-photo', fd);
    setLoading(false);

    if (result.isError()) {
      toast.error(result.getMessage());
      return;
    }

    toast.success('Cover photo updated!');

    const coverUrl = utils.getCoverPhotoUrl(result.getData() as string, "profile/cover");

    onSuccess?.(coverUrl);
    handleOpenChange(false);
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
            <ImageIcon className="w-4 h-4" />
            Update Cover
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] flex flex-col bg-gray-900/95 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-0 gap-0 overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Header - Fixed */}
        <div className="relative p-6 pb-4 border-b border-white/5 bg-black/20 flex-shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600" />
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <ImageIcon className="w-6 h-6 text-purple-400" />
              </div>
              Update Cover Photo
            </DialogTitle>
            <DialogDescription className="text-gray-400 ml-1">
              Add a banner image to personalize your profile.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain p-6"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <form onSubmit={handleSubmit(processFormSubmit)} className="space-y-6">

            {/* Current vs New Preview - Stacked for wide images */}
            <div className="space-y-4">

              {/* New Cover Preview */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">New</span>
                <div className={`relative w-full aspect-[4/1] rounded-xl overflow-hidden border-2 bg-gray-800/50 transition-all duration-300 ${previewUrl ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-white/10 border-dashed'}`}>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="New cover preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
                      <ImageIcon className="w-8 h-8 text-gray-600" />
                      <span className="text-xs text-gray-600">Preview will appear here</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dropzone */}
            <div className="space-y-2">
              <Controller
                name="cover"
                control={control}
                rules={{ required: "Please select a cover image" }}
                render={({ field: { onChange, value } }) => (
                  <Dropzone
                    onChange={onChange}
                    value={value}
                    error={errors.cover?.message}
                    maxFiles={1}
                    maxSize={profileCoverConfig.maxSize}
                    accept={{ 'image/*': profileCoverConfig.formats }}
                    enableCrop={true}
                    cropAspectRatio={4 / 1}
                    helperText="Recommended: 1600×400px (4:1 ratio)"
                    disabled={loading}
                  />
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading || !previewUrl}
                loading={loading}
                className="flex-1 shadow-lg shadow-purple-900/20"
              >
                {loading ? 'Uploading...' : 'Save Cover'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCoverUploader;
