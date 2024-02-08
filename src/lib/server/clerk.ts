import { CLERK_SECRET_KEY } from '$env/static/private';
import { createClerkClient } from '@clerk/clerk-sdk-node';

export const clerkClient = createClerkClient({ secretKey: CLERK_SECRET_KEY });
