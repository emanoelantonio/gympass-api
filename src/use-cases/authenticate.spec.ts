import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentailsErrors } from './errors/invalid-credentials-errors';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateUseCase(usersRepository);
	});

	it('should be able to authenticate', async () => {
		await usersRepository.create({
			name: 'Gandalf White',
			email: 'gandalf.white@email.com',
			password_hash: await hash('654321', 6),
		});

		const { user } = await sut.execute({
			email: 'gandalf.white@email.com',
			password: '654321',
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it('should not to be able to authenticate with wrong e-mail', async () => {
		expect(() =>
			sut.execute({
				email: 'gandalf.white@email.com',
				password: '654321',
			})
		).rejects.toBeInstanceOf(InvalidCredentailsErrors);
	});

	it('should not to be able to authenticate with wrong password', async () => {
		await usersRepository.create({
			name: 'Gandalf White',
			email: 'gandalf.white@email.com',
			password_hash: await hash('654321', 6),
		});

		expect(() =>
			sut.execute({
				email: 'gandalf.white@email.com',
				password: '123456',
			})
		).rejects.toBeInstanceOf(InvalidCredentailsErrors);
	});
});
