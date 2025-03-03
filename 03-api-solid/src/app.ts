import fastify  from 'fastify'
import { PrismaClient } from '@prisma/client'

export const app = fastify()

const prisma = new PrismaClient()

prisma.user.create({
    data: {
        name: 'Clelton Jose Mielke',
        email: 'cleltonjm_95@hotmail.com',
    },
})

// ORM - Object Relational Mapper