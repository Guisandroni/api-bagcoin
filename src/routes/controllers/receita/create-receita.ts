import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export const createReceita = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const createReceitaSchema = z.object({
            name: z.string().min(1, 'O nome é obrigatório'),
            description: z.string().optional(),
            valor: z.number().positive('O valor deve ser positivo'),
            data: z.string().datetime('Data inválida'),
            categoria: z.string().min(1, 'A categoria é obrigatória'),
            carteiraId: z.string().uuid('ID da carteira inválido')
        })

        const receitaData = createReceitaSchema.parse(request.body)

        // Verifica se a carteira existe
        const carteira = await prisma.carteira.findUnique({
            where: {
                id: receitaData.carteiraId
            }
        })

        if (!carteira) {
            return reply.status(404).send({ error: 'Carteira não encontrada' })
        }

        // Cria a receita e atualiza o saldo da carteira em uma transação
        const { receita, carteira: carteiraAtualizada } = await prisma.$transaction(async (tx) => {
            const receita = await tx.receita.create({
                data: {
                    name: receitaData.name,
                    description: receitaData.description,
                    valor: receitaData.valor.toString(),
                    data: new Date(receitaData.data),
                    categoria: receitaData.categoria,
                    carteiraId: receitaData.carteiraId
                }
            })

            const novoSaldo = Number(carteira.balance) + receitaData.valor
            const carteiraAtualizada = await tx.carteira.update({
                where: { id: receitaData.carteiraId },
                data: { balance: novoSaldo.toString() }
            })

            return { receita, carteira: carteiraAtualizada }
        })

        return reply.status(201).send({
            receita: {
                id: receita.id,
                name: receita.name,
                description: receita.description,
                valor: receita.valor,
                data: receita.data,
                categoria: receita.categoria,
                carteiraId: receita.carteiraId,
                created_at: receita.created_at
            },
            carteira: {
                id: carteiraAtualizada.id,
                balance: carteiraAtualizada.balance
            }
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
} 