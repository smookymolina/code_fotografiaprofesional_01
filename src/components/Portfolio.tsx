import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from './useInView'
import Lightbox from './Lightbox'

const categories = ['Todos', 'Bodas', 'Corporativo', 'Retratos', 'Quince Años', 'Graduaciones', 'Social']

const photos = [
  { id: 1, title: 'Amor en el Jardín', category: 'Bodas', bgClass: 'photo-placeholder-warm', aspect: 'portrait' },
  { id: 2, title: 'Congreso de Liderazgo', category: 'Corporativo', bgClass: 'photo-placeholder-cool', aspect: 'landscape' },
  { id: 3, title: 'Sesión Retratos', category: 'Retratos', bgClass: 'photo-placeholder-neutral', aspect: 'portrait' },
  { id: 4, title: 'Quince Años Temáticos', category: 'Quince Años', bgClass: 'photo-placeholder-amber', aspect: 'square' },
  { id: 5, title: 'Ceremonia al Atardecer', category: 'Bodas', bgClass: 'photo-placeholder-rose', aspect: 'landscape' },
  { id: 6, title: 'Graduación UNAM', category: 'Graduaciones', bgClass: 'photo-placeholder-cool', aspect: 'portrait' },
  { id: 7, title: 'Team Building Corporativo', category: 'Corporativo', bgClass: 'photo-placeholder-neutral', aspect: 'square' },
  { id: 8, title: 'Retratos Estudio', category: 'Retratos', bgClass: 'photo-placeholder-amber', aspect: 'portrait' },
  { id: 9, title: 'Festejo Social', category: 'Social', bgClass: 'photo-placeholder-warm', aspect: 'landscape' },
  { id: 10, title: 'Boda en Hacienda', category: 'Bodas', bgClass: 'photo-placeholder-rose', aspect: 'portrait' },
  { id: 11, title: 'XV Años Versalles', category: 'Quince Años', bgClass: 'photo-placeholder-neutral', aspect: 'landscape' },
  { id: 12, title: 'Cóctel Empresarial', category: 'Social', bgClass: 'photo-placeholder-cool', aspect: 'square' },
]

const aspectHeight: Record<string, string> = {
  portrait: 'h-80',
  landscape: 'h-52',
  square: 'h-64',
}

export default function Portfolio() {
  const { ref, inView } = useInView()
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const filtered = activeFilter === 'Todos'
    ? photos
    : photos.filter(p => p.category === activeFilter)

  const openLightbox = (id: number) => {
    const idx = filtered.findIndex(p => p.id === id)
    setLightboxIdx(idx)
  }

  return (
    <section
      id="portfolio"
      className="section-padding bg-[#0A0A0A]"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="label-caps text-gold mb-4">Selección</p>
          <div className="flex items-end gap-6 mb-3">
            <h2 className="font-cormorant text-fluid-section text-ivory font-light">Portfolio</h2>
          </div>
          <p className="font-cormorant italic text-ivory/40 text-xl">Trabajos Recientes</p>
          <div className="gold-line mt-5" />
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-2 mb-12 overflow-x-auto pb-2 scrollbar-hide"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`flex-shrink-0 px-4 py-2 text-xs font-dm font-medium tracking-widest uppercase transition-all duration-300 border ${
                activeFilter === cat
                  ? 'bg-gold border-gold text-black'
                  : 'border-ivory/15 text-ivory/50 hover:border-ivory/40 hover:text-ivory'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="masonry-grid"
          >
            {filtered.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="masonry-item gallery-item group relative overflow-hidden cursor-crosshair"
                onClick={() => openLightbox(photo.id)}
              >
                <div
                  className={`w-full ${aspectHeight[photo.aspect]} ${photo.bgClass} relative overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]`}
                >
                  {/* Bokeh effect */}
                  <div
                    className="absolute bottom-1/4 right-1/4 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle, rgba(201,169,110,0.2) 0%, transparent 70%)',
                      filter: 'blur(20px)',
                    }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="label-caps text-[0.55rem] text-gold bg-black/60 backdrop-blur-sm px-2 py-1">
                      {photo.category}
                    </span>
                  </div>
                  {/* Title on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    <p className="font-cormorant text-ivory text-lg italic">{photo.title}</p>
                    <p className="label-caps text-gold/70 text-[0.55rem] mt-1">Ver más →</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Load more */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-14"
        >
          <button className="btn-outline">Cargar más trabajos</button>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            photos={filtered}
            index={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
            onPrev={() => setLightboxIdx(i => Math.max(0, (i ?? 0) - 1))}
            onNext={() => setLightboxIdx(i => Math.min(filtered.length - 1, (i ?? 0) + 1))}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
