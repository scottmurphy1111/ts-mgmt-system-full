import type { OrganizationMembership } from '@clerk/clerk-sdk-node';

export const getRepName = (id: string, reps: OrganizationMembership[]) => {
	const rep = reps?.find((rep) => {
		return rep.publicUserData?.userId === id;
	});
	return `${rep?.publicUserData?.firstName} ${rep?.publicUserData?.lastName}`;
};
