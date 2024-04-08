import { BUCKET } from '$lib/helpers/helpers';
import { s3Client } from '$lib/server/s3client';
import { ObjectCannedACL, PutObjectCommand } from '@aws-sdk/client-s3';

export const uploadProducerAgreement = async (name: string, upload: File) => {
	const params = {
		Bucket: BUCKET, // The path to the directory you want to upload the object to, starting with your Space name.
		Key: `producer-agreements/${name}.pdf`, // Object key, referenced whenever you want to access this file later.
		Body: Buffer.from(await upload.arrayBuffer()), // The object's contents. This variable is an object, not a string.
		ACL: 'private' as ObjectCannedACL // Defines ACL permissions, such as private or public.
	};
	try {
		const data = await s3Client.send(new PutObjectCommand(params));
		console.log('Successfully uploaded object: ' + params.Bucket + '/' + params.Key);
		return data;
	} catch (err) {
		console.log('Error', err);
	}
};
