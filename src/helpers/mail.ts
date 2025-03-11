import nodemailer, { Transporter } from "nodemailer";
import { myEnvironment } from "@/configs";
import { IForgetPasswordMail, Imail, IVerifyAccountMail } from "@/types";
import Mailgen from "mailgen";

class EmailHelper {
  private mailGenerator: Mailgen;
  private transporter: Transporter;

  constructor() {
    this.mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Chat App",
        link: "https://chatapp.com",
      },
    });

    this.transporter = nodemailer.createTransport({
      host: myEnvironment.SMTP_HOST,
      port: parseInt(myEnvironment.SMTP_PORT),
      secure: Number(myEnvironment.SMTP_PORT) === 465,
      auth: {
        user: myEnvironment.SMTP_USER,
        pass: myEnvironment.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized:
          myEnvironment.NODE_ENV === "production" ? true : false,
      },
    });
  }

  // ✅ Generic email sending method
  private async sendMail({
    email,
    subject,
    MailgenContent,
  }: Imail): Promise<void> {
    try {
      const emailBody = this.mailGenerator.generate(MailgenContent);
      const emailText = this.mailGenerator.generatePlaintext(MailgenContent);

      const emailOptions = {
        from: `oorooree<${myEnvironment.SMTP_USER}>`,
        to: email,
        subject: subject,
        text: emailText,
        html: emailBody,
      };

      await this.transporter.sendMail(emailOptions);
      console.log("📩 Email sent successfully to", emailOptions.to);
    } catch (error) {
      console.error("❌ Error sending email:", error);
      throw error;
    }
  }

  // ✅ Send verification email
  public async sendVerifyAccountMail({
    email,
    name,
    otp,
  }: IVerifyAccountMail): Promise<void> {
    const MailgenContent = {
      body: {
        name: name || "User",
        intro:
          "Welcome to oorooree! Please verify your account to get started.",
        instructions:
          "Use the following One-Time Password (OTP) to verify your account:",
        code: {
          text: otp,
          style: {
            "font-size": "24px",
            "font-weight": "bold",
            color: "#22BC66",
            margin: "20px 0",
          },
        },
        outro: [
          "This OTP is valid for 15 minutes.",
          "If you didn't sign up for an oorooree account, please ignore this email.",
        ],
      },
    };

    await this.sendMail({
      email,
      subject: "Verify Your oorooree Account - OTP",
      MailgenContent,
    });
  }

  // ✅ Send forgot password email
  public async sendForgetPasswordMail({
    email,
    name,
    otp,
  }: IForgetPasswordMail): Promise<void> {
    const MailgenContent = {
      body: {
        name: name || "User",
        intro: "You have requested a password reset for your oorooree account.",
        instructions:
          "Please use the following One-Time Password (OTP) to reset your password:",
        code: {
          text: otp,
          style: {
            "font-size": "24px",
            "font-weight": "bold",
            color: "#22BC66",
            margin: "20px 0",
          },
        },
        outro: [
          "This OTP is valid for 10 minutes.",
          "If you didn't request a password reset, please ignore this email or contact support.",
        ],
      },
    };

    await this.sendMail({
      email,
      subject: "Password Reset OTP",
      MailgenContent,
    });
  }
}

// Export singleton instance
export const emailHelper = new EmailHelper();
