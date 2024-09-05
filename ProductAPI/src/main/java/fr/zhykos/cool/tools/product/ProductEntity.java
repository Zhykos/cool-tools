package fr.zhykos.cool.tools.product;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("products")
@Builder
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class ProductEntity {
    @Id
    private Long id;

    private String uuid;

    private String name;

    private String description;

    private double price;
}