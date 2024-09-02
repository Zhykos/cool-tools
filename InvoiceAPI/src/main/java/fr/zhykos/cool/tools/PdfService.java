package fr.zhykos.cool.tools;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import jakarta.enterprise.context.ApplicationScoped;

import java.io.File;
import java.util.Optional;

@ApplicationScoped
public class PdfService {

    public Optional<File> generatePdf(Invoice invoice) {
        String filename = "invoice-" + invoice.getUuid() + ".pdf";
        try (Document document = new Document(new PdfDocument(new PdfWriter(filename)))) {
            document.add(new Paragraph("Your invoice"));
            document.add(new Paragraph(invoice.getUserName()));
            document.add(new Paragraph(invoice.getUserAddress()));
            document.add(new Paragraph("Product: " + invoice.getProductName()));
            document.add(new Paragraph("Price: " + invoice.getPrice()));
            document.flush();
            return Optional.of(new File(filename));
        } catch (Exception e) {
            System.err.println("Error while generating PDF");
            e.printStackTrace();
            return Optional.empty();
        }
    }

}
