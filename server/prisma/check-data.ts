import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const invitations = await prisma.digitalInvitation.findMany({
    include: { _count: { select: { guests: true } } }
  })
  
  console.log('--- RESUMEN DE INVITACIONES ---')
  invitations.forEach((inv, i) => {
    console.log(`${i+1}. [${inv.invitationType}] ${inv.title} - ${inv._count.guests} invitados`)
  })
}

main().finally(() => prisma.$disconnect())
