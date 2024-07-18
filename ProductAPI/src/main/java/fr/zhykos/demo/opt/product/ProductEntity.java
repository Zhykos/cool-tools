package fr.zhykos.demo.opt.product;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "products")
@Builder
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class ProductEntity {
    @Id
    @GeneratedValue
    private Long id;

    private String uuid;

    private String name;

    private String description;

    private double price;
}