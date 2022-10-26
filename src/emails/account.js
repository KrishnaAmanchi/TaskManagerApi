const sgMail=require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:"amanchikrishna2018@gmail.com",
        subject:"Welcome to the App",
        text:`Hello ${name}, Welcome to the task manager app `
        
    })
}

const sendCancellationEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:"amanchikrishna2018@gmail.com",
        subject:"Send off",
        text:`Hello ${name}, This is the cancellation email`
    })
}

module.exports={
    sendWelcomeEmail,
    sendCancellationEmail
}

