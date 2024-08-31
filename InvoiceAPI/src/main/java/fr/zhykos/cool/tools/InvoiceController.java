package fr.zhykos.cool.tools;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.ResponseStatus;

import java.util.List;

@Path("/invoice")
public class InvoiceController {

    @Inject
    private InvoiceService service;

    @Inject
    private InvoiceMapper mapper;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @ResponseStatus(200)
    public List<InvoiceDTO> getAllInvoices() {
        return service.getAllInvoices()
                .stream()
                .map(mapper::domainToDto)
                .toList();
    }

    @POST
    @ResponseStatus(201)
    public void saveInvoice() {
        service.saveFakeInvoice();
    }
}
