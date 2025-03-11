import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export async function deleteMeta(request: FastifyRequest, reply: FastifyReply) {
  try {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const meta = await prisma.meta.findUnique({
      where: { id },
    })

    if (!meta) {
      return reply.status(404).send({ message: 'Meta não encontrada' })
    }

    await prisma.meta.delete({
      where: { id },
    })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ message: 'Erro de validação', issues: error.format() })
    }

    console.error(error)
    return reply.status(500).send({ message: 'Erro interno do servidor' })
  }
} 