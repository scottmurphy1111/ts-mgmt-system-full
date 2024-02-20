import type { Note, PortalUser, ProducerLocation, Program } from '@prisma/client';

export type ProducerLocationWithIncludes = ProducerLocation & {
	programs: Program[];
	portalUsers: PortalUser[];
	notes: Note[];
};

export type Ratesheet = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	title: string;
	subtitle: string;
	lowMileageCutoff: string | null;
	isVocational: boolean | null;
	disclosuresSetId: string | null;
	coveragesSetId: string | null;
};
