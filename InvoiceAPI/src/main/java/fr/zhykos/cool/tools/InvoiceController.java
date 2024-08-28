package fr.zhykos.cool.tools;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.ResponseStatus;

import java.util.List;

@Path("/invoice")
public class InvoiceController {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @ResponseStatus(200)
    public List<InvoiceDTO> getAllInvoices() {
        return List.of(new InvoiceDTO("12zz"));
    }
}
