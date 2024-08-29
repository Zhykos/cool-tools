package fr.zhykos.cool.tools;

import org.mapstruct.Mapper;

@Mapper(componentModel = "cdi")
public interface InvoiceMapper {

	Invoice entityToDomain(InvoiceEntity entity);

	InvoiceDTO domainToDto(Invoice domain);

	InvoiceEntity domainToEntity(Invoice domain);

	Invoice mqToDomain(InvoiceMQ mq);
}
