#!/bin/sh
set -e

echo "Pushing database schema..."
npx prisma db push --accept-data-loss

# Create admin user on first boot if ADMIN_EMAIL and ADMIN_PASSWORD are set
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
  echo "Checking for admin user..."
  node -e "
    const { PrismaClient } = require('@prisma/client');
    const bcrypt = require('bcryptjs');
    const prisma = new PrismaClient();
    (async () => {
      const existing = await prisma.user.findUnique({ where: { email: process.env.ADMIN_EMAIL } });
      if (!existing) {
        const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        await prisma.user.create({
          data: {
            email: process.env.ADMIN_EMAIL,
            name: process.env.ADMIN_NAME || 'Head Coach',
            password: hashed,
            role: 'HEAD_COACH',
          },
        });
        console.log('Admin user created: ' + process.env.ADMIN_EMAIL);

        // Create team config if TEAM_NAME is set
        if (process.env.TEAM_NAME) {
          const existingConfig = await prisma.teamConfig.findUnique({ where: { id: 'default' } });
          if (!existingConfig) {
            await prisma.teamConfig.create({
              data: {
                id: 'default',
                teamName: process.env.TEAM_NAME,
                season: new Date().getFullYear().toString(),
                colors: [],
              },
            });
            console.log('Team config created: ' + process.env.TEAM_NAME);
          }
        }
      } else {
        console.log('Admin user already exists, skipping.');
      }
      await prisma.\$disconnect();
    })().catch(e => { console.error('Admin setup error:', e); process.exit(0); });
  "
fi

echo "Switching to nextjs user and starting application..."
exec su-exec nextjs node server.js
