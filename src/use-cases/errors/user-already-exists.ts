export class UserAlreadyExists extends Error {
	constructor() {
		super('E-mal already exists!');
	}
}
