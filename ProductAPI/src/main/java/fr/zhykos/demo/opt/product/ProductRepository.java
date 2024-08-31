package fr.zhykos.demo.opt.product;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface ProductRepository extends ReactiveCrudRepository<ProductEntity, Long> {

}
