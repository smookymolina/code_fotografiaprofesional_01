import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Iniciando generación de invitaciones de prueba...')

  const client = await prisma.user.findUnique({
    where: { email: 'cliente@ejemplo.mx' }
  })

  if (!client) {
    console.error('❌ No se encontró el cliente de prueba. Ejecuta el seed primero.')
    return
  }

  const clientId = client.id

  // --- 5 INVITACIONES GENERALES ---
  const generalEvents = [
    { title: 'Boda Real: Victoria & Alejandro', type: 'Boda', names: 'Victoria y Alejandro' },
    { title: 'XV Años de Sofía', type: 'XV Años', names: 'Sofía Martínez' },
    { title: 'Graduación Generación 2024', type: 'Graduación', names: 'Facultad de Ingeniería' },
    { title: 'Bautizo de Mateo', type: 'Bautizo', names: 'Mateo González' },
    { title: 'Cena de Gala Corporativa', type: 'Corporativo', names: 'TechCorp S.A.' }
  ]

  for (let i = 0; i < generalEvents.length; i++) {
    const event = generalEvents[i]
    const inv = await prisma.digitalInvitation.create({
      data: {
        clientId,
        eventType: event.type,
        title: event.title,
        names: event.names,
        eventDate: '2025-10-15',
        eventTime: '18:00',
        venue: 'Hacienda Los Morales',
        invitationType: 'general',
        template: 'elegante',
        isPublished: true,
        guests: {
          create: [
            { name: 'Familia García' },
            { name: 'Dr. Roberto Mendoza' },
            { name: 'Sra. Elena Torres' }
          ]
        }
      }
    })
    console.log(`✅ Creada Invitación General ${i + 1}: ${inv.title}`)
  }

  // --- 5 INVITACIONES PERSONALIZADAS ---
  const personalEvents = [
    { title: 'Nuestra Boda - Pase Especial', type: 'Boda', names: 'Ana & Luis' },
    { title: 'Mis XV - Invitación Personalizada', type: 'XV Años', names: 'Valentina' },
    { title: 'Cumpleaños 30 de Carlos', type: 'Cumpleaños', names: 'Carlos Ruiz' },
    { title: 'Aniversario de Plata', type: 'Aniversario', names: 'Familia Ramírez' },
    { title: 'Baby Shower de Lucía', type: 'Baby Shower', names: 'Lucía y Ricardo' }
  ]

  const customMessages = [
    'Eres una persona muy especial para nosotros, nos encantaría verte ahí.',
    '¡No puedes faltar a mi gran noche!',
    '¡Ven a celebrar mis 30 años con mucha fiesta!',
    'Gracias por ser parte de nuestra historia durante 25 años.',
    'Te esperamos para celebrar la llegada de nuestro pequeño.'
  ]

  for (let i = 0; i < personalEvents.length; i++) {
    const event = personalEvents[i]
    const inv = await prisma.digitalInvitation.create({
      data: {
        clientId,
        eventType: event.type,
        title: event.title,
        names: event.names,
        eventDate: '2025-12-20',
        eventTime: '20:00',
        venue: 'Jardín Las Flores',
        invitationType: 'individual',
        template: 'moderno',
        isPublished: true,
        guests: {
          create: [
            { name: 'Tío Juan', personalizedMessage: customMessages[i] },
            { name: 'Mejor Amigo Dani', personalizedMessage: `¡Ey Dani! ${customMessages[i]}` }
          ]
        }
      }
    })
    console.log(`✅ Creada Invitación Personalizada ${i + 1}: ${inv.title}`)
  }

  console.log('\n✨ ¡Generación completada con éxito!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
