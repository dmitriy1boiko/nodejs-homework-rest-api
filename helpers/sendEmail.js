// const ElasticEmail = require('@elasticemail/elasticemail-client');
const nodemailer = require("nodemailer");

require('dotenv').config();

const { UKR_NET_EMAIL, UKR_NET_PASSWORD} = process.env;

const transporter = nodemailer.createTransport({
	
	host: "smtp.ukr.net",
	port: 465,
	secure: true,
	auth: {
		user: UKR_NET_EMAIL,
		pass: UKR_NET_PASSWORD,
	},
});

const sendEmail = async (data) => {
	const email = { ...data, from: UKR_NET_EMAIL };
	await transporter.sendMail(email);

	return true;
};

module.exports = sendEmail;


// const { ELASTIC_EMAIL_API_KEY } = process.env;

// const defaultClient = ElasticEmail.ApiClient.instance;

// const { apikey } = defaultClient.authentications;
// apikey.apiKey = ELASTIC_EMAIL_API_KEY;

// const api = new ElasticEmail.EmailsApi();

// const email = ElasticEmail.EmailMessageData.constructFromObject({
//   Recipients: [new ElasticEmail.EmailRecipient('boikodmytro@meta.ua')],
//   Content: {
//     Body: [
//       ElasticEmail.BodyPart.constructFromObject({
//         ContentType: 'HTML',
//         Content: '<p>Verify email</p>',
//       }),
//     ],
//     Subject: 'JS EE lib test',
//     From: 'boikodmytro1@ukr.net',
//   },
// });

// const sendEmail = function (error, data, response) {
//   if (error) {
//     console.log('What happened');
//     console.error(error);
//   } else {
//     console.log('API called successfully.');
//   }
// };
//  api.emailsPost(email, sendEmail);

// module.exports = sendEmail;

// const nodemailer = require('nodemailer');

// require('dotenv').config();

// const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

// const nodemailerConfig = {
//   host: 'smtp.ukr.net',
//   port: 465,
//   secure: true,
//   auth: {
//     user: UKR_NET_EMAIL,
//     pass: UKR_NET_PASSWORD,
//   },
// };

// const transport = nodemailer.createTransport(nodemailerConfig);

// const sendEmail = async (data) => {
//   const email = { ...data, from: UKR_NET_EMAIL };
//   await transport.sendMail(email);
//   return true;
// };

// module.exports = sendEmail;