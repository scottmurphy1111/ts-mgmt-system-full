import type { LayoutServerLoad } from './$types';
import { clerkClient } from '$lib/server/clerk';
import type { User } from '@clerk/clerk-sdk-node';

export const load: LayoutServerLoad = async ({ locals }) => {
	const userId = locals.session?.userId as string;
	if (!userId) return { userData: null };
	const userData = await clerkClient.users.getUser(userId);

	return {
		userData: JSON.parse(JSON.stringify(userData)) as User
	};
};
