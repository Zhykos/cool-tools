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
        entityManager.persist(entity);
        return mapper.entityToDomain(entity);
    }

    public InvoiceEntity getInvoiceFromOrderId(String orderId) {
        return entityManager.createQuery("SELECT i FROM InvoiceEntity i WHERE i.orderId = :orderId", InvoiceEntity.class)
                .setParameter("orderId", orderId)
                .getSingleResult();
    }

    public List<InvoiceEntity> getAllInvoices() {
        return entityManager.createQuery("SELECT i FROM InvoiceEntity i", InvoiceEntity.class)
                .getResultList();
    }
}
