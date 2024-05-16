import type { User } from '@clerk/clerk-sdk-node';

export const getUserName = (id: string, users: User[]) => {
	const user = users?.find((user) => {
		return user.id === id;
	});
	return {
		fullName: `${user?.firstName} ${user?.lastName}`,
		firstName: user?.firstName,
		lastName: user?.lastName,
		email: user?.emailAddresses[0].emailAddress
	};
};
