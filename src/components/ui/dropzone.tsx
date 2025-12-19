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
  cropAspectRatio = 1
}: DropzoneProps) {
  const [imageToCrop, setImageToCrop] = useState<string | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (enableCrop && acceptedFiles.length > 0 && acceptedFiles[0].type.startsWith('image/')) {
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
    disabled
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
    const newFiles = value.filter((_, i) => i !== index)
    onChange(newFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getAcceptedFileTypes = () => {
    if (!accept) return "All file types"
    const extensions = Object.values(accept).flat()
    return extensions.map(ext => ext.toUpperCase()).join(', ')
  }

  return (
    <>
      <div className={cn("w-full", className)}>
        <div
          {...getRootProps()}
          className={cn(
            "relative flex flex-col items-center justify-center w-full min-h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden group",
            isDragActive && !isDragReject && "border-purple-500 bg-purple-500/10",
            isDragReject && "border-red-500 bg-red-500/10",
            !isDragActive && !error && "border-gray-700/50 bg-gray-800/40 hover:border-purple-500/50 hover:bg-gray-800/60",
            error && "border-red-500/50 bg-red-500/5",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()}  />

          {/* Background gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative text-center p-8">
            {value.length > 0 ? (
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-base font-bold text-white mb-1">
                    {value.length} file selected
                  </p>
                  <p className="text-sm text-gray-400">
                    Click to change or drag to replace
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className={cn(
                  "p-4 rounded-2xl transition-all duration-300",
                  isDragActive
                    ? "bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50 scale-110"
                    : "bg-gray-700/50 group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-pink-600 group-hover:shadow-lg group-hover:shadow-purple-500/50"
                )}>
                  <Upload className={cn(
                    "w-8 h-8 transition-colors",
                    isDragActive ? "text-white" : "text-gray-400 group-hover:text-white"
                  )} />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-200 group-hover:text-white transition-colors mb-2">
                    {isDragActive
                      ? isDragReject
                        ? "File type not accepted"
                        : "Drop your file here"
                      : "Drag & drop or click to upload"}
                  </p>

                  {/* File Type and Size Info */}
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/80 rounded-lg border border-gray-700/50">
                      <FileType className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-xs font-semibold text-gray-300">
                        {getAcceptedFileTypes()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/80 rounded-lg border border-gray-700/50">
                      <HardDrive className="w-3.5 h-3.5 text-pink-400" />
                      <span className="text-xs font-semibold text-gray-300">
                        Max {formatFileSize(maxSize)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Helper Text */}
        {helperText && !error && (
          <div className="mt-3 flex items-start gap-2 px-1">
            <span className="inline-block w-1 h-1 rounded-full bg-purple-500 mt-1.5" />
            <p className="text-xs text-gray-400 leading-relaxed">{helperText}</p>
          </div>
        )}

        {/* File Rejection Errors */}
        {fileRejections.length > 0 && (
          <div className="mt-3 space-y-2">
            {fileRejections.map(({ file, errors }, index) => (
              <div key={index} className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">{file.name}</span>
                  <span className="text-red-300/80">{errors.map(e => e.message).join(", ")}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Files List */}
        {value.length > 0 && (
          <div className="mt-4 space-y-3">
            {value.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 p-4 bg-gray-800/60 backdrop-blur-sm rounded-2xl border-2 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg flex-shrink-0">
                    {file.type.startsWith('image/') ? (
                      <ImageIcon className="w-5 h-5 text-white" />
                    ) : (
                      <File className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-white truncate mb-1" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        {formatFileSize(file.size)}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400 font-semibold uppercase">
                        {file.type.split('/')[1] || 'file'}
                      </span>
                    </div>
                  </div>
                </div>
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    className="p-2 rounded-lg bg-gray-700/50 hover:bg-red-500/20 border border-gray-600/50 hover:border-red-500/50 transition-all duration-300 flex-shrink-0 group/btn"
                  >
                    <X className="w-4 h-4 text-gray-400 group-hover/btn:text-red-400 transition-colors" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Validation Error */}
        {error && (
          <div className="mt-3 flex items-start gap-2 text-sm text-red-400 font-medium bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mt-1.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Image Cropper Modal */}
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
