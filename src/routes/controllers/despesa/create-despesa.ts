import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export const createDespesa = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const createDespesaSchema = z.object({
            name: z.string().min(1, 'O nome é obrigatório'),
            description: z.string().optional(),
            valor: z.number().positive('O valor deve ser positivo'),
            data: z.string().datetime('Data inválida'),
            categoria: z.string().min(1, 'A categoria é obrigatória'),
            carteiraId: z.string().uuid('ID da carteira inválido')
        })

        const despesaData = createDespesaSchema.parse(request.body)

        // Verifica se a carteira existe
        const carteira = await prisma.carteira.findUnique({
            where: {
                id: despesaData.carteiraId
            }
        })

        if (!carteira) {
            return reply.status(404).send({ error: 'Carteira não encontrada' })
        }

        // Verifica se há saldo suficiente
        if (Number(carteira.balance) < despesaData.valor) {
            return reply.status(400).send({ error: 'Saldo insuficiente na carteira' })
        }

        // Cria a despesa e atualiza o saldo da carteira em uma transação
        const { despesa, carteira: carteiraAtualizada } = await prisma.$transaction(async (tx) => {
            const despesa = await tx.despesa.create({
                data: {
                    name: despesaData.name,
                    description: despesaData.description,
                    valor: despesaData.valor.toString(),
                    data: new Date(despesaData.data),
                    categoria: despesaData.categoria,
                    carteiraId: despesaData.carteiraId
                }
            })

            const novoSaldo = Number(carteira.balance) - despesaData.valor
            const carteiraAtualizada = await tx.carteira.update({
                where: { id: despesaData.carteiraId },
                data: { balance: novoSaldo.toString() }
            })

            return { despesa, carteira: carteiraAtualizada }
        })

        return reply.status(201).send({
            despesa: {
                id: despesa.id,
                name: despesa.name,
                description: despesa.description,
                valor: despesa.valor,
                data: despesa.data,
                categoria: despesa.categoria,
                carteiraId: despesa.carteiraId,
                created_at: despesa.created_at
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