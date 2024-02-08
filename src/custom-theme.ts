import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const customTheme: CustomThemeConfig = {
	name: 'custom-theme',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `Montserrat, sans-serif`,
		'--theme-font-family-heading': `Montserrat, sans-serif`,
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '8px',
		'--theme-rounded-container': '8px',
		'--theme-border-base': '1px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '255 255 255',
		'--on-secondary': '255 255 255',
		'--on-tertiary': '0 0 0',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '255 255 255',
		'--on-surface': '255 255 255',
		// =~= Theme Colors  =~=
		// primary | #1575CF
		'--color-primary-50': '220 234 248', // #dceaf8
		'--color-primary-100': '208 227 245', // #d0e3f5
		'--color-primary-200': '197 221 243', // #c5ddf3
		'--color-primary-300': '161 200 236', // #a1c8ec
		'--color-primary-400': '91 158 221', // #5b9edd
		'--color-primary-500': '21 117 207', // #1575CF
		'--color-primary-600': '19 105 186', // #1369ba
		'--color-primary-700': '16 88 155', // #10589b
		'--color-primary-800': '13 70 124', // #0d467c
		'--color-primary-900': '10 57 101', // #0a3965
		// secondary | #115191
		'--color-secondary-50': '219 229 239', // #dbe5ef
		'--color-secondary-100': '207 220 233', // #cfdce9
		'--color-secondary-200': '196 212 228', // #c4d4e4
		'--color-secondary-300': '160 185 211', // #a0b9d3
		'--color-secondary-400': '88 133 178', // #5885b2
		'--color-secondary-500': '17 81 145', // #115191
		'--color-secondary-600': '15 73 131', // #0f4983
		'--color-secondary-700': '13 61 109', // #0d3d6d
		'--color-secondary-800': '10 49 87', // #0a3157
		'--color-secondary-900': '8 40 71', // #082847
		// tertiary | #d5d5d5
		'--color-tertiary-50': '249 249 249', // #f9f9f9
		'--color-tertiary-100': '247 247 247', // #f7f7f7
		'--color-tertiary-200': '245 245 245', // #f5f5f5
		'--color-tertiary-300': '238 238 238', // #eeeeee
		'--color-tertiary-400': '226 226 226', // #e2e2e2
		'--color-tertiary-500': '213 213 213', // #d5d5d5
		'--color-tertiary-600': '192 192 192', // #c0c0c0
		'--color-tertiary-700': '160 160 160', // #a0a0a0
		'--color-tertiary-800': '128 128 128', // #808080
		'--color-tertiary-900': '104 104 104', // #686868
		// success | #5BDC6A
		'--color-success-50': '230 250 233', // #e6fae9
		'--color-success-100': '222 248 225', // #def8e1
		'--color-success-200': '214 246 218', // #d6f6da
		'--color-success-300': '189 241 195', // #bdf1c3
		'--color-success-400': '140 231 151', // #8ce797
		'--color-success-500': '91 220 106', // #5BDC6A
		'--color-success-600': '82 198 95', // #52c65f
		'--color-success-700': '68 165 80', // #44a550
		'--color-success-800': '55 132 64', // #378440
		'--color-success-900': '45 108 52', // #2d6c34
		// warning | #E5DE04
		'--color-warning-50': '251 250 217', // #fbfad9
		'--color-warning-100': '250 248 205', // #faf8cd
		'--color-warning-200': '249 247 192', // #f9f7c0
		'--color-warning-300': '245 242 155', // #f5f29b
		'--color-warning-400': '237 232 79', // #ede84f
		'--color-warning-500': '229 222 4', // #E5DE04
		'--color-warning-600': '206 200 4', // #cec804
		'--color-warning-700': '172 167 3', // #aca703
		'--color-warning-800': '137 133 2', // #898502
		'--color-warning-900': '112 109 2', // #706d02
		// error | #d23d37
		'--color-error-50': '248 226 225', // #f8e2e1
		'--color-error-100': '246 216 215', // #f6d8d7
		'--color-error-200': '244 207 205', // #f4cfcd
		'--color-error-300': '237 177 175', // #edb1af
		'--color-error-400': '224 119 115', // #e07773
		'--color-error-500': '210 61 55', // #d23d37
		'--color-error-600': '189 55 50', // #bd3732
		'--color-error-700': '158 46 41', // #9e2e29
		'--color-error-800': '126 37 33', // #7e2521
		'--color-error-900': '103 30 27', // #671e1b
		// surface | #355669
		'--color-surface-50': '225 230 233', // #e1e6e9
		'--color-surface-100': '215 221 225', // #d7dde1
		'--color-surface-200': '205 213 218', // #cdd5da
		'--color-surface-300': '174 187 195', // #aebbc3
		'--color-surface-400': '114 137 150', // #728996
		'--color-surface-500': '53 86 105', // #355669
		'--color-surface-600': '48 77 95', // #304d5f
		'--color-surface-700': '40 65 79', // #28414f
		'--color-surface-800': '32 52 63', // #20343f
		'--color-surface-900': '26 42 51' // #1a2a33
	}
};
