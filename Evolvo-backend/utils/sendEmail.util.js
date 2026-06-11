import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendVerificationEmail = async (email, code) => {
    console.log("sending email...")
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "E-Mail Verifizierung",
        text: `Dein Verifizierungscode lautet: ${code}`
    });
    console.log("email send!")
}