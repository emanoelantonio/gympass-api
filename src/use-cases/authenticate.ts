import type { UsersRepository } from '@/repositories/users-repository';
import type { User } from '@prisma/client';
import { compare } from 'bcryptjs';
import { InvalidCredentailsErrors } from './errors/invalid-credentials-errors';

interface AuthenticateUseCaseRequest {
	email: string;
	password: string;
}

interface AuthenticateUseCaseResponse {
	user: User;
}

export class AuthenticateUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		password,
		email,
	}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new InvalidCredentailsErrors();
		}

		const doesPasswordMatches = await compare(password, user.password_hash);

		if (!doesPasswordMatches) {
			throw new InvalidCredentailsErrors();
		}

		return {
			user,
		};
	}
}
