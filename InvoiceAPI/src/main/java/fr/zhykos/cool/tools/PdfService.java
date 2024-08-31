package fr.zhykos.cool.tools;

import jakarta.enterprise.context.ApplicationScoped;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

@Slf4j
@ApplicationScoped
public class PdfService {

    public void generatePdf(Invoice invoice) {
        try(PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            // The generated PDF is crap, but it's just an example and not the point of this example
            try(PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
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
            }

            document.save("invoice-" + invoice.getUuid() + ".pdf");
        } catch (Exception e) {
            log.error("Error while generating PDF", e);
        }
    }

}
