const { PrismaClient } = require('../src/generated/prisma')

const prisma = new PrismaClient()

async function addAdminUser() {
    try {
        console.log('Adding admin user...')
        
        const admin = await prisma.user.upsert({
            where: { email: 'admin@example.com' },
            update: {
                role: 'ADMIN',
                firstName: 'Admin',
                lastName: 'User',
            },
            create: {
                id: 'admin_user_001',
                email: 'admin@example.com',
                firstName: 'Admin',
                lastName: 'User',
                role: 'ADMIN',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        })

        console.log('Admin user created/updated:', admin)
        console.log('\n======================')
        console.log('Admin Credentials:')
        console.log('Email: admin@example.com')
        console.log('Password: admin123')
        console.log('======================\n')
    } catch (error) {
        console.error('Error adding admin user:', error)
    } finally {
        await prisma.$disconnect()
    }
}

addAdminUser()
