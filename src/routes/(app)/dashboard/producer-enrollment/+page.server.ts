import { clerkClient } from '$lib/server/clerk';
import type { OrganizationMembership } from '@clerk/clerk-sdk-node';
import type { LayoutServerLoad } from '../../$types';
import { type Actions } from '@sveltejs/kit';
import { BUCKET } from '$lib/helpers/helpers';
import { PutObjectCommand, type ObjectCannedACL } from '@aws-sdk/client-s3';
import { s3Client } from '$lib/server/s3client';

export const load: LayoutServerLoad = async () => {
	const reps = await clerkClient.organizations.getOrganizationMembershipList({
		organizationId: 'org_2c6L4NwAT5uaKfVM9A06p3OxwQw'
	});

	// console.log('reps', reps);

	// the session object is available in the locals object
	// const session = request.locals.session;
	// const userData = session ? await clerkClient.users.getUser(session.userId) : null;

	return {
		reps: JSON.parse(JSON.stringify(reps)) as OrganizationMembership[]
	};
};

export const actions: Actions = {
	enroll: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const upload = formData.get('upload') as File;
		console.log('🥶', JSON.stringify(upload, null, 2));

		const params = {
			Bucket: BUCKET, // The path to the directory you want to upload the object to, starting with your Space name.
			Key: `producer-agreements/${name}.pdf`, // Object key, referenced whenever you want to access this file later.
			Body: Buffer.from(await upload.arrayBuffer()), // The object's contents. This variable is an object, not a string.
			ACL: 'private' as ObjectCannedACL // Defines ACL permissions, such as private or public.
		};
		const uploadObject = async () => {
			try {
				const data = await s3Client.send(new PutObjectCommand(params));
				console.log('Successfully uploaded object: ' + params.Bucket + '/' + params.Key);
				return data;
			} catch (err) {
				console.log('Error', err);
			}
		};

		uploadObject();
	}
};
