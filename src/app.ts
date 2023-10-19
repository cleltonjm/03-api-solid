import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

export const app = fastify()

const prisma =  new PrismaClient()

prisma.user.create({
    data: {
        name: 'Clelton José Mielke',
        email: 'cleltonjm_95@hotmail.com'
    }
})