package fr.zhykos.cool.tools;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.rest.client.inject.RestClient;

@ApplicationScoped
public class GeolocationService {

    @Inject
    @RestClient
    private GeolocationClient geolocationClient;

    @Inject
    private GeolocationMapper mapper;

    public Geolocation getLocation() {
        var location = geolocationClient.getLocation();
        return mapper.dtoToDomain(location);
    }

}
