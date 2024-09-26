import type { CheckInsRepository } from '@/repositories/check-ins-repository';
import type { Checkin } from '@prisma/client';

interface CheckinUseCaseRequest {
	userId: string;
	gymId: string;
}

interface CheckinUseCaseResponse {
	checkIn: Checkin;
}

export class CheckinUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		userId,
		gymId,
	}: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
		const checkIn = await this.checkInsRepository.create({
			user_id: userId,
			gym_id: gymId,
		});

		return {
			checkIn,
		};
	}
}
