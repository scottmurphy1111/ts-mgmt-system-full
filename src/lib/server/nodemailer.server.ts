import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.mail.com',
	secure: false,
	port: 587,
	auth: {
		user: 'trucksuitellc@gmail.com',
		pass: 'mgtkkacpubxszhpf'
	}
});

export { transporter };
