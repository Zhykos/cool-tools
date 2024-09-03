package fr.zhykos.cool.tools;

public record InvoiceDTO(
        String uuid,
        String orderId,
        String userUUID,
        String userName,
        String userAddress,
        String productUUID,
        String productName,
        float price,
        String pdfId
) {}
