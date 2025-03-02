import nodemailer from "nodemailer";
export const sendEmail = async (to, subject, html, attachments) => { 
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {     
            user:process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
        tls: {
            rejectUnauthorized: false, 
          },
    })
        const info = await transporter.sendMail({
            from: `"bolaa" <${process.env.EMAIL}>`,
            to: to ? to : "nabilgaber16@gmail.com",
            subject: subject ? subject : "Hallo ",
            html: html?html:"<b>hello world</b>",
            attachments: attachments ? attachments : []
        });
}

