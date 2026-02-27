#!/bin/bash
# ============================================================
# Studio Lumière — Setup del Backend
# ============================================================

echo "🎯 Studio Lumière — Iniciando setup del backend..."
echo ""

# 1. Instalar dependencias del frontend (react-router-dom)
echo "📦 Instalando dependencias del frontend..."
npm install
echo "✅ Frontend listo"
echo ""

# 2. Instalar dependencias del servidor
echo "📦 Instalando dependencias del servidor..."
cd server
npm install
echo "✅ Dependencias del servidor instaladas"
echo ""

# 3. Generar cliente Prisma
echo "🗄️  Generando cliente Prisma..."
npx prisma generate
echo "✅ Prisma generado"
echo ""

# 4. Crear la base de datos y aplicar migraciones
echo "🗄️  Creando base de datos..."
npx prisma migrate dev --name init
echo "✅ Base de datos creada"
echo ""

# 5. Sembrar datos iniciales
echo "🌱 Cargando datos iniciales..."
npx ts-node prisma/seed.ts
echo "✅ Datos cargados"
echo ""

echo "============================================================"
echo "🎉 Backend listo para usar!"
echo ""
echo "Para iniciar el servidor:"
echo "  cd server && npm run dev"
echo ""
echo "Para iniciar el frontend (en otra terminal):"
echo "  npm run dev  (desde la raíz)"
echo ""
echo "Credenciales:"
echo "  Admin:   admin@studiolumiere.mx / Admin123!"
echo "  Cliente: cliente@ejemplo.mx / Cliente123!"
echo "============================================================"
