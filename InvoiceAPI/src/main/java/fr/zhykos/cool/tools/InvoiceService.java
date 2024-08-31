package fr.zhykos.cool.tools;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

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

    public void saveInvoice(Invoice invoice) {
        var location = geolocationService.getLocation();
        invoice.setUserAddress(location.getName());
        var savedInvoice = repository.createInvoice(invoice);
        pdfService.generatePdf(savedInvoice);
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
