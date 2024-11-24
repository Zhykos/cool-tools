package fr.zhykos.cool.tools;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "cdi")
public interface InvoiceMapper {

	Invoice entityToDomain(InvoiceEntity entity);

	InvoiceDTO domainToDto(Invoice domain);

	InvoiceEntity domainToEntity(Invoice domain);

	@Mapping(target = "uuid", ignore = true)
	@Mapping(target = "userAddress", ignore = true)
	Invoice mqToDomain(InvoiceMQ mq);
}
