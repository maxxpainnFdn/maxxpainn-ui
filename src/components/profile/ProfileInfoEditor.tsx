import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPen, User, FileText, MapPin, Link as LinkIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useApi } from '@/hooks/useApi';
import toast from '@/hooks/toast';
import Button from '@/components/button/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Modal from '../modal/Modal';

interface ProfileInfoForm {
  name: string;
  description: string;
  location: string;
  website: string;
}

interface ProfileInfoEditorProps {
  currentData?: Partial<ProfileInfoForm>;
  onSuccess?: (data: ProfileInfoForm) => void;
  trigger?: React.ReactNode;
}

const ProfileInfoEditor = ({
  currentData,
  onSuccess,
  trigger
}: ProfileInfoEditorProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm<ProfileInfoForm>({
    defaultValues: {
      name: '',
      description: '',
      location: '',
      website: ''
    }
  });

  const api = useApi();

  // Reset form with current data when dialog opens
  useEffect(() => {
    if (isDialogOpen && currentData) {
      reset({
        name: currentData.name || '',
        description: currentData.description || '',
        location: currentData.location || '',
        website: currentData.website || ''
      });
    }
  }, [isDialogOpen, currentData, reset]);

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      reset();
    }
  };

  const processFormSubmit = async (data: ProfileInfoForm) => {
    setLoading(true);
    const result = await api.post('/account/update-profile', data);
    setLoading(false);

    if (result.isError()) {
      toast.error(result.getMessage());
      return;
    }

    toast.success('Profile updated successfully!');
    onSuccess?.(data);
    handleOpenChange(false);
  };

  // URL validation pattern
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  return (
    <Modal
      open={isDialogOpen}
      onOpenChange={handleOpenChange}
      title="Edit Profile"
      description="Update your profile information visible to others."
      icon={UserPen}
      trigger={trigger}
    >

      <form onSubmit={handleSubmit(processFormSubmit)} className="space-y-5">

        {/* Name Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-300 uppercase tracking-wider">
            <User className="w-4 h-4 text-purple-400" />
            Display Name
          </label>
          <Input
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              },
              maxLength: {
                value: 100,
                message: 'Name cannot exceed 100 characters'
              }
            })}
            placeholder="Your display name"
            error={errors.name?.message}
            disabled={loading}
          />
          <p className="text-xs text-gray-500">This is how others will see you.</p>
        </div>

        {/* Description / Bio Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-300 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-purple-400" />
            Bio
          </label>
          <Textarea
            {...register('description', {
              maxLength: {
                value: 280,
                message: 'Bio cannot exceed 280 characters'
              }
            })}
            placeholder="Tell us about yourself..."
            error={errors.description?.message}
            disabled={loading}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">Brief description for your profile. Max 280 characters.</p>
        </div>

        {/* Location Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-300 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-purple-400" />
            Location
          </label>
          <Input
            {...register('location', {
              maxLength: {
                value: 100,
                message: 'Location cannot exceed 100 characters'
              }
            })}
            placeholder="City, Country"
            error={errors.location?.message}
            disabled={loading}
          />
          <p className="text-xs text-gray-500">Where are you based?</p>
        </div>

        {/* URL / Website Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-300 uppercase tracking-wider">
            <LinkIcon className="w-4 h-4 text-purple-400" />
            Website
          </label>
          <Input
            {...register('website', {
              pattern: {
                value: urlPattern,
                message: 'Please enter a valid URL'
              },
              maxLength: {
                value: 200,
                message: 'URL cannot exceed 200 characters'
              }
            })}
            placeholder="https://yourwebsite.com"
            error={errors.url?.message}
            disabled={loading}
          />
          <p className="text-xs text-gray-500">Your personal or portfolio website.</p>
        </div>

        {/* Actions */}
        <div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setDialogOpen(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading || !isDirty}
              loading={loading}
              className="flex-1 shadow-lg shadow-purple-900/20"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>

    </Modal>
  );
};

export default ProfileInfoEditor;
