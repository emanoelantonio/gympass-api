import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { UserAlreadyExists } from './errors/user-already-exists';
import { RegisterUseCase } from './register';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new RegisterUseCase(usersRepository);
	});

	it('should hash user password upon registration', async () => {
		const { user } = await sut.execute({
			name: 'Gandalf White',
			email: 'gandalf.white@email.com',
			password: '654321',
		});
		const isPasswordCorrectlyHashed = await compare('654321', user.password_hash);
		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it('should not be able to register with same email twice', async () => {
		const email = 'bilbo@email.com';

		await sut.execute({
			name: 'Bilbo Bolseiro',
			email,
			password: '442266',
		});

		await expect(() =>
			sut.execute({
				name: 'Bilbo Bolseiro',
				email,
				password: '442266',
			})
		).rejects.toBeInstanceOf(UserAlreadyExists);
	});

	it('should be able to register', async () => {
		const { user } = await sut.execute({
			name: 'Gandalf White',
			email: 'gandalf.white@email.com',
			password: '654321',
		});

		expect(user.id).toEqual(expect.any(String));
	});
});
