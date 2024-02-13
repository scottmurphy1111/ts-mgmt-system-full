const { MODE } = import.meta.env;
export const LOCAL_URL = 'http://localhost:5173';
export const PROD_URL = 'https://system.trucksuite.com';

export const BUCKET = 'ts-storage';
export const REGION = 'nyc3';

export const appHost = MODE === 'development' ? LOCAL_URL : PROD_URL;
