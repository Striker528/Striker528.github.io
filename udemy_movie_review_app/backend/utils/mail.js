exports.generateOTP = (otp_length = 6) => {
    // generate 6 digit otp
    let OTP = '';
    for (let i = 0; i < otp_length; i++){
        const randomVal = Math.round(Math.random() * 9);
        OTP += randomVal;
    }

    return OTP;
}

exports.generateMailTransporter = () =>
    nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "74abe711ed1086",
          pass: "71a6a94152743a"
        },
    });