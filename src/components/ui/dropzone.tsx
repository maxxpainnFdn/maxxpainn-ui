import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { X, Upload, File, Image as ImageIcon, FileType, HardDrive } from "lucide-react"
import { useState } from "react"
import { ImageCropper } from "./image-cropper"

interface DropzoneProps {
  onChange: (files: File[]) => void
  value?: File[]
  error?: string
  maxFiles?: number
  maxSize?: number
  accept?: Record<string, string[]>
  disabled?: boolean
  className?: string
  helperText?: string
  enableCrop?: boolean
  cropAspectRatio?: number
}

function Dropzone({
  onChange,
  value = [],
  error,
  maxFiles = 1,
  maxSize = 5242880,
  accept,
  disabled = false,
  className,
  helperText,
  enableCrop = false,
  cropAspectRatio = 1,
}: DropzoneProps) {
  const [imageToCrop, setImageToCrop]   = useState<string | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } =
    useDropzone({
      onDrop: (acceptedFiles) => {
        if (enableCrop && acceptedFiles.length > 0 && acceptedFiles[0].type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = () => {
            setImageToCrop(reader.result as string)
            setOriginalFile(acceptedFiles[0])
          }
          reader.readAsDataURL(acceptedFiles[0])
        } else {
          onChange(acceptedFiles)
        }
      },
      maxFiles,
      maxSize,
      accept,
      disabled,
    })

  const handleCropComplete = (croppedFile: File) => {
    onChange([croppedFile])
    setImageToCrop(null)
    setOriginalFile(null)
  }

  const handleCropCancel = () => {
    setImageToCrop(null)
    setOriginalFile(null)
  }

  const removeFile = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k     = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i     = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const getAcceptedFileTypes = () => {
    if (!accept) return "All types"
    return Object.values(accept).flat().map((e) => e.toUpperCase()).join(", ")
  }

  return (
    <>
      <div className={cn("w-full", className)}>

        {/* ── Drop zone ── */}
        <div
          {...getRootProps()}
          className={cn(
            "relative flex flex-col items-center justify-center w-full min-h-[160px]",
            "border border-dashed rounded-lg cursor-pointer",
            "transition-all duration-200 overflow-hidden group",
            // Default
            !isDragActive && !error && !isDragReject &&
              "border-maxx-violet/25 bg-maxx-bg0/50 hover:border-maxx-violet/50 hover:bg-maxx-violet/5",
            // Drag active
            isDragActive && !isDragReject &&
              "border-maxx-violet/60 bg-maxx-violet/8 scale-[1.01]",
            // Drag reject
            isDragReject &&
              "border-maxx-pink/50 bg-maxx-pink/5",
            // Validation error
            error && !isDragActive &&
              "border-maxx-pink/30 bg-maxx-pink/5",
            // Disabled
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <input {...getInputProps()} />

          {/* Hover shimmer */}
          <div className="absolute inset-0 bg-gradient-to-br from-maxx-violet/5 via-transparent to-maxx-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <div className="relative text-center px-6 py-8">
            {value.length > 0 ? (
              /* ── Has file ── */
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-md bg-gradient-to-br from-maxx-violet to-maxx-pink shadow-[0_0_20px_color-mix(in_srgb,var(--maxx-violet)_30%,transparent)]">
                  <ImageIcon className="w-6 h-6 text-maxx-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-maxx-white mb-0.5">
                    {value.length} file{value.length > 1 ? "s" : ""} selected
                  </p>
                  <p className="text-xs text-maxx-sub">Click to change or drag to replace</p>
                </div>
              </div>
            ) : (
              /* ── Empty ── */
              <div className="flex flex-col items-center gap-3">
                <div className={cn(
                  "p-3 rounded-md transition-all duration-200",
                  isDragActive
                    ? "bg-gradient-to-br from-maxx-violet to-maxx-pink shadow-[0_0_20px_color-mix(in_srgb,var(--maxx-violet)_30%,transparent)] scale-110"
                    : "bg-maxx-violet/10 border border-maxx-violet/20 group-hover:bg-gradient-to-br group-hover:from-maxx-violet group-hover:to-maxx-pink group-hover:border-transparent group-hover:shadow-[0_0_20px_color-mix(in_srgb,var(--maxx-violet)_25%,transparent)]"
                )}>
                  <Upload className={cn(
                    "w-6 h-6 transition-colors duration-200",
                    isDragActive ? "text-maxx-white" : "text-maxx-violet group-hover:text-maxx-white"
                  )} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-maxx-mid group-hover:text-maxx-bright transition-colors mb-2">
                    {isDragActive
                      ? isDragReject
                        ? "File type not accepted"
                        : "Drop your file here"
                      : "Drag & drop or click to upload"}
                  </p>

                  {/* File type + size pills */}
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-maxx-bg0/80 rounded border border-maxx-violet/15">
                      <FileType className="w-3 h-3 text-maxx-violet" />
                      <span className="text-[0.65rem] font-mono font-semibold text-maxx-sub tracking-wide">
                        {getAcceptedFileTypes()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-maxx-bg0/80 rounded border border-maxx-pink/15">
                      <HardDrive className="w-3 h-3 text-maxx-pink" />
                      <span className="text-[0.65rem] font-mono font-semibold text-maxx-sub tracking-wide">
                        Max {formatFileSize(maxSize)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Helper text ── */}
        {helperText && !error && (
          <p className="mt-2 text-xs text-maxx-sub flex items-start gap-1.5">
            <span className="inline-block w-1 h-1 rounded-sm bg-maxx-violet mt-[5px] shrink-0" />
            <span>{helperText}</span>
          </p>
        )}

        {/* ── File rejection errors ── */}
        {fileRejections.length > 0 && (
          <div className="mt-3 space-y-2">
            {fileRejections.map(({ file, errors: errs }, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-xs text-maxx-pink bg-maxx-pink/5 border border-maxx-pink/20 rounded-md p-3"
              >
                <X className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5">{file.name}</span>
                  <span className="text-maxx-pink/70">{errs.map((e) => e.message).join(", ")}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Selected files list ── */}
        {value.length > 0 && (
          <div className="mt-3 space-y-2">
            {value.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-maxx-bg0/60 rounded-md border border-maxx-violet/15 hover:border-maxx-violet/30 transition-all duration-200 group"
              >
                {/* Icon */}
                <div className="p-2 rounded bg-gradient-to-br from-maxx-violet to-maxx-pink shrink-0">
                  {file.type.startsWith("image/")
                    ? <ImageIcon className="w-4 h-4 text-maxx-white" />
                    : <File className="w-4 h-4 text-maxx-white" />
                  }
                </div>

                {/* File info */}
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold text-maxx-bright truncate" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[0.65rem] font-mono text-maxx-sub flex items-center gap-1">
                      <HardDrive className="w-2.5 h-2.5" />
                      {formatFileSize(file.size)}
                    </span>
                    <span className="text-maxx-dim text-xs">·</span>
                    <span className="text-[0.65rem] font-mono text-maxx-sub uppercase">
                      {file.type.split("/")[1] || "file"}
                    </span>
                  </div>
                </div>

                {/* Remove button */}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeFile(index) }}
                    className="p-1.5 rounded border border-maxx-violet/15 bg-maxx-bg0/50 hover:bg-maxx-pink/10 hover:border-maxx-pink/30 transition-all duration-200 shrink-0"
                  >
                    <X className="w-3.5 h-3.5 text-maxx-sub hover:text-maxx-pink transition-colors" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Validation error ── */}
        {error && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-maxx-pink">
            <span className="w-1 h-1 rounded-sm bg-maxx-pink animate-pulse shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

      </div>

      {/* ── Image cropper modal ── */}
      {imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          originalFile={originalFile || undefined}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={cropAspectRatio}
        />
      )}
    </>
  )
}

export default Dropzone
