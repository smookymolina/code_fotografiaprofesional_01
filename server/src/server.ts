import 'dotenv/config'
import app from './app'
import { startArchivalWorkflow } from './services/archivalService'
import prisma from './utils/prisma'

const PORT = Number(process.env.PORT) || 3001

async function main() {
  // Activa WAL mode en SQLite para soportar lecturas concurrentes durante
  // escrituras, y busy_timeout para reintentar automáticamente en vez de
  // fallar de inmediato cuando la DB está ocupada.
  await prisma.$executeRawUnsafe('PRAGMA journal_mode=WAL;')
  await prisma.$executeRawUnsafe('PRAGMA busy_timeout=5000;')

  const stopArchivalWorkflow = startArchivalWorkflow()

  const server = app.listen(PORT, () => {
    console.log(`\n🎯 Pedro Vargas Fotografía API`)
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`)
    console.log(`📡 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
    console.log(`📋 Health: http://localhost:${PORT}/api/health\n`)
  })

  process.on('SIGTERM', () => {
    console.log('SIGTERM recibido. Cerrando servidor...')
    stopArchivalWorkflow()
    server.close(async () => {
      await prisma.$disconnect()
      console.log('Servidor cerrado.')
      process.exit(0)
    })
  })

  process.on('unhandledRejection', (reason) => {
    console.error('Promesa rechazada sin manejar:', reason)
  })
}

main().catch((err) => {
  console.error('Error crítico al iniciar el servidor:', err)
  process.exit(1)
})
