package com.jwtDemo.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;


@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    private final TemplateEngine templateEngine;
    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    //things to send in the email message
    public void sendWelcomeEmail(String toEmail,String name){
        SimpleMailMessage message =new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to our Platform");
        message.setText("Hello"+name+"\n\n Thanks for registering with us!\n\n Regards, \nAuth team");
        mailSender.send(message);
    }

//
//    public void sendResetOtpEmail(String toEmail,String otp){
//        SimpleMailMessage message =new SimpleMailMessage();
//        message.setFrom(fromEmail);
//        message.setTo(toEmail);
//        message.setSubject("password reset OTP");
//        message.setText("your otp for resetting for password is "+otp+" use this OTP to proceed with resetting your password.");
//        mailSender.send(message);
//    }
//
//    public void sendOtpEmail(String toEmail,String otp){
//        SimpleMailMessage message =new SimpleMailMessage();
//        message.setFrom(fromEmail);
//        message.setTo(toEmail);
//        message.setSubject("account verification OTP");
//        message.setText("your otp is "+otp+". verify OTP using this otp");
//        mailSender.send(message);
//    }


    public void sendOtpEmail(String toEmail,String otp) throws MessagingException {
        Context context =new Context();
        context.setVariable("email",toEmail);
        context.setVariable("otp",otp);

        String process= templateEngine.process("verify-email",context);
        MimeMessage mineMessage=mailSender.createMimeMessage();
        MimeMessageHelper helper=new MimeMessageHelper(mineMessage);

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Account Verification OTP");
        helper.setText(process,true);

        mailSender.send(mineMessage);
    }

    public void sendResetOtpEmail(String toEmail,String otp) throws MessagingException {
        Context context =new Context();
        context.setVariable("email",toEmail);
        context.setVariable("otp",otp);

        String process= templateEngine.process("password-reset-email",context);
        MimeMessage mineMessage=mailSender.createMimeMessage();
        MimeMessageHelper helper=new MimeMessageHelper(mineMessage);

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Forgot your password ?");
        helper.setText(process,true);

        mailSender.send(mineMessage);
    }

}
