const  nodemailer = require("nodemailer");

exports.sendEmail = async (emailTo,subject,name,id,password) =>  {
    //send email
    if(emailTo){
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp-relay.sendinblue.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'waqar@whetstonez.com', // generated ethereal user
                pass: 'V5LA3D92KhOfjMB1', // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"EZPick" < info@ezpick.co>', // sender address
            to: emailTo, // list of receivers
            subject: subject+" ✔", // Subject line
            html: `

            <!DOCTYPE html>
<html lang="en" style="background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;">
  <head style="background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;">
    <meta charset="UTF-8" style="background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" style="background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" style="background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;">
    <link rel="preconnect" href="https://fonts.googleapis.com" style="background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin style="background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;">
    
    <title style="background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;">Document</title>
  </head>
  
  <body style="background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;">
    <div class="bg" style="background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;width: 100%;height: 969px;background: #ffffff 0% 0% no-repeat padding-box;">
      <div class="gradient-bg" style="background-color: transparent;margin: 0;padding: 10px;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;width: 100%;height: 380px;background: transparent
        linear-gradient(180deg, #ffbd1db3 0%, #ffbd1d66 31%, #ffffff00 100%) 0%
        0% no-repeat padding-box;padding-top: 70px">
        <div class="card" style={background-color: transparent;margin: 0;padding: 10px;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;height: 649px;background: #ffffff 0% 0% no-repeat padding-box;box-shadow: 0px 3px 6px #00000029;border-radius: 6px;display: flex;flex-direction: column;align-items: center}>
        <div style="text-align: center; margin-bottom: 30px">
        <img src="https://ezpick.s3.amazonaws.com/email-template/logo.png" alt="logo" style="background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;">
          </div>
          <p class="bold-text" style="font-size: 20px;margin-top: 30px;background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;font-weight: 800;text-align: center;">
            SHARE USERNAME & PASSWORD
          </p>
          <p class="bold-text" style="font-size: 20px;margin-top: 30px;background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;font-weight: 800;text-align: center;">
            Hi ${name}
          </p>

          <p class="regular-text" style="background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;size: 15px;margin-top: 30px;text-align: center">Here is your Account Detail</p>
          <p class="regular-text" style="background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;size: 15px;margin-top: 30px;text-align: center">Username</p>
          <p class="bold-text" style="font-size: 20px;margin-top: 15px;background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;font-weight: 800;text-align: center;">
            ${id}
          </p>
          <p class="regular-text" style="background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;size: 15px;margin-top: 30px;text-align: center">Password</p>
          <p class="bold-text" style="font-size: 20px;margin-top: 15px;background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;font-weight: 800;text-align: center;">
            ${password}
          </p>
          <div style="text-align: center; margin-bottom: 30px">
          <p class="email-text" style="background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;color: #1959c9;font-size: 18px;margin-top: mailto:40px;">support@ezpick.com</p>
          <p class="small-text" style="margin-top: 30px;background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;font-size: 15px;">Thank you,</p>
          <p class="small-text" style="margin-top: 20px;background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;font-size: 15px;">The Ezpick Team</p>
          </div>
        </div>
        <div style="margin-top: 40px;background-color: transparent;margin: 0;padding: 0;box-sizing: border-box;font-family: &quot;Montserrat&quot;, sans-serif;">
          <img src="https://ezpick.s3.amazonaws.com/email-template/banner.png" alt="image" width="100%" height="339px">
        </div>
      </div>
    </div>
  </body>
</html>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    }


}
