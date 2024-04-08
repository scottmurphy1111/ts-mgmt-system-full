import type {
	TsLocation,
	LocationContact,
	LocationMarkup,
	LocationNote,
	LocationProgram,
	Producer
} from '@prisma/client';
import type { RouteParams } from '../../routes/$types';

export type ProducerWithIncludes = Producer & {
	locations: LocationWithIncludes[];
};

export type LocationWithIncludes = TsLocation & {
	locationPrograms: LocationProgramWithIncludes[];
	locationContacts: LocationContact[];
	locationNotes: LocationNote[];
};

export type LocationProgramWithIncludes = LocationProgram & {
	locationMarkups: LocationMarkup[];
};

export type Ratesheet =
	| {
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
	  }
	| {
			name: string;
			title: string;
	  };

export type RouteParamsApp = RouteParams & {
	id: string;
};
