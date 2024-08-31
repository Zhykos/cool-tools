package fr.zhykos.cool.tools;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class Invoice {

    private String uuid;

    private String orderId;

    private String userUUID;

    private String userName;

    private String userAddress;

    private String productUUID;

    private String productName;

    private float price;
}
