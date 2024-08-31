package fr.zhykos.demo.opt.product;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Slf4j
@Service
@AllArgsConstructor
public class ProductService {

	private final ProductRepository repository;
	private final ProductMapper mapper;

	public Flux<Product> listProducts() {
		final Flux<ProductEntity> entities = repository.findAll();
		return entities.map(mapper::entityToDomain);
	}

}
