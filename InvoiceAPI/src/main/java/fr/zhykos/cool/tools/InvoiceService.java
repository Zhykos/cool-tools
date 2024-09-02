package fr.zhykos.cool.tools;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.io.File;
import java.util.List;

@ApplicationScoped
public class InvoiceService {

    @Inject
    private InvoiceMapper mapper;

    @Inject
    private InvoiceRepository repository;

    @Inject
    private GeolocationService geolocationService;

    @Inject
    private PdfService pdfService;

    @Inject
    private GedService gedService;

    public void saveInvoice(Invoice invoice) {
        var location = geolocationService.getLocation();
        invoice.setUserAddress(location.getName());
        var savedInvoice = repository.createInvoice(invoice);
        var generatedFile = pdfService.generatePdf(savedInvoice);
        generatedFile.ifPresentOrElse(
                file -> onInvoiceSaved(file, savedInvoice),
                () -> System.err.println("Error while generating PDF")
        );
    }

    private void onInvoiceSaved(File file, Invoice invoice) {
        System.out.println("Invoice saved: " + invoice);
        var uploadedFile = gedService.sendToGed(file);
        uploadedFile.ifPresentOrElse(
                fileGed -> {
                    System.out.println("File uploaded to GED: " + fileGed);
                    invoice.setPdfId(fileGed.getId());
                    repository.saveInvoice(invoice);
                },
                () -> System.err.println("Error while sending file to GED")
        );
    }

    public void saveFakeInvoice() {
        InvoiceMQ mq = InvoiceMQ.builder()
                .orderId("123")
                .userUUID("123")
                .userName("John Doe")
                .productUUID("123")
                .productName("Product")
                .price(123.45f)
                .build();

        Invoice invoice = mapper.mqToDomain(mq);

        saveInvoice(invoice);
    }

    public List<Invoice> getAllInvoices() {
        return repository.getAllInvoices()
                .stream()
                .map(mapper::entityToDomain)
                .toList();
    }
}
