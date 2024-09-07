package fr.zhykos.cool.tools.product;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@AllArgsConstructor
@RestController
@RequestMapping("/product")
@Tag(name = "Product", description = "Product API")
public class ProductController {

	private final ProductService service;
	private final ProductMapper mapper;

	@CrossOrigin
	@GetMapping(produces = "application/stream+json")
	@Operation(summary = "List all products (flux)", description = "List all products in a reactive way")
	@ApiResponse(responseCode = "200", description = "List of products (flux)")
	public Flux<ProductDTO> listProducts() {
		final var products = service.listProducts();
		return products.map(mapper::domainToDto);
	}

}
