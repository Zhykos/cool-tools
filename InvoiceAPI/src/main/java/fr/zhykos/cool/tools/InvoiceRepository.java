package fr.zhykos.cool.tools;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class InvoiceRepository {

    @Inject
    private EntityManager entityManager;

    @Inject
    private InvoiceMapper mapper;

    @Transactional
    public Invoice createInvoice(Invoice invoice) {
        InvoiceEntity entity = mapper.domainToEntity(invoice);
        entity.setUuid(UUID.randomUUID().toString());
        return saveInvoice(entity);
    }

    @Transactional
    public Invoice saveInvoice(Invoice invoice) {
        InvoiceEntity entity = mapper.domainToEntity(invoice);
        return saveInvoice(entity);
    }

    private Invoice saveInvoice(InvoiceEntity entity) {
        entityManager.persist(entity);
        return mapper.entityToDomain(entity);
    }

    public List<InvoiceEntity> getAllInvoices() {
        return entityManager.createQuery("SELECT i FROM InvoiceEntity i", InvoiceEntity.class)
                .getResultList();
    }
}
