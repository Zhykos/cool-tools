package fr.zhykos.cool.tools;

import jakarta.ws.rs.*;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@RegisterRestClient(configKey = "papermerge-api")
public interface GedAuthClient {

    @POST
    @Path("/token")
    GedAuthorizedDTO token(GedAuthorizeBodyDTO body);

}
