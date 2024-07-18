package fr.zhykos.demo.opt.product;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Product DTO")
public record ProductDTO(
        @Schema(description = "Product UUID")
        String uuid,

        @Schema(description = "Product name")
        String name,

        @Schema(description = "Product description")
        String description,

        @Schema(description = "Product price")
        double price
) { }
