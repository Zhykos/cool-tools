package fr.zhykos.cool.tools;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.reactive.ReactiveMailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.io.File;

@ApplicationScoped
public class SendEmailService {

    @Inject
    private ReactiveMailer mailer;

    public void sendEmail(File file, Invoice invoice) {
        try {
            System.out.println("Sending email...");

            var emailTo = invoice.getUserName().replace(' ', '-').trim() + "@example.com";

            var mail = Mail
                    .withText(emailTo, "Invoice", "Please find attached your invoice")
                    .setHtml("<h1>Invoice</h1><p>Please find attached your invoice</p>")
                    .addAttachment("invoice.pdf", file, "application/pdf");
            mailer.send(mail).onFailure().invoke(failure ->
                System.err.println("Error while sending email: " + failure.getMessage())
            ).subscribe().with(result ->
                System.out.println("Email sent to: " + emailTo)
            );
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error while sending email: " + e.getMessage());
        }
    }

}
