package fr.zhykos.cool.tools;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@Path("/geolocate")
@RegisterRestClient(baseUri = "https://api.vatcomply.com")
public interface GeolocationClient {

    @GET
    GeolocationDTO getLocation();

}
