import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import Dropzone from '@/components/ui/dropzone';
import { useApi } from '@/hooks/useApi';
import toast from '@/hooks/toast';
import Button from '@/components/button/Button';
import utils from '@/lib/utils';
import { profileCoverConfig } from '@/config/media';
import Modal from '../modal/Modal';

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
  //const [isDialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<ProfileCoverUploaderForm>();
  const [dialogOpen, setDialogOpen] = useState(false)

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
    const result = await api.postWithAuth('/account/update-cover-photo', fd);
    setLoading(false);

    if (result.isError()) {
      toast.error(result.getMessage());
      return;
    }

    toast.success('Cover photo updated!');

    const coverUrl = utils.getCoverPhotoUrl(result.getData() as string, "profile/cover");

    onSuccess?.(coverUrl);
    setDialogOpen(false);
  };

  return (
    <Modal
      open={dialogOpen}
      onOpenChange={handleOpenChange}
      title="Update Cover Photo"
      description="Add a banner image to personalize your profile."
      icon={ImageIcon}
      trigger={trigger}
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
    </Modal>
  );
};

export default ProfileCoverUploader;
