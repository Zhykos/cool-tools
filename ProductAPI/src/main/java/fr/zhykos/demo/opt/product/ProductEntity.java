package fr.zhykos.demo.opt.product;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public record ProductEntity(
        @Id
        @GeneratedValue
        Long id,

        String uuid,

        String name,

        String description,

        double price
) {
}
