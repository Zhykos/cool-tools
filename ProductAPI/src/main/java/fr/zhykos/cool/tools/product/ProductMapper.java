package fr.zhykos.cool.tools.product;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {

	Product entityToDomain(ProductEntity entity);

	ProductDTO domainToDto(Product product);

}
