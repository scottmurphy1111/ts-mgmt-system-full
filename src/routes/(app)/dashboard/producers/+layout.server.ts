import type { Ratesheet } from '$lib/types/types';
import clerkClient, { OrganizationMembership, User } from '@clerk/clerk-sdk-node';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const reps = await clerkClient.organizations.getOrganizationMembershipList({
		organizationId: 'org_2c6L4NwAT5uaKfVM9A06p3OxwQw',
		limit: 100
	});
	const users = await clerkClient.users.getUserList({
		limit: 100
	});

	const response = await fetch('https://ts-rates.netlify.app/api/ratesheets');
	const ratesheets = (await response.json()) as Ratesheet[];

	return {
		reps: JSON.parse(JSON.stringify(reps)) as OrganizationMembership[],
		users: JSON.parse(JSON.stringify(users)) as User[],
		ratesheets
	};
};
