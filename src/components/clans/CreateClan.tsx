import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, ChevronDown, Swords, Globe, AlertCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import Dropzone from "../ui/dropzone";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useApi } from "@/hooks/useApi";
import toast from "@/hooks/toast";
import { ClanData } from "@/types/ClanData";
import EnsureConnected from "../ensureConnected/EnsureConnected";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import Button from "../button/Button";
import { ClanCategories } from "@/data/clanCategories";
import Modal from "../modal/Modal";

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
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [socialOpen, setSocialOpen]   = useState(false);
  const [loading, setLoading]         = useState(false);

  const { control, register, handleSubmit, formState: { errors } } =
    useForm<CreateClanForm>();

  const api      = useApi();
  const navigate = useNavigate();

  const categoryOptions = useMemo(
    () => Object.entries(ClanCategories).map(([value, label]) => ({ value, label })),
    [],
  );

  const processFormSubmit = async (data: CreateClanForm) => {
    const fd = new FormData();
    for (const key of Object.keys(data)) {
      if (key === "image") {
        fd.append(key, (data as any)[key][0]);
      } else {
        fd.append(key, (data as any)[key] ?? "");
      }
    }

    setLoading(true);
    const resultStatus = await api.post<ClanData>("/clans/create", fd);
    setLoading(false);

    if (resultStatus.isError()) { toast.error(resultStatus.getMessage()); return; }

    toast.success("Clan created successfully");
    const clan = resultStatus.getData() as ClanData;
    navigate(`/clans/${clan.slug}-${clan.id}`);
    setDialogOpen(false);
  };

  // ── Shared input style — dark enough to contrast against modal bg ──
  const inputCls = "bg-maxx-bg0/60 text-white  placeholder:text-maxx-violetLt/60 " +
                    "flex h-11 w-full rounded-md px-4 text-base transition-all duration-200";

  const ModalTitle = () => (
    <div>
      <div className="eyebrow mb-1.5">
        <span className="eyebrow-dot" />
        FORGE YOUR ALLIANCE
      </div>
      <h2 className="font-sans font-black text-[clamp(1.5rem,3vw,2rem)] uppercase tracking-tight text-maxx-white leading-none flex items-center gap-3">
        <div className="p-2 bg-maxx-violet/10 rounded-md border border-maxx-violet/20 shrink-0">
          <Swords className="w-5 h-5 text-maxx-violet" />
        </div>
        Create Clan
      </h2>
    </div>
  );

  return (
    <>
      {/* ── Trigger button ── */}
      <Button
        variant="primary"
        size="md"
        className="w-auto"
        onClick={() => setDialogOpen(true)}
      >
        <Plus className="w-4 h-4" />
        Create Clan
      </Button>

      <Modal
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        title={<ModalTitle />}
        description="Build your legacy. Every member that mints earns your clan SOL rewards."
        desktopClass="sm:max-w-[560px]"
      >
        <div className="space-y-6">
          <EnsureConnected>
            <form onSubmit={handleSubmit(processFormSubmit)} className="space-y-5">

              {/* ── Logo upload ── */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold tracking-wider uppercase text-maxx-mid block mb-2.5">
                  Clan Logo <span className="text-maxx-pink">*</span>
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
                      accept={{ "image/*": [".jpg", ".jpeg", ".webp", ".png", ".gif"] }}
                      enableCrop={true}
                      cropAspectRatio={1}
                      helperText="Recommended: 800×800px (1:1 Ratio)"
                      disabled={loading}
                    />
                  )}
                />
              </div>

              {/* ── Clan name ── */}
              <Input
                label="Clan Name"
                name="name"
                placeholder="e.g. The Pain Warriors"
                type="text"
                disabled={loading}
                className={inputCls}
                {...register("name", {
                  required: "Clan name is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                })}
                error={errors.name?.message}
              />

              {/* ── Category ── */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold tracking-wider uppercase text-maxx-mid block mb-2.5">
                  Category <span className="text-maxx-pink">*</span>
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
                      className={inputCls}
                      disabled={loading}
                      error={errors.category?.message}
                    />
                  )}
                />
                {errors.category && (
                  <div className="flex items-center gap-2 text-xs text-maxx-pink mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.category.message}</span>
                  </div>
                )}
              </div>

              {/* ── Tagline ── */}
              <Input
                label="Tagline"
                name="tagline"
                placeholder="e.g. Embrace the grind, unleash the gain"
                type="text"
                disabled={loading}
                className={inputCls}
                hint="Catchy slogan — 10 to 50 characters"
                {...register("tagline", {
                  required: "Tagline is required",
                  minLength: { value: 10, message: "Minimum 10 characters" },
                  maxLength: { value: 50, message: "Maximum 50 characters" },
                })}
                error={errors.tagline?.message}
              />

              {/* ── Description ── */}
              <Textarea
                label="Manifesto"
                name="description"
                placeholder="Tell the world what your clan stands for..."
                className={`min-h-[120px] ${inputCls}`}
                disabled={loading}
                {...register("description", {
                  required: "Description is required",
                  minLength: { value: 50, message: "Minimum 50 characters" },
                  maxLength: { value: 500, message: "Maximum 500 characters" },
                })}
                hint="50 – 500 characters"
                error={errors.description?.message}
              />

              {/* ── Social links (collapsible) ── */}
              <Collapsible
                open={socialOpen}
                onOpenChange={setSocialOpen}
                className="border border-maxx-violet/20 rounded-lg overflow-hidden"
              >
                {/* Trigger */}
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    disabled={loading}
                    className="w-full flex items-center justify-between px-4 py-3 bg-maxx-bg0/50 hover:bg-maxx-violet/5 transition-colors duration-200"
                  >
                    <span className="flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.14em] uppercase text-maxx-mid">
                      <Globe className="w-3.5 h-3.5 text-maxx-violet" />
                      Social Links
                      <span className="text-maxx-dim">(Optional)</span>
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-maxx-sub transition-transform duration-300 ${
                        socialOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </CollapsibleTrigger>

                {/* Content */}
                <CollapsibleContent className="animate-acc-open">
                  {/* Top accent line inside collapsible */}
                  <div className="h-px bg-gradient-to-r from-maxx-violet/30 via-maxx-pink/20 to-transparent" />

                  <div className="p-4 bg-maxx-bg0/30 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Twitter (X)"
                      name="x"
                      placeholder="@handle"
                      type="text"
                      disabled={loading}
                      className={inputCls}
                      {...register("x")}
                      error={errors.x?.message}
                    />
                    <Input
                      label="Telegram"
                      name="telegram"
                      placeholder="@username"
                      type="text"
                      disabled={loading}
                      className={inputCls}
                      {...register("telegram")}
                      error={errors.telegram?.message}
                    />
                    <Input
                      label="Discord"
                      name="discord"
                      placeholder="discord.gg/..."
                      type="text"
                      disabled={loading}
                      className={inputCls}
                      {...register("discord")}
                      error={errors.discord?.message}
                    />
                    <Input
                      label="Website"
                      name="website"
                      placeholder="https://..."
                      type="url"
                      disabled={loading}
                      className={inputCls}
                      {...register("website")}
                      error={errors.website?.message}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* ── Submit ── */}
              <div className="pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={loading}
                  loading={loading}
                  fullWidth
                >
                  {loading ? "Forging Alliance..." : "Create Clan"}
                </Button>
              </div>

            </form>
          </EnsureConnected>
        </div>
      </Modal>
    </>
  );
};

export default CreateClan;
