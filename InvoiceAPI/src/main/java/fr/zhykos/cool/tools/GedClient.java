package fr.zhykos.cool.tools;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.annotation.ClientHeaderParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.jboss.resteasy.reactive.RestForm;

import java.io.File;

@ClientHeaderParam(name = "Authorization", value = "Bearer " + "${ged.token}")
@RegisterRestClient(baseUri = "http://localhost:12000/api")
public interface GedClient {

    @GET
    @Path("/users/me")
    GedMyAccountDTO getMyAccount();

    @POST
    @Path("/nodes/")
    GedCreatedNodeDTO createNode(GedCreateNodeBodyDTO body);

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Path("/documents/{document_id}/upload/")
    GedDTO uploadFile(@PathParam("document_id") String documentId, @RestForm File file);

}
