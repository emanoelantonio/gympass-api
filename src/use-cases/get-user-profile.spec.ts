import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { GetUserProfileUseCase } from './get-user-profile';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new GetUserProfileUseCase(usersRepository);
	});

	it('should be able to get user profile', async () => {
		const createdUser = await usersRepository.create({
			name: 'Gandalf White',
			email: 'gandalf.white@email.com',
			password_hash: await hash('654321', 6),
		});

		const { user } = await sut.execute({
			userId: createdUser.id,
		});

		expect(user.name).toEqual('Gandalf White');
	});

	it('should throw a ResourceNotFoundError when the user does not exist', async () => {
		await expect(() =>
			sut.execute({
				userId: 'non-existing-id',
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
