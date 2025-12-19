import { useState, useCallback } from "react"
import Cropper, { Area } from "react-easy-crop"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface ImageCropperProps {
  image: string
  originalFile?: File // Make it optional
  onCropComplete: (croppedImage: File) => void
  onCancel: () => void
  aspectRatio?: number
}

export function ImageCropper({ 
  image,
  originalFile,
  onCropComplete, 
  onCancel,
  aspectRatio = 1
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const onCropAreaComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) return

    const canvas = document.createElement('canvas')
    const img = new Image()
    img.src = image

    await new Promise((resolve) => {
      img.onload = resolve
    })

    const scaleX = img.naturalWidth / img.width
    const scaleY = img.naturalHeight / img.height

    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(
      img,
      croppedAreaPixels.x * scaleX,
      croppedAreaPixels.y * scaleY,
      croppedAreaPixels.width * scaleX,
      croppedAreaPixels.height * scaleY,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    )

    // Use original file info or fallback to defaults
    const fileName = originalFile?.name || 'cropped-image.png'
    const fileType = originalFile?.type || 'image/png'

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return
        const file = new File([blob], fileName, { 
          type: fileType,
          lastModified: Date.now()
        })
        resolve(file)
      }, fileType, 0.9)
    })
  }

  const handleCrop = async () => {
    const croppedImage = await createCroppedImage()
    if (croppedImage) {
      onCropComplete(croppedImage)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        
        <div className="relative h-[400px] w-full bg-black">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaComplete}
          />
        </div>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Zoom</label>
            <Slider
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              min={1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleCrop}>
            Crop Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}