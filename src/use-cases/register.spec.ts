import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { describe, expect, it } from 'vitest';
import { UserAlreadyExists } from './errors/user-already-exists';
import { RegisterUseCase } from './register';

describe('Register Use Case', () => {
	it('should hash user password upon registration', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const { user } = await registerUseCase.execute({
			name: 'Gandalf White',
			email: 'gandalf.white@email.com',
			password: '654321',
		});
		const isPasswordCorrectlyHashed = await compare('654321', user.password_hash);
		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it('should not be able to register with same email twice', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const email = 'bilbo@email.com';

		await registerUseCase.execute({
			name: 'Bilbo Bolseiro',
			email,
			password: '442266',
		});

		await expect(() =>
			registerUseCase.execute({
				name: 'Bilbo Bolseiro',
				email,
				password: '442266',
			})
		).rejects.toBeInstanceOf(UserAlreadyExists);
	});

	it('should be able to register', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const { user } = await registerUseCase.execute({
			name: 'Gandalf White',
			email: 'gandalf.white@email.com',
			password: '654321',
		});

		expect(user.id).toEqual(expect.any(String));
	});
});
