package fr.zhykos.cool.tools;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.annotation.RegisterClientHeaders;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.jboss.resteasy.reactive.client.api.ClientMultipartForm;

@RegisterClientHeaders(GedClientHeader.class)
@RegisterRestClient(configKey = "papermerge-api")
public interface GedClient {

    @GET
    @Path("/users/me")
    GedMyAccountDTO getMyAccount();

    @POST
    @Path("/nodes/")
    GedCreatedNodeDTO createNode(GedCreateNodeBodyDTO body);

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/documents/{document_id}/upload")
    GedDTO uploadFile(@PathParam("document_id") String documentId, ClientMultipartForm form);

    @GET
    @Path("/nodes/{parent_id}")
    GedNodesDTO getNodes(@PathParam("parent_id") String parentId);

    @GET
    @Path("/documents/{document_id}")
    GedDocumentsDTO getDocuments(@PathParam("document_id") String documentId);

    @GET
    @Produces("application/pdf")
    @Path("/document-versions/{document_version_id}/download")
    byte[] download(@PathParam("document_version_id") String documentVersionId);

}
