INSTRUCCIONES PARA SUBIR A HOSTINGER (HPanel)
==============================================

1. Sube el contenido de la carpeta 'deploy' a tu servidor (vía FTP o el Administrador de Archivos de HPanel).
2. En HPanel, ve a la sección "Node.js".
3. Configura la aplicación con los siguientes parámetros:
   - App Directory: El directorio donde subiste los archivos (ej: public_html o una subcarpeta).
   - App Entry Point: server.js
   - Node.js version: Recomendado 18 o superior.
4. Crea el archivo .env definitivo dentro de la carpeta en el servidor basándote en .env.example.
5. Ejecuta el comando 'npm install' desde la terminal SSH o la herramienta de HPanel si está disponible.
6. Si necesitas regenerar la base de datos o aplicar migraciones en el servidor:
   npx prisma generate
   npx prisma migrate deploy
7. Inicia/Reinicia la aplicación desde el panel.

IMPORTANTE:
- Asegúrate de que la ruta de DATABASE_URL en el .env del servidor sea correcta.
- La carpeta 'uploads' debe tener permisos de escritura.
- El frontend ya está incluido en la carpeta 'public' y el servidor lo servirá automáticamente.
