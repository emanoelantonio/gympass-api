import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CheckinUseCase } from './check-in';

let checkinRepository: InMemoryCheckInRepository;
let sut: CheckinUseCase;

describe('CheckIn Use Case', () => {
	beforeEach(() => {
		checkinRepository = new InMemoryCheckInRepository();
		sut = new CheckinUseCase(checkinRepository);
	});

	it('should be able to check in', async () => {
		const { checkIn } = await sut.execute({
			userId: 'user-01',
			gymId: 'gym-12',
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});
});
