package fr.zhykos.cool.tools;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class InvoiceEntity {

    @Id
    private String uuid;

    private String orderId;

    private String userUUID;

    private String userName;

    private String userAddress;

    private String productUUID;

    private String productName;

    private float price;
}
