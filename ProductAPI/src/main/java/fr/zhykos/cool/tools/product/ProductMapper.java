package fr.zhykos.cool.tools.product;

import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public Product entityToDomain(final ProductEntity entity) {
        return new Product(
            entity.getUuid(),
            entity.getName(),
            entity.getDescription(),
            entity.getPrice()
        );
    }

    public ProductDTO domainToDto(final Product product) {
        return new ProductDTO(
            product.uuid(),
            product.name(),
            product.description(),
            product.price()
        );
    }
}
