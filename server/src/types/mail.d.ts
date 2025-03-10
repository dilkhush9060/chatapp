export interface Imail {
  email: string;
  subject: string;
  MailgenContent: any;
}

interface IForgetPasswordMail {
  email: string;
  name: string;
  otp: string;
}

interface IVerifyAccountMail {
  email: string;
  name: string;
  otp: string;
}
