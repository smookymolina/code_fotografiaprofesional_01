import { motion } from 'framer-motion'
import { useInView } from './useInView'
import { ArrowRight, MapPin } from 'lucide-react'

const events = [
  {
    year: '2024',
    title: 'Boda en Jardín',
    venue: 'Hacienda San Rafael',
    type: 'Bodas',
    description: 'Una ceremonia íntima al atardecer entre jardines históricos. Cada detalle capturado con luz natural.',
    bgClass: 'photo-placeholder-warm',
  },
  {
    year: '2024',
    title: 'Evento Corporativo',
    venue: 'Torre Mayor CDMX',
    type: 'Corporativo',
    description: 'Lanzamiento de producto con 500+ asistentes. Cobertura completa en tiempo real para redes sociales.',
    bgClass: 'photo-placeholder-cool',
  },
  {
    year: '2024',
    title: 'XV Años Temáticos',
    venue: 'Salón Versalles',
    type: 'Quince Años',
    description: 'Temática París años 50. Decoración única y momentos irrepetibles de la festejada con su familia.',
    bgClass: 'photo-placeholder-rose',
  },
  {
    year: '2023',
    title: 'Graduación Universitaria',
    venue: 'Auditorio UNAM',
    type: 'Graduaciones',
    description: 'Generación 2023 en el auditorio más icónico de México. Fotos grupales y retratos individuales.',
    bgClass: 'photo-placeholder-neutral',
  },
  {
    year: '2023',
    title: 'Congreso Empresarial',
    venue: 'WTC México',
    type: 'Corporativo',
    description: 'Keynote speakers internacionales, stands y actividades. Entrega de 800+ imágenes en 48 horas.',
    bgClass: 'photo-placeholder-amber',
  },
  {
    year: '2023',
    title: 'Sesión Editorial',
    venue: 'Estudio Propio',
    type: 'Editorial',
    description: 'Campaña de moda para marca local. Dirección de arte, estilismo y fotografía en estudio controlado.',
    bgClass: 'photo-placeholder-cool',
  },
]

export default function Events() {
  const { ref, inView } = useInView()

  return (
    <section
      id="eventos"
      className="section-padding bg-black overflow-hidden"
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
          <p className="label-caps text-gold mb-4">Nuestro Trabajo</p>
          <h2 className="font-cormorant text-fluid-section text-ivory font-light mb-2">
            Eventos Realizados
          </h2>
          <p className="font-cormorant italic text-ivory/40 text-xl">
            Momentos que hemos inmortalizado
          </p>
          <div className="gold-line mt-5" />
        </motion.div>

        {/* Horizontal scroll on desktop / vertical on mobile */}
        <div className="lg:overflow-x-auto lg:pb-6">
          <div className="flex flex-col lg:flex-row gap-5 lg:w-max">
            {events.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, x: 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group lg:w-[340px] flex-shrink-0 relative overflow-hidden"
              >
                {/* Image placeholder */}
                <div className={`w-full h-52 lg:h-48 ${event.bgClass} relative overflow-hidden`}>
                  {/* Bokeh inner */}
                  <div
                    className="absolute top-1/3 left-1/3 w-24 h-24 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%)',
                      filter: 'blur(24px)',
                    }}
                  />
                  {/* Year badge */}
                  <div className="absolute top-3 left-3">
                    <span className="font-cormorant text-gold text-2xl font-light">{event.year}</span>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-500 flex items-center justify-center">
                    <p className="font-cormorant italic text-ivory text-base px-6 text-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-400">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Card body */}
                <div className="bg-[#111111] p-5 border border-ivory/6 group-hover:border-gold/20 transition-colors duration-400">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-cormorant text-ivory text-xl font-light">{event.title}</h3>
                    <ArrowRight className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 mt-1" />
                  </div>
                  <div className="flex items-center gap-1.5 text-ivory/40 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="font-dm text-xs">{event.venue}</span>
                  </div>
                  <span className="label-caps text-[0.55rem] text-gold/70 bg-gold/10 px-2 py-1">
                    {event.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 flex items-center gap-3"
        >
          <button className="nav-link text-ivory/60 hover:text-gold flex items-center gap-2 font-dm">
            Ver todos los eventos
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
