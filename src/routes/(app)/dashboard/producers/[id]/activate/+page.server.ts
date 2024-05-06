import { SENDGRID_API_KEY } from '$env/static/private';
import { client } from '$lib/server/prisma';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import sgMail from '@sendgrid/mail';

export const load = async ({ params }) => {
	const producer = await client.producer.findUnique({
		where: {
			id: params.id
		},
		include: {
			locations: true
		}
	});

	return {
		producer
	};
};

export const actions = {
	default: async ({ params }) => {
		if (!params.id) {
			return fail(400, {
				message: 'Producer Id not provided'
			});
		}

		await client.producer.update({
			where: {
				id: params.id
			},
			data: {
				status: 'ACTIVE'
			}
		});

		const producer = await client.producer.findUnique({
			where: {
				id: params.id
			}
		});

		const emailProducer = async () => {
			const mailOptions = {
				to: producer?.primaryContactEmail,
				from: 'support@trucksuite.com',
				subject: 'Your TruckSuite account has been activated!',
				text: `Your TruckSuite account has been activated. You can now log in and get started!`,
				html: `
          <div style="width:250px;margin-bottom:16px;"><img src="data:image/svg+xml,%3csvg%20id='txt'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20408%2066.14'%3e%3ctitle%3elogo_ok%3c/title%3e%3cpath%20d='M195.53,129V108.53h-5.87v-6.68h5.87V92.15h7.71v9.69h7.2v6.68h-7.2V127.1c0,2.42,1.17,4.26,3.38,4.26A4.79,4.79,0,0,0,210,130l1.84,5.87c-1.4,1.25-3.67,2.28-7.2,2.28C198.62,138.19,195.53,135,195.53,129Z'%20transform='translate(-70.91%20-81.17)'%20style='fill:%23232323'/%3e%3cpath%20d='M214.12,137.31V101.85h7.71V107c2.72-3.38,7-6,11.53-6v7.64a10.6,10.6,0,0,0-2.35-.22c-3.3,0-7.64,2.2-9.18,4.77v24.16h-7.71Z'%20transform='translate(-70.91%20-81.17)'%20style='fill:%23232323'/%3e%3cpath%20d='M259.91,137.31v-4.7a17,17,0,0,1-12.48,5.58c-7.64,0-11.45-4-11.45-11.23V101.85h7.71v22.25c0,5.51,2.79,7.27,7.2,7.27a11.75,11.75,0,0,0,9-4.63V101.85h7.71v35.46h-7.71Z'%20transform='translate(-70.91%20-81.17)'%20style='fill:%23232323'/%3e%3cpath%20d='M272.11,119.54c0-10.72,7.56-18.58,18.28-18.58,7,0,11.09,2.94,13.58,6.31l-5.07,4.63a9.4,9.4,0,0,0-8.15-4.11c-6.39,0-10.72,4.85-10.72,11.75s4.33,11.82,10.72,11.82a9.53,9.53,0,0,0,8.15-4.26l5.07,4.77c-2.5,3.3-6.61,6.31-13.58,6.31C279.68,138.19,272.11,130.26,272.11,119.54Z'%20transform='translate(-70.91%20-81.17)'%20style='fill:%23232323'/%3e%3cpath%20d='M330.59,137.31l-10.79-14.69-5,5.14v9.54h-7.71v-49h7.71V119l15.64-17.11H340L325.3,117.93l15,19.38h-9.69Z'%20transform='translate(-70.91%20-81.17)'%20style='fill:%23232323'/%3e%3cpath%20d='M339.84,132.61l3.52-5.51a18.22,18.22,0,0,0,12,4.92c4.63,0,7-1.91,7-4.7,0-7-21.44-2-21.44-15.64,0-5.8,5-10.72,14-10.72a20.26,20.26,0,0,1,13.73,4.92l-3.23,5.43a14.46,14.46,0,0,0-10.5-4.26c-4,0-6.54,1.91-6.54,4.41,0,6.24,21.44,1.54,21.44,15.64,0,6.31-5.21,11.09-14.76,11.09C348.95,138.19,343.51,136.21,339.84,132.61Z'%20transform='translate(-70.91%20-81.17)'%20style='fill:%236b6b6b'/%3e%3cpath%20d='M397.89,137.31v-4.7a17,17,0,0,1-12.48,5.58c-7.64,0-11.45-4-11.45-11.23V101.85h7.71v22.25c0,5.51,2.79,7.27,7.2,7.27a11.75,11.75,0,0,0,9-4.63V101.85h7.71v35.46h-7.71Z'%20transform='translate(-70.91%20-81.17)'%20style='fill:%236b6b6b'/%3e%3cpath%20d='M411.28,92.74a4.77,4.77,0,1,1,4.77,4.77A4.76,4.76,0,0,1,411.28,92.74Zm0.88,44.57V101.85h7.71v35.46h-7.71Z'%20transform='translate(-70.91%20-81.17)'%20style='fill:%236b6b6b'/%3e%3cpath%20d='M428.1,129V108.53h-5.87v-6.68h5.87V92.15h7.71v9.69H443v6.68h-7.2V127.1c0,2.42,1.17,4.26,3.38,4.26a4.8,4.8,0,0,0,3.38-1.32l1.83,5.87c-1.39,1.25-3.67,2.28-7.2,2.28C431.18,138.19,428.1,135,428.1,129Z'%20transform='translate(-70.91%20-81.17)'%20style='fill:%236b6b6b'/%3e%3cpath%20d='M443.51,119.54c0-10.28,7.49-18.58,18-18.58s17.4,8.08,17.4,19.24v1.91H451.59c0.59,5.29,4.55,9.77,11.23,9.77a14.91,14.91,0,0,0,10.13-4l3.52,5.07a21,21,0,0,1-14.39,5.21C451.37,138.19,443.51,130.77,443.51,119.54Zm17.92-12.26c-6.54,0-9.62,5.07-9.91,9.33h20A9.55,9.55,0,0,0,461.43,107.28Z'%20transform='translate(-70.91%20-81.17)'%20style='fill:%236b6b6b'/%3e%3cpolygon%20points='100.35%2033.07%20100.35%2033.07%2081.24%200%2058.04%200%2077.14%2033.07%2062.38%2058.63%2056.58%2058.61%2071.34%2033.07%2071.34%2033.07%2071.34%2033.07%2071.34%2033.07%2071.34%2033.07%2052.23%200%2029.02%200%2048.13%2033.07%2033.36%2058.63%2027.56%2058.61%2042.32%2033.07%2042.32%2033.07%2042.32%2033.07%2042.32%2033.07%2042.32%2033.07%2023.21%200%200%200%2019.11%2033.07%200%2066.14%208.7%2066.14%2027.81%2033.07%2027.81%2033.07%2027.81%2033.07%2027.81%2033.07%2027.81%2033.07%2013.05%207.53%2018.85%207.51%2033.61%2033.07%2014.5%2066.14%2037.72%2066.14%2056.83%2033.07%2056.83%2033.07%2056.83%2033.07%2056.83%2033.07%2056.83%2033.07%2042.07%207.53%2047.87%207.51%2062.63%2033.07%2043.52%2066.14%2066.73%2066.14%2085.84%2033.07%2085.84%2033.07%2085.84%2033.07%2085.84%2033.07%2085.84%2033.07%2071.09%207.53%2076.88%207.51%2091.65%2033.07%2072.54%2066.14%2081.24%2066.14%20100.35%2033.07%20100.35%2033.07%20100.35%2033.07%20100.35%2033.07'%20style='fill:%239f1d20'/%3e%3c/svg%3e" alt="TruckSuite Logo" /></div>
          <p>Hello ${producer?.primaryContactName},</p>
          <p>Your TruckSuite account has been activated. We have sent you your login information in a separate email.</p>
          <p>Your next step is to consult with your Trucksuite Sales Rep to obtain your custom rate cards and the marketing materials needed to properly offer TruckSuite's Aftermarket Warranty programs.</p>
          <p>Also, feel free to reach out to to us at (336) 565-7100 if you have any questions or issues.</p>
          <p>Thank you for choosing TruckSuite!</p>
          <br />
          <p> Sincerely,</p>
          <p>The TruckSuite Team</p>
          <a href="https://trucksuite.com">trucksuite.com</a>
          `
			};

			sgMail.setApiKey(SENDGRID_API_KEY);
			const result = await sgMail.send(mailOptions);
			console.log('result', result);

			if (result[0].statusCode === 202) {
				return redirect(302, '/dashboard/producers');
			}
		};

		await emailProducer();

		return {
			message: '👍 Producer activated successfully!'
		};
	}
} satisfies Actions;
