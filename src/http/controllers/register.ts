import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterUseCase } from '@/use-cases/register';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function register(request: FastifyRequest, replay: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
	});

	const { name, email, password } = registerBodySchema.parse(request.body);

	try {
		const prismaUsersRepository = new PrismaUsersRepository();
		const registerUseCase = new RegisterUseCase(prismaUsersRepository);

		await registerUseCase.execute({
			name,
			email,
			password,
		});
	} catch (error) {
		return replay.status(409).send();
	}

	return replay.status(201).send();
}
