import { type Actions } from '@sveltejs/kit';
import { client } from '$lib/server/prisma';
import { saveProducer } from '$lib/functions/saveProducer';
import type { ProducerWithIncludes } from '$lib/types/types';
import { getRepName } from '$lib/functions/getRepName';
import { getUserName } from '$lib/functions/getUserName';
import clerkClient from '@clerk/clerk-sdk-node';
import { format } from 'date-fns';
import { SENDGRID_API_KEY } from '$env/static/private';
import sgMail from '@sendgrid/mail';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, depends }) => {
	depends('data:producer');
	const searchTerm = url.searchParams.get('q');
	const limit = url.searchParams.get('_limit');
	const page = url.searchParams.get('_page');
	const orderBy = url.searchParams.get('_sort');
	const order = url.searchParams.get('_order');
	const salesRepId = url.searchParams.get('salesRepId');

	const count = await client.producer.count();
	const producers = await client.producer.findMany({
		where: {
			...(salesRepId ? { tsSalesRepId: salesRepId } : {}),
			OR: [
				{
					name: {
						contains: searchTerm ?? ''
					}
				},
				{
					dba: {
						contains: searchTerm ?? ''
					}
				},
				{
					primaryContactName: {
						contains: searchTerm ?? ''
					}
				}
			]
		},
		skip: Number(page) > 1 ? (Number(page) - 1) * Number(limit) : 0,
		take: Number(limit),
		orderBy: {
			[(orderBy as string) ?? 'name']: order ? order : 'asc'
		},
		include: {
			locations: {
				include: {
					locationPrograms: true,
					locationContacts: true,
					locationNotes: true
				}
			}
		}
	});

	return {
		count,
		producers: producers as ProducerWithIncludes[]
	};
};

export const actions: Actions = {
	createProducer: async ({ request }) => {
		const formData = await request.formData();

		return saveProducer(formData);
	},
	saveLocation: async ({ request }) => {
		const formData = await request.formData();

		const locationId = formData.get('locationId');
		const producerId = formData.get('producerId');
		const name = formData.get('name');
		const phone = formData.get('phone');
		const email = formData.get('email');
		const website = formData.get('website');
		const address = formData.get('address');
		const city = formData.get('city');
		const state = formData.get('state');
		const zip = formData.get('zip');
		const country = formData.get('country');
		const mailingAddress = formData.get('mailingAddress');
		const mailingCity = formData.get('mailingCity');
		const mailingState = formData.get('mailingState');
		const mailingZip = formData.get('mailingZip');
		const mailingCountry = formData.get('mailingCountry');
		const tsSalesRepId = formData.get('tsSalesRepId');
		const main = formData.get('main');

		const location = await client.tsLocation.upsert({
			where: {
				id: locationId as string
			},
			update: {
				name: name as string,
				phone: phone as string,
				email: email as string,
				website: website as string,
				address: address as string,
				city: city as string,
				state: state as string,
				zip: zip as string,
				country: country as string,
				mailingAddress: mailingAddress as string,
				mailingCity: mailingCity as string,
				mailingState: mailingState as string,
				mailingZip: mailingZip as string,
				mailingCountry: mailingCountry as string,
				tsSalesRepId: tsSalesRepId as string,
				main: main === 'true'
			},
			create: {
				name: name as string,
				phone: phone as string,
				email: email as string,
				website: website as string,
				address: address as string,
				city: city as string,
				state: state as string,
				zip: zip as string,
				country: country as string,
				mailingAddress: mailingAddress as string,
				mailingCity: mailingCity as string,
				mailingState: mailingState as string,
				mailingZip: mailingZip as string,
				mailingCountry: mailingCountry as string,
				tsSalesRepId: tsSalesRepId as string,
				producerId: producerId as string,
				main: main === 'true'
			}
		});

		const producer = await client.producer.findUnique({
			where: {
				id: producerId as string
			},
			include: {
				locations: true
			}
		});

		return { location, producer };
	},
	saveContact: async ({ request }) => {
		const formData = await request.formData();

		const locationId = formData.get('locationId');
		const id = formData.get('id');
		const firstName = formData.get('firstName');
		const lastName = formData.get('lastName');
		const phone = formData.get('phone');
		const email = formData.get('email');
		const role = formData.get('role');

		let contact;

		if (!id) {
			contact = await client.locationContact.create({
				data: {
					firstName: firstName as string,
					lastName: lastName as string,
					phone: phone as string,
					email: email as string,
					role: role as string,
					locationId: locationId as string
				}
			});
		} else {
			contact = await client.locationContact.update({
				where: {
					id: id as string
				},
				data: {
					firstName: firstName as string,
					lastName: lastName as string,
					phone: phone as string,
					email: email as string,
					role: role as string,
					locationId: locationId as string
				}
			});
		}

		const location = await client.tsLocation.findUnique({
			where: {
				id: locationId as string
			}
		});

		return { contact, location };
	},
	createPrograms: async ({ request }) => {
		const formData = await request.formData();

		const producerId = formData.get('producerId');
		const locationId = formData.get('locationId');
		const producerProgramNames = formData.getAll('producerProgramName');
		const producerProgramMarkupTermValues12 = formData.getAll('producerProgramMarkupTermValue12');
		const producerProgramMarkupMarkupValues12 = formData.getAll(
			'producerProgramMarkupMarkupValue12'
		);
		const producerProgramMarkupTermValues24 = formData.getAll('producerProgramMarkupTermValue24');
		const producerProgramMarkupMarkupValues24 = formData.getAll(
			'producerProgramMarkupMarkupValue24'
		);
		const producerProgramMarkupTermValues36 = formData.getAll('producerProgramMarkupTermValue36');
		const producerProgramMarkupMarkupValues36 = formData.getAll(
			'producerProgramMarkupMarkupValue36'
		);
		const producerProgramMarkupTermValues48 = formData.getAll('producerProgramMarkupTermValue48');
		const producerProgramMarkupMarkupValues48 = formData.getAll(
			'producerProgramMarkupMarkupValue48'
		);

		const formattedMarkups12 = producerProgramMarkupTermValues12.map((term, i) => {
			return {
				termValue: term as string,
				markupValue: producerProgramMarkupMarkupValues12[i] as string
			};
		});

		const formattedMarkups24 = producerProgramMarkupTermValues24.map((term, i) => {
			return {
				termValue: term as string,
				markupValue: producerProgramMarkupMarkupValues24[i] as string
			};
		});

		const formattedMarkups36 = producerProgramMarkupTermValues36.map((term, i) => {
			return {
				termValue: term as string,
				markupValue: producerProgramMarkupMarkupValues36[i] as string
			};
		});

		const formattedMarkups48 = producerProgramMarkupTermValues48.map((term, i) => {
			return {
				termValue: term as string,
				markupValue: producerProgramMarkupMarkupValues48[i] as string
			};
		});

		const formattedProducerPrograms = producerProgramNames.reduce(
			(acc, id, i) => {
				const newItem = {
					[id as string]: {
						name: producerProgramNames[i] as string,
						markups: [
							formattedMarkups12[i],
							formattedMarkups24[i],
							formattedMarkups36[i],
							formattedMarkups48[i]
						],
						locationId: locationId as string
					}
				};

				acc.push(newItem);
				return acc;
			},
			[] as {
				[key: string]: {
					name: string;
					markups: {
						// id: string;
						termValue: string;
						markupValue: string;
					}[];
					locationId: string;
				};
			}[]
		);

		for (const program of formattedProducerPrograms) {
			const programId = Object.keys(program)[0];
			const programName = program[programId].name;

			await client.locationProgram.create({
				data: {
					name: programName,
					locationMarkups: {
						create: program[programId].markups.map((markup) => {
							return {
								termValue: markup.termValue,
								markupValue: markup.markupValue
							};
						})
					},
					location: {
						connect: {
							id: program[programId].locationId
						}
					}
				}
			});
		}

		const producer = await client.producer.findUnique({
			where: {
				id: producerId as string
			},
			include: {
				locations: true
			}
		});

		return {
			producer
		};
	},
	completeEnrollment: async ({ request, locals }) => {
		const tsSalesRepId = locals.session?.userId as string;
		const formData = await request.formData();

		const producerId = formData.get('producerId');

		const producer = await client.producer.findUnique({
			where: {
				id: producerId as string
			},
			include: {
				locations: {
					include: {
						locationContacts: true,
						locationPrograms: {
							include: {
								locationMarkups: true
							}
						},
						locationNotes: true
					}
				}
			}
		});

		const reps = await clerkClient.organizations.getOrganizationMembershipList({
			organizationId: 'org_2c6L4NwAT5uaKfVM9A06p3OxwQw',
			limit: 100
		});

		const users = await clerkClient.users.getUserList({
			limit: 100
		});

		const { fullName, email: repEmail } = getUserName(tsSalesRepId, users);

		const sendEmail = async () => {
			const mailOptions = {
				to: [
					'scott.murphy@trucksuite.com',
					'debbi@trucksuite.com',
					'alan@trucksuite.com',
					repEmail as string
				],
				from: 'support@trucksuite.com',
				subject: `New Producer Enrollment Submission from ${producer?.name} - submitted by ${fullName}`,
				text: 'New Producer Enrollment Submission',
				html: `
          <h2>Producer Information</h2>
          <p style="margin:0px;">Name: ${producer?.name}</p>
          <p style="margin:0px;">Created At: ${format(producer?.createdAt as Date, 'MM/dd/yyyy - hh:mm:ss a')}</p>
          <p style="margin:0px;">Submitted At: ${format(new Date(), 'MM/dd/yyyy - hh:mm:ss a')}</p>
          <div style="display:flex;flex-direction:column;gap:16px;margin-bottom:16px;">
            <p style="margin:0px;">Type: ${producer?.type}</p>
            <p style="margin:0px;">DBA: ${producer?.dba}</p>
            <p style="margin:0px;">Tax Id: ${producer?.taxId}</p>
            <p style="margin:0px;">Website: ${producer?.website}</p>
          </div>
          <div style="display:flex;flex-direction:column;gap:16px;margin-bottom:16px;">
            <p style="margin:0px;">${producer?.address}</p>
            <p style="margin:0px;">${producer?.city}, ${producer?.state} ${producer?.zip}</p>
            <p style="margin:0px;">${producer?.country}</p>
          </div>
          <div style="display:flex;flex-direction:column;gap:16px;margin-bottom:16px;">
            <p style="margin:0px;">Name: ${producer?.primaryContactName}</p>
            <p style="margin:0px;">Title: ${producer?.primaryContactTitle}</p>
            <p style="margin:0px;">Email: ${producer?.primaryContactEmail}</p>
            <p style="margin:0px;">Phone: ${producer?.primaryContactPhone}</p>
          </div>
          <div style="display:flex;flex-direction:column;gap:16px;margin-bottom:16px;">
            <h3>TS Sales Rep</h3>
            <p style="margin:0px;">${getRepName(producer?.tsSalesRepId as string, reps)}</p>
          </div>
          <h3>Locations</h3>
          <p style="margin:0px;">Number of Locations: ${producer?.locations.length}</p>
          <div style="display:flex;flex-direction:column;gap:16px;margin-bottom:16px;">
            ${producer?.locations
							.sort((a, b) => {
								if (a.main) {
									return -1;
								}
								if (b.main) {
									return 1;
								}
								return 0;
							})
							.map((location, idx) => {
								return `
                  <div style="padding:16px;box-sizing:border-box;${idx + 1 < producer?.locations.length ? `background-color:#eeeeee;` : ''}">
                    <span>Location ${idx + 1}</span>
                    <h4 style="margin-top:8px;margin-bottom:8px;">Location Info</h4>
                    <p style="margin:0px;">Name: ${location.name}</p>
                    <p style="margin:0px;">Phone: ${location.phone}</p>
                    <p style="margin:0px;">Email: ${location.email}</p>
                    <p style="margin:0px;">Website: ${location.website}</p>
                    <br />
                    <p style="margin:0px;">${location.address}</p>
                    <p style="margin:0px;">${location.city}, ${location.state} ${location.zip}</p>
                    <p style="margin:0px;">${location.country}</p>
                    <p style="margin:0px;">Main Location: ${location.main ? 'Yes' : 'No'}</p>
                    ${
											location.mailingAddress
												? `<br /><p style="margin:0px;">Mailing Address:</p>
                        <p style="margin:0px;">${location.mailingAddress}</p>
                    <p style="margin:0px;">${location.mailingCity}, ${location.mailingState} ${location.mailingZip}</p>
                    <p style="margin:0px;">${location.mailingCountry}</p>`
												: ''
										}
                    <h4 style="margin-top:8px;margin-bottom:8px;">Contacts</h4>
                      ${location.locationContacts
												.map((contact) => {
													return `
                          <div style="margin-bottom:8px;">
                            <p style="margin:0px;">Name: ${contact.firstName} ${contact.lastName}</p>
                            <p style="margin:0px;">Title: ${contact.title}</p>
                            <p style="margin:0px;">Phone: ${contact.phone}</p>
                            <p style="margin:0px;">Email: ${contact.email}</p>
                            <p style="margin:0px;">Role: ${contact.role}</p>
                          </div>
                        `;
												})
												.join('')}
                    <h4 style="margin-top:8px;margin-bottom:8px;">Programs</h4>
                    ${location.locationPrograms
											.map((program) => {
												return `
                        <div>
                          <p style="margin:0px;">${program.name}</p>
                          <div style="display:flex;gap:16px;">
                            ${program.locationMarkups
															.sort((a, b) => {
																if (a.termValue < b.termValue) {
																	return -1;
																}
																if (a.termValue > b.termValue) {
																	return 1;
																}
																return 0;
															})
															.map((markup) => {
																return `
                                <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:16px;margin-right: 8px">
                                  <p style="margin:0px;">${markup.termValue}</p>
                                  <p style="margin:0px;font-weight:600;">$${Number(markup.markupValue).toLocaleString()}</p>
                                </div>

                              `;
															})
															.join('')}
                          </div>
                        </div>
                      `;
											})
											.join('')}
                   
                    ${
											location.locationNotes.length
												? `
                        <h4 style="margin-top:8px;margin-bottom:8px;">Notes</h4>
                         ${location.locationNotes
														.map((note) => {
															return `
                        <div>
                          <p style="margin:0px;">${note.note}</p>
                        </div>`;
														})
														.join('')}`
												: ''
										}
                  </div>`;
							})
							.join('')}
          </div>
          <div>Once complete, please click the link below to activate the producer.</div>
          <a href="https://system.trucksuite.com/dashboard/producers/${producerId}/activate">Activate Producer</a>
        `
			};

			// send mail with defined transport object
			sgMail.setApiKey(SENDGRID_API_KEY);
			return sgMail
				.sendMultiple(mailOptions)
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
		await client.producer.update({
			where: {
				id: producerId as string
			},
			data: {
				status: 'PENDING'
			}
		});
	}
};
