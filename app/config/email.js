const sgMail = require('@sendgrid/mail');

const sendGridAPIKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendGridAPIKey);

// Signup Email
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Thanks for Joining US!',
        html: `<h1> || Welcome to the ARoot User || </h1><br />
            <h3>And Hii, ${name}</h3><br />
            <p>&nbsp; Hope you have better experience<br />
            &nbsp; If You face Any Issue tell us through the contact us</p>`
    });
};

// Update Account
const sendUpdateEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Ignote if you update your profile',
        html: `<h1> || Update Notice to the ARoot User Profile || </h1><br />
            <h3>And Hii, ${name}</h3><br />
            <p>&nbsp; Someone is updated certain informations on your profile like(Name, DOB, Social Links etc.)<br />
            &nbsp; if it was you ignore this message,<br />
            &nbsp; And if you not change your password immediately...</p>`
    });
};

// Change Password
const changePasswordEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Change Password Alert',
        html: `<h1> || Password Change Notice to the ARoot User Profile || </h1><br />
            <h3>Hello, ${name}</h3><br />
            <p>&nbsp; Someone allready Changed your Account Password from inside<br />
            &nbsp; if it was you ignore this message,<br />
            &nbsp; And if you not change your password immediately...and safe you account</p>`
    });
};

// Forget Password
const forgetPasswordEmail = (email, site, token) => {
    sgMail.send({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'User Need to Reset His / Her Password',
        html: `<h1> || Password Needed to be Reset || </h1><br />
            <p>&nbsp; Click this link to reset your account password<br />
            &nbsp; For Development => http-> http://${site}/user/reset/${token}<br />
            &nbsp; For Website => https://${site}/user/reset/${token}<br />
            &nbsp; if you don't need to reset ignore this message,<br /></p>`
    });
};

// Change Password
const reserPasswordEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Reset Password Alert',
        html: `<h1> || Password Reset Notice to the ARoot User Profile || </h1><br />
            <h3>Hello, ${name}</h3><br />
            <p>&nbsp; Someone allready Changed your Account Password <br />
            &nbsp; if it was you ignore this message,<br />
            &nbsp; And if you not change your password immediately...and safe you account</p>`
    });
};

const sendContactEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Thank You for Contacting US!',
        html: `<h1> || Welcome to the ARoot User || </h1><br />
            <h3>And Hello, ${name}</h3><br />
            <p>&nbsp; We Recieve your Message & We will contact you soon<br />
            &nbsp; We hope our services Make you happy, Good bye for now.</p>`
    });
};

// Remove Account
const sendCancelationEmail = (email, uname, name) => {
    sgMail.send({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Sorry to see you GO!',
        html: `<h1> || What Happend || </h1><br />
            <h3>Goodbye, ${name}</h3><br />
            <p>&nbsp; UserName- ${uname}<br />
            &nbsp; Hope you visit us again soon...</p>`
    });
};

module.exports = {
    sendWelcomeEmail,
    sendUpdateEmail,
    changePasswordEmail,
    forgetPasswordEmail,
    reserPasswordEmail,
    sendContactEmail,
    sendCancelationEmail
}