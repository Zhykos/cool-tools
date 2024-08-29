package fr.zhykos.cool.tools;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class InvoiceMQ {

    private String orderId;

    private String userUUID;

    private String userName;

    private String productUUID;

    private String productName;

    private float price;
}
