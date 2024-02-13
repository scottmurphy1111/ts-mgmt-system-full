import { S3Client } from '@aws-sdk/client-s3';
import {
	DIGITAL_OCEAN_SPACES_API_KEY,
	DIGITAL_OCEAN_SPACES_API_SECRET_KEY
} from '$env/static/private';
import { REGION } from '$lib/helpers/helpers';

export const s3Client = new S3Client({
	endpoint: `https://${REGION}.digitaloceanspaces.com`, // Find your endpoint in the control panel, under Settings. Prepend "https://".
	forcePathStyle: false, // Configures to use subdomain/virtual calling format.
	region: 'us-east-1', // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (for example, nyc3).
	credentials: {
		accessKeyId: DIGITAL_OCEAN_SPACES_API_KEY, // Access key pair. You can create access key pairs using the control panel or API.
		secretAccessKey: DIGITAL_OCEAN_SPACES_API_SECRET_KEY // Secret access key defined through an environment variable.
	}
});
