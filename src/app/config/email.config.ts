import { environment } from 'src/environment/environment';

export const EmailConfig = {
  host: 'smtp.elasticemail.com',
  usrname: 'reset-password@ga.com',
  pwd: '6B1A1EF8D85A5AEBC9F2CFF9BF0048AEB0DA',
  from: 'dharan1496@gmail.com',
  Subject: 'Reset password - GA',
  body: (id: string) => {
    return `Hi,
        <br/>
        <br/>
        We received a request to reset the password for your account.
        <br/>
        <br/>
        To reset your password, use below url:
        <br/>
        ${environment.baseurl}/reset-password/${id}
        <br/>
        <br/>
        Regards,
        <br/>
        GA
        <br/>
        <br/>
        `;
  },
  abstractAPIUrl:
    'https://emailvalidation.abstractapi.com/v1/?api_key=cc8c91cd6dc6445fb095084209904124&email=',
};
