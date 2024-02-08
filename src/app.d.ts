// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import '@total-typescript/ts-reset';
import type { PrismaClient } from '@prisma/client';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session:
				| {
						userId: string;
						claims: unknown;
				  }
				| undefined;
		}
		// interface PageData {}
		// interface Platform {}
	}

	// eslint-disable-next-line no-var
	var prisma: PrismaClient;
}

export {};
