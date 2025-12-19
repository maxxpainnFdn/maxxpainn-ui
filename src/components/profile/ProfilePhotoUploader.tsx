import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera, User, Sparkles } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import Dropzone from '@/components/ui/dropzone';
import { useApi } from '@/hooks/useApi';
import toast from '@/hooks/toast';
import Button from '@/components/button/Button';
import utils from '@/lib/utils';
import { profilePhotoConfig } from '@/config/media';

interface ProfilePhotoUploaderForm {
  photo: File[];
}

interface ProfilePhotoUploaderProps {
  currentPhotoUrl?: string;
  onSuccess?: (newPhotoUrl: string) => void;
  trigger?: React.ReactNode;
}

const ProfilePhotoUploader = ({
  currentPhotoUrl,
  onSuccess,
  trigger
}: ProfilePhotoUploaderProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<ProfilePhotoUploaderForm>();

  const api = useApi();

  // Watch for file changes to update preview
  const watchedPhoto = watch('photo');

  React.useEffect(() => {
    if (watchedPhoto && watchedPhoto.length > 0) {
      const file = watchedPhoto[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [watchedPhoto]);

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      reset();
      setPreviewUrl(null);
    }
  };

  const processFormSubmit = async (data: ProfilePhotoUploaderForm) => {
    const fd = new FormData();
    fd.append('photo', data.photo[0]);

    setLoading(true);
    const result = await api.post('/account/update-photo', fd);
    setLoading(false);

    if (result.isError()) {
      toast.error(result.getMessage());
      return;
    }

    toast.success('Profile photo updated!');

    const photoUrl =  utils.getServerImage(result.getData() as string, "profile/photo", "normal")

    console.log("photoUrl===>", photoUrl)

    onSuccess?.(photoUrl);

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
            <Camera className="w-4 h-4" />
            Update Photo
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[480px] flex flex-col bg-gray-900/95 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-0 gap-0 overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Header with Gradient Line */}
        <div className="relative p-6 pb-4 border-b border-white/5 bg-black/20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600" />
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Camera className="w-6 h-6 text-purple-400" />
              </div>
              Update Profile Photo
            </DialogTitle>
            <DialogDescription className="text-gray-400 ml-1">
              Upload a new photo to represent yourself.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit(processFormSubmit)} className="space-y-6">

            {/* Current vs New Preview */}
            <div className="flex items-center justify-center gap-6">
              {/* Current Photo */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current</span>
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/10 bg-gray-800/50">
                  {currentPhotoUrl ? (
                    <img
                      src={currentPhotoUrl}
                      alt="Current profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-10 h-10 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-transparent">.</span>
                <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
              </div>

              {/* New Photo Preview */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">New</span>
                <div className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 bg-gray-800/50 transition-all duration-300 ${previewUrl ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-white/10 border-dashed'}`}>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="New profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dropzone */}
            <div className="space-y-2">
              <Controller
                name="photo"
                control={control}
                rules={{ required: "Please select a photo" }}
                render={({ field: { onChange, value } }) => (
                  <Dropzone
                    onChange={onChange}
                    value={value}
                    error={errors.photo?.message}
                    maxFiles={1}
                    maxSize={profilePhotoConfig.maxSize} // 5MB
                    accept={{ 'image/*': profilePhotoConfig.formats }}
                    enableCrop={true}
                    cropAspectRatio={1}
                    helperText="Square image recommended (1:1 ratio)"
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
                {loading ? 'Uploading...' : 'Save Photo'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePhotoUploader;
