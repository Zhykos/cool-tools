package fr.zhykos.cool.tools;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class InvoiceMQ {

    @JsonProperty("OrderID")
    private String orderId;

    @JsonProperty("UserID")
    private String userUUID;

    @JsonProperty("UserName")
    private String userName;

    @JsonProperty("ProductID")
    private String productUUID;

    @JsonProperty("ProductName")
    private String productName;

    @JsonProperty("Price")
    private float price;
}
