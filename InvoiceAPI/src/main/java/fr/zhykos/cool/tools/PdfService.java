package fr.zhykos.cool.tools;

import jakarta.enterprise.context.ApplicationScoped;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

import java.io.File;
import java.util.Optional;

@ApplicationScoped
public class PdfService {

    public Optional<File> generatePdf(Invoice invoice) {
        try(PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            // The generated PDF is crap, but it's just an example and not the point of this example
            try(PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.COURIER), 12);
                contentStream.beginText();
                contentStream.showText("Your invoice");
                contentStream.newLine();
                contentStream.showText(invoice.getUserName());
                contentStream.newLine();
                contentStream.showText(invoice.getUserAddress());
                contentStream.newLine();
                contentStream.showText("Product: " + invoice.getProductName());
                contentStream.newLine();
                contentStream.showText("Price: " + invoice.getPrice());
                contentStream.endText();
            } catch (Exception e) {
                System.err.println("Error while generating PDF");
                e.printStackTrace();
                return Optional.empty();
            }

            File file = new File("invoice-" + invoice.getUuid() + ".pdf");
            document.save(file);
            return Optional.of(file);
        } catch (Exception e) {
            System.err.println("Error while generating PDF");
            e.printStackTrace();
            return Optional.empty();
        }
    }

}
