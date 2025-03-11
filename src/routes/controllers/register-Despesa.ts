import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export const registerDespesa = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const paramsRegister = z.object({
            name: z.string().min(1, 'O nome é obrigatório'),
            valor: z.number().positive('O valor deve ser positivo'),
            description: z.string().optional(),
            recorrente: z.boolean().default(false),
            frequencia: z.enum(['SEMANAL', 'MENSAL', 'ANUAL']).optional().default('MENSAL'),
            carteiraId: z.string().uuid('ID da carteira inválido')
        })

        const { name, valor, description, recorrente, frequencia, carteiraId } = paramsRegister.parse(request.body)

        // Verifica se a carteira existe
        const carteira = await prisma.carteira.findUnique({
            where: {
                id: carteiraId
            }
        })

        if (!carteira) {
            return reply.status(404).send({ error: 'Carteira não encontrada' })
        }

        // Cria a despesa
        const despesa = await prisma.despesa.create({
            data: {
                name,
                valor,
                description,
                recorrente,
                frequencia,
                carteiraId
            }
        })

        return reply.status(201).send({
            despesa: {
                id: despesa.id,
                name: despesa.name,
                valor: despesa.valor,
                description: despesa.description,
                recorrente: despesa.recorrente,
                frequencia: despesa.frequencia,
                carteiraId: despesa.carteiraId,
                created_at: despesa.created_at
            }
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }

        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
}