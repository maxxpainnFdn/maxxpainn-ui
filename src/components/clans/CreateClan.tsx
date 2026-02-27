import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, ChevronDown, Swords, Globe, AlertCircle } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import Dropzone from '../ui/dropzone';
import { SearchableSelect } from '@/components/ui/searchable-select'; // Import new component
import { useApi } from '@/hooks/useApi';
import toast from '@/hooks/toast';
import { ClanData } from '@/types/ClanData';
import EnsureConnected from '../ensureConnected/EnsureConnected';
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import Button from '../button/Button';
import { ClanCategories } from '@/data/clanCategories'; // Ensure this path is correct
import Modal from '../modal/Modal';

interface CreateClanForm {
    name: string;
    image: File[];
    tagline: string;
    description: string;
    category: string;
    x?: string;
    telegram?: string;
    discord?: string;
    website?: string;
}

const CreateClan = () => {

    const [isDialogOpen, setDialogOpen] = useState(false)
    const [socialOpen, setSocialOpen] = useState(false)

    const { control, register, handleSubmit, formState: { errors } } = useForm<CreateClanForm>()

    const [loading, setLoading] = useState(false)

    const api = useApi()
    const navigate = useNavigate();

    // 1. Transform the categories object into an array for the Select component
    const categoryOptions = useMemo(() => {
        return Object.entries(ClanCategories).map(([value, label]) => ({
            value,
            label
        }));
    }, []);

    const processFormSubmit = async (data: CreateClanForm) => {
        let fd = new FormData()

        for(let key of Object.keys(data)) {
            if(key === "image") {
                fd.append(key, data[key][0])
            } else {
                let value = (data as any)[key]
                if(!value) value = ""
                fd.append(key, value)
            }
        }

        setLoading(true)
        let resultStatus = await api.post<ClanData>("/clans/create", fd)
        setLoading(false)

        if(resultStatus.isError()){
            toast.error(resultStatus.getMessage())
            return false;
        }

        toast.success("Clan created successfully");

        let clan = resultStatus.getData() as ClanData;

        navigate(`/clans/${clan.slug}-${clan.id}`);
        setDialogOpen(false)
    }

    // Custom background class for inputs to contrast with Dialog
    const inputBgClass = "bg-gray-900/50 border-white/10 focus-visible:bg-black/60";
    
  const Title = () => (
    <div  className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
      <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
        <Swords className="w-6 h-6 text-purple-400" />
      </div>
      Create Clan
    </div>
  )
  
  return (
      <>
        <Button
          variant='primary'
          size="md"
          className="w-auto shadow-lg shadow-purple-500/20"
          onClick={() => setDialogOpen(true) }
        >
          <Plus className="w-5 h-5 mr-2" /> Create Clan
        </Button>
      
        <Modal
          open={isDialogOpen}
          onOpenChange={setDialogOpen}
          title={<Title />}
          description="Forge your alliance. Build your legacy."
          desktopClass="sm:max-w-[550px] max-h-[85vh] flex flex-col bg-gray-900/95 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-0 gap-0 overflow-hidden"
        >
           

          
                {/* Header with Gradient Line */}
          

                <div className="overflow-y-auto flex-1 p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    <EnsureConnected>
                        <form onSubmit={handleSubmit(processFormSubmit)} className="space-y-6">

                            {/* Logo Upload Section */}
                            <div className="space-y-2">
                                <Label htmlFor="image" className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                                    Clan Logo *
                                </Label>
                                <Controller
                                    name="image"
                                    control={control}
                                    rules={{ required: "Clan logo is required" }}
                                    render={({ field: { onChange, value } }) => (
                                        <Dropzone
                                            onChange={onChange}
                                            value={value as any}
                                            error={errors.image?.message}
                                            maxFiles={1}
                                            accept={{ 'image/*': ['.jpg', ".jpeg",".webp", ".png", ".gif"] }}
                                            enableCrop={true}
                                            cropAspectRatio={1}
                                            helperText="Recommended: 800×800px (1:1 Ratio)"
                                            disabled={loading}
                                        />
                                    )}
                                />
                            </div>

                            {/* Basic Info Grid */}
                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-1">
                                    <Input
                                        label="Clan Name *"
                                        name="name"
                                        placeholder="e.g. The Pain Warriors"
                                        type='text'
                                        disabled={loading}
                                        className={inputBgClass}
                                        {...register("name", {
                                            required: "Clan name is required",
                                            minLength: { value: 3, message: "Minimum 3 characters" }
                                        })}
                                        error={errors.name?.message}
                                    />
                                </div>

                                {/* 2. Categories Field */}
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider block">
                                        Category <span className="text-red-400">*</span>
                                    </Label>
                                    <Controller
                                        name="category"
                                        control={control}
                                        rules={{ required: "Please select a category" }}
                                        render={({ field: { onChange, value } }) => (
                                            <SearchableSelect
                                                options={categoryOptions}
                                                value={value}
                                                onChange={onChange}
                                                placeholder="Select a category..."
                                                searchPlaceholder="Search categories..."
                                                className={inputBgClass}
                                                disabled={loading}
                                                error={errors.category?.message}
                                            />
                                        )}
                                    />
                                    {errors.category && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-400 animate-in slide-in-from-top-1">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            <span className="font-bold">{errors.category.message}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Input
                                        label="Tagline *"
                                        name="tagline"
                                        placeholder="e.g. Embrace the grind, unleash the gain"
                                        type='text'
                                        disabled={loading}
                                        className={inputBgClass}
                                        hint="Catchy slogan (10-50 chars)"
                                        {...register("tagline", {
                                            required: "Tagline is required",
                                            minLength: { value: 10, message: "Minimum 10 characters" },
                                            maxLength: { value: 50, message: "Maximum 50 characters" }
                                        })}
                                        error={errors.tagline?.message}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Textarea
                                    label="Manifesto (Description) *"
                                    name="description"
                                    placeholder="Tell the world what your clan stands for..."
                                    className={`min-h-[120px] ${inputBgClass}`}
                                    disabled={loading}
                                    {...register("description", {
                                        required: "Description is required",
                                        minLength:{ value: 50, message: "Minimum 50 characters"},
                                        maxLength: { value: 500, message: "Maximum 500 characters" }
                                    })}
                                    hint={`${500} characters remaining`}
                                    error={errors.description?.message}
                                />
                            </div>

                            {/* Social Collapsible */}
                            <Collapsible open={socialOpen} onOpenChange={setSocialOpen} className="border-2 border-white/10 rounded-xl overflow-hidden">
                                <CollapsibleTrigger asChild>
                                    <button
                                      type="button"
                                      disabled={loading}
                                      className={`${inputBgClass} rounded-xl w-full flex items-center justify-between p-4 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-wide`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-purple-500" />
                                            Social Links (Optional)
                                        </span>
                                        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${socialOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="p-4 bg-black/20 pt-0 space-y-4 animate-in slide-in-from-top-2">
                                    <div className="h-px w-full bg-white/5 mb-4" />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Twitter (X)"
                                            name="x"
                                            placeholder="@handle"
                                            type="text"
                                            disabled={loading}
                                            className={inputBgClass}
                                            {...register("x")}
                                            error={errors.x?.message}
                                        />
                                        <Input
                                            label="Telegram"
                                            name="telegram"
                                            placeholder="@username"
                                            type="text"
                                            disabled={loading}
                                            className={inputBgClass}
                                            {...register("telegram")}
                                            error={errors.telegram?.message}
                                        />
                                        <Input
                                            label="Discord Invite"
                                            name="discord"
                                            placeholder="discord.gg/..."
                                            type="text"
                                            disabled={loading}
                                            className={inputBgClass}
                                            {...register("discord")}
                                            error={errors.discord?.message}
                                        />
                                        <Input
                                            label="Website"
                                            name="website"
                                            placeholder="https://..."
                                            type="url"
                                            disabled={loading}
                                            className={inputBgClass}
                                            {...register("website")}
                                            error={errors.website?.message}
                                        />
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>

                            {/* Footer Actions */}
                            <div className="pt-2 bg-gray-900/0 backdrop-blur-none z-10">
                                <Button
                                  type="submit"
                                  variant='primary'
                                  size="md"
                                  disabled={loading}
                                  loading={loading}
                                  fullWidth
                                  className='shadow-lg shadow-purple-900/20'
                                >
                                    {loading ? 'Forging Alliance...' : 'Create Clan'}
                                </Button>
                            </div>
                        </form>
                    </EnsureConnected>
                </div>
            </Modal>
      </>
    )
}

export default CreateClan;
