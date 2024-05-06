import type { User } from '@clerk/clerk-sdk-node';

export const getUserName = (id: string, users: User[]) => {
	const user = users?.find((user) => {
		return user.id === id;
	});
	return `${user?.firstName} ${user?.lastName}`;
};
