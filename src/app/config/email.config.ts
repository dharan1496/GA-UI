export const EmailConfig = {
    host: 'smtp.elasticemail.com',
    username: 'reset-password@ga.com',
    password: '6B1A1EF8D85A5AEBC9F2CFF9BF0048AEB0DA',
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
        http://localhost:4300/reset-password/${id}
        <br/>
        <br/>
        Regards,
        <br/>
        GA`
    }
}