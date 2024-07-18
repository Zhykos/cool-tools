package fr.zhykos.demo.opt.product;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@Slf4j
@Service
@AllArgsConstructor
public class ProductService {

	private final ProductRepository repository;
	private final ProductMapper mapper;

	public Stream<Product> listProducts() {
		final Iterable<ProductEntity> entities = repository.findAll();
		return StreamSupport.stream(entities.spliterator(), true).map(mapper::entityToDomain);
	}

}
