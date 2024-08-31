package fr.zhykos.cool.tools;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.eclipse.microprofile.reactive.messaging.Incoming;

@ApplicationScoped
public class OrderConsumer {

    @Inject
    private InvoiceMapper mapper;

    @Inject
    private InvoiceService service;

    @Incoming("orders")
    public void consumeOrders(ConsumerRecord<String, InvoiceMQ> record) {
        System.out.println("Consuming order: " + record.value() + " with key: " + record.key());
        InvoiceMQ value = record.value(); // Can be `null` if the incoming record has no value
        var invoice = mapper.mqToDomain(value);
        service.saveInvoice(invoice);
    }

}
