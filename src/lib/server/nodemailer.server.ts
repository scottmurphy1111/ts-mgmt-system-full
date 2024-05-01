import {
	GOOGLE_APP_TRUCKSUITE_SYSTEM_PASS,
	GOOGLE_APP_TRUCKSUITE_SYSTEM_USER
} from '$env/static/private';
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.mail.com',
	secure: false,
	port: 587,
	from: GOOGLE_APP_TRUCKSUITE_SYSTEM_USER,
	auth: {
		user: GOOGLE_APP_TRUCKSUITE_SYSTEM_USER,
		pass: GOOGLE_APP_TRUCKSUITE_SYSTEM_PASS
	}
});

export { transporter };
