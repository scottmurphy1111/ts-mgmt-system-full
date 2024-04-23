import { client } from '$lib/server/prisma';
import type { ProducerWithIncludes } from '$lib/types/types';
import type { LayoutServerLoad } from '../../../$types';
import type { Actions } from '@sveltejs/kit';
import { saveProducer } from '$lib/functions/saveProducer';

export const load: LayoutServerLoad = async ({ params }) => {
	const producerId = params.id as string;

	let existingProducer: ProducerWithIncludes | null = null;
	if (producerId) {
		existingProducer = await client.producer.findUnique({
			where: {
				id: producerId as string
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
	}

	return {
		existingProducer
	};
};

export const actions: Actions = {
	createProducer: async ({ request }) => {
		const formData = await request.formData();

		return saveProducer(formData);
	},
	saveLocation: async ({ request }) => {
		const formData = await request.formData();

		console.log('formData', formData);

		const locationId = formData.get('locationId');
		console.log('locationId', locationId);
		const producerId = formData.get('producerId');
		console.log('producerId', producerId);
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
				// programs: {
				// 	create: formattedProducerPrograms.map((program) => {
				// 		return {
				// 			name: program[Object.keys(program)[0]].name,
				// 			markups: {
				// 				create: program[Object.keys(program)[0]].markups.map((markup) => {
				// 					return {
				// 						termValue: markup.termValue,
				// 						markupValue: markup.markupValue
				// 					};
				// 				})
				// 			}
				// 		};
				// 	})
				// }
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
	createPrograms: async ({ request }) => {
		const formData = await request.formData();

		// console.log('formData', formData);

		const producerId = formData.get('producerId');
		console.log('producerId', producerId);
		const locationId = formData.get('locationId');
		console.log('locationId', locationId);
		// const producerProgramIds = formData.getAll('producerProgramId');
		const producerProgramNames = formData.getAll('producerProgramName');
		// const producerProgramMarkupIds = formData.getAll('producerProgramMarkupId');
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

		console.log('formattedMarkups12', formattedMarkups12);

		const formattedProducerPrograms = producerProgramNames.reduce(
			(acc, id, i) => {
				console.log('id', id);
				console.log('i', i);
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

		console.log('formattedProducerPrograms', JSON.stringify(formattedProducerPrograms, null, 2));

		for (const program of formattedProducerPrograms) {
			const programId = Object.keys(program)[0];
			console.log('programId', programId);
			const programName = program[programId].name;
			console.log('programName', programName);

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

		// formattedProducerPrograms.map((program) => {
		// 	console.log('program', program);
		// 	// console.log('locationId', locationId[0] as string);
		// });

		return {
			producer
		};

		//   await client.producerProgram.upsert({
		//     where: {
		//       id: program as string
		//     },
		//     update: {
		//       name: program.name as string,
		//       markups: {
		//         update: program.markups.map((markup) => {
		//           return {
		//             where: {
		//               id: markup.id
		//             },
		//             data: {
		//               termValue: markup.termValue,
		//               markupValue: markup.markupValue
		//             }
		//           };
		//         })
		//       }
		//     }

		// programs: {
		//   update: formattedProducerPrograms.map((program) => {
		//     return {
		//       where: {
		//         id: Object.keys(program)[0]
		//       },
		//       data: {
		//         name: program[Object.keys(program)[0]].name,
		//         markups: {
		//           update: program[Object.keys(program)[0]].markups.map((markup) => {
		//             return {
		//               where: {
		//                 id: markup.id
		//               },
		//               data: {
		//                 termValue: markup.termValue,
		//                 markupValue: markup.markupValue
		//               }
		//             };
		//           })
		//         }
		//       }
		//     };
		//   })
		// }
		// const name = formData.get('name') as string;

		// const formData = await request.formData();

		// Upload PA to S3
		// const name = formData.get('name') as string;
		// const upload = formData.get('upload') as File;
		// console.log('🥶', JSON.stringify(upload, null, 2));

		// const params = {
		// 	Bucket: BUCKET, // The path to the directory you want to upload the object to, starting with your Space name.
		// 	Key: `producer-agreements/${name}.pdf`, // Object key, referenced whenever you want to access this file later.
		// 	Body: Buffer.from(await upload.arrayBuffer()), // The object's contents. This variable is an object, not a string.
		// 	ACL: 'private' as ObjectCannedACL // Defines ACL permissions, such as private or public.
		// };
		// const uploadObject = async () => {
		// 	try {
		// 		const data = await s3Client.send(new PutObjectCommand(params));
		// 		console.log('Successfully uploaded object: ' + params.Bucket + '/' + params.Key);
		// 		return data;
		// 	} catch (err) {
		// 		console.log('Error', err);
		// 	}
		// };

		// uploadObject();
	}
};