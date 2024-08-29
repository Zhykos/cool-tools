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

    public void saveInvoice() {
        InvoiceMQ mq = InvoiceMQ.builder()
                .orderId("123")
                .userUUID("123")
                .userName("John Doe")
                .productUUID("123")
                .productName("Product")
                .price(123.45f)
                .build();

        Invoice invoice = mapper.mqToDomain(mq);

        repository.createInvoice(invoice);
    }

    public List<Invoice> getAllInvoices() {
        return repository.getAllInvoices()
                .stream()
                .map(mapper::entityToDomain)
                .toList();
    }
}
