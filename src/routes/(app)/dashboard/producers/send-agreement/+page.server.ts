import { type Actions, fail } from '@sveltejs/kit';
import { SENDGRID_API_KEY } from '$env/static/private';
import sgMail from '@sendgrid/mail';

export const actions = {
	sendAgreement: async ({ request }) => {
		const formData = await request.formData();

		const producerName = formData.get('producerName') as string;
		const producerEmail = formData.get('producerEmail') as string;
		const salesRepEmail = formData.get('salesRepEmail') as string;
		if (producerName === '' || producerEmail === '' || salesRepEmail === '') {
			return fail(400, {
				message: 'Producer name, producer email, and sales rep email are required'
			});
		}

		const sendEmail = async () => {
			const mailOptions = {
				to: producerEmail,
				from: 'support@trucksuite.com',
				subject: 'TruckSuite Producer Agreement',
				text: 'Hello, please sign the agreement at this link: https://secure.na4.adobesign.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhDVsFEl30-af9MNVyfx0nyAWiQTaJTFns1aK--hNLPDrJI0Mqbg5jGCKYkhPN_IH6Y*',
				html: `<p>Hello ${producerName},<br />
        Thank you for your interest in TruckSuite! Please follow the steps and sign the Producer Agreement at this link: <a href="https://secure.na4.adobesign.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhDVsFEl30-af9MNVyfx0nyAWiQTaJTFns1aK--hNLPDrJI0Mqbg5jGCKYkhPN_IH6Y*">My Producer Agreement</a></p>`
			};

			sgMail.setApiKey(SENDGRID_API_KEY);
			return sgMail
				.send(mailOptions)
				.then((info) => {
					console.log('Message sent: ' + info);
				})
				.catch((error) => {
					if (error) {
						return console.log(JSON.stringify(error, null, 2));
					}
				});
		};

		await sendEmail();

		// OLD
		// const sendDocumentForSignature = async (accessToken: string, widgetId: string) => {
		// 	console.log('accessToken', accessToken);
		// 	console.log('widgetId', widgetId);
		// 	console.log(producerEmail);
		// 	const requestBody = {
		// 		shareCreationInfo: [
		// 			{
		// 				email: producerEmail as string,
		// 				message: `Please fill out and sign the ${producerName} Producers Agreement documents where indicated.`
		// 			}
		// 		]
		// 	};

		// 	// Make POST request to Adobe Sign API to send document for signature
		// 	await fetch(`https://api.na4.adobesign.com/api/rest/v6/widgets/${widgetId}/members/share`, {
		// 		method: 'POST',
		// 		headers: {
		// 			Authorization: `Bearer ${accessToken}`,
		// 			'Content-Type': 'application/json'
		// 		},
		// 		body: JSON.stringify(requestBody)
		// 	})
		// 		.then((response) => {
		// 			return response.json();
		// 		})
		// 		.then((data) => {
		// 			console.log('data', data);
		// 			return (data as { id: string })?.id;
		// 		});

		// 	// const json = (await response.json()) as { id?: string; code?: string };
		// 	// console.log('json', json);

		// 	// if (!json?.id) {
		// 	// 	error(400, {
		// 	// 		message: 'Something went wrong sending the agreement for signature'
		// 	// 	});
		// 	// }

		// 	// console.log('Agreement sent successfully. Agreement ID:', json?.id);
		// 	// return json?.id; // Return the agreement ID
		// };

		// try {
		// 	sendDocumentForSignature(ADOBE_SIGN_ACCESS_TOKEN, ADOBE_SIGN_WEB_FORM);
		// } catch (e) {
		// 	console.error('Error sending agreement for signature:', e);
		// 	throw e;
		// }
	}
} satisfies Actions;
