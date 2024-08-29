package fr.zhykos.cool.tools;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
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
