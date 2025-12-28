// @/components/dialogs/UsernameEditor.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AtSign, Check, X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useApi } from '@/hooks/useApi';
import toast from '@/hooks/toast';
import Button from '@/components/button/Button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Modal from '../modal/Modal';

interface ChangeUsernameForm {
  username: string;
}

interface ChangeUsernameProps {
  currentUsername?: string;
  onSuccess?: (newUsername: string) => void;
  trigger?: React.ReactNode;
}

const ChangeUsernameDialog = ({
  currentUsername,
  onSuccess,
  trigger
}: ChangeUsernameProps) => {

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [modalOpen, setModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
    clearErrors
  } = useForm<ChangeUsernameForm>({
    defaultValues: {
      username: ''
    }
  });

  const api = useApi();
  const apiRef = useRef(api);
  apiRef.current = api;

  const watchedUsername = watch('username');

  // Track the last checked username to prevent duplicate checks
  const lastCheckedRef = useRef<string>('');

  // Debounced username availability check
  useEffect(() => {
    // Reset availability when username changes
    setIsAvailable(null);

    // Skip if empty or too short
    if (!watchedUsername || watchedUsername.length < 3) {
      lastCheckedRef.current = '';
      return;
    }

    // Skip if same as current username
    if (watchedUsername.toLowerCase() === currentUsername?.toLowerCase()) {
      lastCheckedRef.current = '';
      return;
    }

    // Validate format before checking
    const usernameRegex = /^[a-zA-Z0-9-]+$/;
    if (!usernameRegex.test(watchedUsername)) {
      lastCheckedRef.current = '';
      return;
    }

    // Skip if we already checked this username
    if (watchedUsername === lastCheckedRef.current) {
      return;
    }

    const abortController = new AbortController();

    const checkUsername = async () => {
      setChecking(true);

      try {
        const result = await apiRef.current.get(
          `/account/check-username/${encodeURIComponent(watchedUsername)}`
        );

        // Bail if aborted
        if (abortController.signal.aborted) return;

        setChecking(false);

        if (result.isError()) {
          return;
        }

        // Mark as checked
        lastCheckedRef.current = watchedUsername;

        const data = result.getData() as { exists: boolean };

        const exists = data.exists;

        setIsAvailable(!exists);

        if (exists) {
          setError('username', {
            type: 'manual',
            message: 'This username is already taken'
          });
        } else {
          clearErrors('username');
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          setChecking(false);
        }
      }
    };

    const debounceTimer = setTimeout(checkUsername, 500);

    return () => {
      clearTimeout(debounceTimer);
      abortController.abort();
    };
  }, [watchedUsername, currentUsername, setError, clearErrors]);

  const handleOpenChange = (open: boolean) => {
    setModalOpen(open);

    if (!open) {
      reset();
      setIsAvailable(null);
      lastCheckedRef.current = '';
    }
  };

  const processFormSubmit = async (data: ChangeUsernameForm) => {

    if (!isAvailable) {
      toast.error('Please choose an available username');
      return;
    }

    setLoading(true);
    const result = await api.postWithAuth('/account/change-username', { username: data.username });
    setLoading(false);

    if (result.isError()) {
      toast.error(result.getMessage());
      return;
    }

    toast.success('Username updated successfully!');
    onSuccess?.(data.username);

    setModalOpen(false)
  };

  // Username validation pattern
  const usernamePattern = /^[a-zA-Z0-9-]+$/;

  const getStatusIcon = () => {
    if (checking) {
      return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />;
    }
    if (isAvailable === true) {
      return <Check className="w-5 h-5 text-green-500" />;
    }
    if (isAvailable === false) {
      return <X className="w-5 h-5 text-red-500" />;
    }
    return null;
  };

  const getStatusMessage = () => {
    if (checking) {
      return { text: 'Checking availability...', className: 'text-gray-400' };
    }
    if (isAvailable === true) {
      return { text: 'Username is available!', className: 'text-green-500' };
    }
    if (isAvailable === false) {
      return { text: 'Username is already taken', className: 'text-red-500' };
    }
    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <Modal
      onOpenChange={handleOpenChange}
      trigger={trigger}
      open={modalOpen}
      title="Change Username"
      description="Choose a unique username for your profile."
      icon={AtSign}
      size={440}
    >

      <form onSubmit={handleSubmit(processFormSubmit)} className="space-y-5">

        {/* Current Username Display */}
        {currentUsername && (
          <div className="p-4 bg-gray-800/50 rounded-xl border border-white/5">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Current Username
            </span>
            <p className="mt-1 text-sm text-white font-medium flex items-center gap-2">
              <AtSign className="w-4 h-4 text-gray-500" />
              <span>{currentUsername}</span>
            </p>
          </div>
        )}

        {/* New Username Field */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-300 uppercase tracking-wider">
            New Username
          </label>

          <div className="relative">
            <Input
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters'
                },
                maxLength: {
                  value: 30,
                  message: 'Username cannot exceed 30 characters'
                },
                pattern: {
                  value: usernamePattern,
                  message: 'Only letters, numbers, and hyphen allowed'
                },
                validate: (value) => {
                  if (value.toLowerCase() === currentUsername?.toLowerCase()) {
                    return 'Please choose a different username';
                  }
                  return true;
                }
              })}
              placeholder="your-username"
              disabled={loading}
              className={cn(
                'pr-12',
                isAvailable === true && !errors.username && 'border-green-500/50 focus:border-green-500',
                isAvailable === false && 'border-red-500/50 focus:border-red-500'
              )}
            />

            {/* Status Icon */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {watchedUsername && watchedUsername.length >= 3 && getStatusIcon()}
            </div>
          </div>

          {/* Error Message */}
          {errors.username && (
            <p className="text-sm text-red-500 flex items-center gap-1.5">
              <X className="w-4 h-4" />
              {errors.username.message}
            </p>
          )}

          {/* Status Message */}
          {!errors.username && statusMessage && (
            <p className={cn('text-sm flex items-center gap-1.5', statusMessage.className)}>
              {isAvailable === true && <Check className="w-4 h-4" />}
              {statusMessage.text}
            </p>
          )}

          {/* Helper Text */}
          <p className="text-xs text-gray-500">
            3-30 characters. Letters, numbers, and hyphens only.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
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
            disabled={loading || checking || !isAvailable || !!errors.username}
            loading={loading}
            className="flex-1 shadow-lg shadow-purple-900/20"
          >
            {loading ? 'Updating...' : 'Change'}
          </Button>
        </div>
      </form>

    </Modal>
  );
};

export default ChangeUsernameDialog;
