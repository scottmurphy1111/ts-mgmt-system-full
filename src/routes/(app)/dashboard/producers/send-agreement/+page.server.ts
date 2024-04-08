import { type Actions, fail } from '@sveltejs/kit';
import { ADOBE_SIGN_ACCESS_TOKEN, ADOBE_SIGN_LIBRARY_DOCUMENT } from '$env/static/private';

export const actions = {
	sendAgreement: async ({ request, fetch }) => {
		const formData = await request.formData();

		const producerName = formData.get('producerName');
		const producerEmail = formData.get('producerEmail');
		const salesRepEmail = formData.get('salesRepEmail');
		if (producerName === '' || producerEmail === '' || salesRepEmail === '') {
			return fail(400, {
				message: 'Producer name, producer email, and sales rep email are required'
			});
		}

		const sendDocumentForSignature = async (accessToken: string, documentUrl: string) => {
			const requestBody = {
				fileInfos: [
					{
						libraryDocumentId: documentUrl
					}
				],
				participantSetsInfo: [
					{
						memberInfos: [
							{
								email: salesRepEmail as string
							}
						],
						order: 1,
						role: 'SIGNER'
					},
					{
						memberInfos: [
							{
								email: producerEmail as string
							}
						],
						order: 2,
						role: 'SIGNER'
					},
					{
						memberInfos: [
							{
								email: 'alan@trucksuite.com'
							}
						],
						order: 3,
						role: 'SIGNER'
					}
				],
				signatureType: 'ESIGN',
				name: `${producerName} Producers Agreement`, // Name of the agreement
				message: `Please fill out and sign the ${producerName} Producers Agreement documents where indicated.`, // Message to the recipient
				state: 'IN_PROCESS' // Set to 'IN_PROCESS' to send the document immediately
			};

			// Make POST request to Adobe Sign API to send document for signature
			await fetch('https://api.na3.adobesign.com/api/rest/v6/agreements', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			})
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					return (data as { id: string })?.id;
				});

			// const json = (await response.json()) as { id?: string; code?: string };
			// console.log('json', json);

			// if (!json?.id) {
			// 	error(400, {
			// 		message: 'Something went wrong sending the agreement for signature'
			// 	});
			// }

			// console.log('Agreement sent successfully. Agreement ID:', json?.id);
			// return json?.id; // Return the agreement ID
		};

		try {
			sendDocumentForSignature(ADOBE_SIGN_ACCESS_TOKEN, ADOBE_SIGN_LIBRARY_DOCUMENT);
		} catch (e) {
			console.log('error', e);
			throw e;
		}
	}
} satisfies Actions;
