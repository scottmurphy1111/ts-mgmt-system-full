import { json, type RequestHandler } from '@sveltejs/kit';
import { ObjectCannedACL, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
	DIGITAL_OCEAN_SPACES_API_KEY,
	DIGITAL_OCEAN_SPACES_API_SECRET_KEY
} from '$env/static/private';

export const POST: RequestHandler = async () => {
	// https://ts-storage.nyc3.digitaloceanspaces.com
	const BUCKET = 'ts-storage';
	const REGION = 'nyc3';

	// 2. Configuring the S3 instance for Digital Ocean Spaces
	// const spacesEndpoint = new AWS.Endpoint(`${REGION}.digitaloceanspaces.com`);

	// Step 2: The s3Client function validates your request and directs it to your Space's specified endpoint using the AWS SDK.
	const s3Client = new S3Client({
		endpoint: `https://${REGION}.digitaloceanspaces.com`, // Find your endpoint in the control panel, under Settings. Prepend "https://".
		forcePathStyle: false, // Configures to use subdomain/virtual calling format.
		region: 'us-east-1', // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (for example, nyc3).
		credentials: {
			accessKeyId: DIGITAL_OCEAN_SPACES_API_KEY, // Access key pair. You can create access key pairs using the control panel or API.
			secretAccessKey: DIGITAL_OCEAN_SPACES_API_SECRET_KEY // Secret access key defined through an environment variable.
		}
	});

	// Step 3: Define the parameters for the object you want to upload.
	const params = {
		Bucket: BUCKET, // The path to the directory you want to upload the object to, starting with your Space name.
		Key: 'test/hello-world.txt', // Object key, referenced whenever you want to access this file later.
		Body: 'Hello, World!', // The object's contents. This variable is an object, not a string.
		ACL: 'private' as ObjectCannedACL, // Defines ACL permissions, such as private or public.
		Metadata: {
			// Defines metadata tags.
			'x-amz-meta-my-key': 'your-value'
		}
	};

	// Step 4: Define a function that uploads your object using SDK's PutObjectCommand object and catches any errors.
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

	// Step 5: Call the uploadObject function.
	return json({ message: 'SUCCESS!!' });

	// const url = `https://${BUCKET}.${REGION}.digitaloceanspaces.com/${file.path}`;
	// const S3 = new AWS.S3({
	//   endpoint: spacesEndpoint,
	//   accessKeyId: DIGITAL_OCEAN_SPACES_API_KEY,
	//   secretAccessKey: DIGITAL_OCEAN_SPACES_API_SECRET_KEY
	// });

	// // 3. Using .putObject() to make the PUT request, S3 signs the request
	// const params = { Body: file.stream, Bucket: BUCKET, Key: file.path };
	// S3.putObject(params)
	//   .on('build', request => {
	//     request.httpRequest.headers.Host = `https://${BUCKET}.${REGION}.digitaloceanspaces.com`;
	//     // Note: I am assigning the size to the file Stream manually
	//     request.httpRequest.headers['Content-Length'] = file.size;
	//     request.httpRequest.headers['Content-Type'] = file.mimetype;
	//     request.httpRequest.headers['x-amz-acl'] = 'public-read';
	//   })
	//   .send((err, data) => {
	//     if (err) logger(err, err.stack);
	//     else logger(JSON.stringify(data, '', 2));
	//   });
};
