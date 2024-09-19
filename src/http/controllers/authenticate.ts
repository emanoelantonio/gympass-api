import { InvalidCredentailsErrors } from '@/use-cases/errors/invalid-credentials-errors';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function authenticate(
	request: FastifyRequest,
	replay: FastifyReply
) {
	const autheticateBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	});

	const { email, password } = autheticateBodySchema.parse(request.body);

	try {
		const authenticateUseCase = makeAuthenticateUseCase();

		await authenticateUseCase.execute({
			email,
			password,
		});
	} catch (error) {
		if (error instanceof InvalidCredentailsErrors) {
			return replay.status(400).send({ message: error.message });
		}
		throw error;
	}

	return replay.status(200).send();
}
