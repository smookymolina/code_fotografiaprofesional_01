import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface LightboxPhoto {
  id: number
  title: string
  category: string
  bgClass: string
  aspect: string
}

interface LightboxProps {
  photos: LightboxPhoto[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({ photos, index, onClose, onPrev, onNext }: LightboxProps) {
  const photo = photos[index]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  // Touch swipe
  let startX = 0
  const onTouchStart = (e: React.TouchEvent) => { startX = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX
    if (Math.abs(dx) > 50) dx < 0 ? onNext() : onPrev()
  }

  return (
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Close */}
      <button
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-ivory/70 hover:text-ivory transition-colors z-10"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev */}
      <button
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-ivory/60 hover:text-ivory transition-colors z-10"
        onClick={e => { e.stopPropagation(); onPrev() }}
        aria-label="Previous"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      {/* Next */}
      <button
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-ivory/60 hover:text-ivory transition-colors z-10"
        onClick={e => { e.stopPropagation(); onNext() }}
        aria-label="Next"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Image */}
      <motion.div
        key={index}
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-[90vw] max-h-[75vh] w-full"
        onClick={e => e.stopPropagation()}
      >
        <div
          className={`w-full ${photo.aspect === 'portrait' ? 'h-[65vh]' : photo.aspect === 'square' ? 'h-[55vh]' : 'h-[45vh]'} ${photo.bgClass} rounded-sm relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </motion.div>

      {/* Caption */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="font-cormorant italic text-ivory/80 text-lg">{photo.title}</p>
        <p className="label-caps text-gold text-[0.6rem] mt-1">{photo.category}</p>
        <p className="label-caps text-ivory/30 text-[0.55rem] mt-2">{index + 1} / {photos.length}</p>
      </div>
    </motion.div>
  )
}
