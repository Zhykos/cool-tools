package fr.zhykos.cool.tools;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.MultivaluedHashMap;
import jakarta.ws.rs.core.MultivaluedMap;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.microprofile.rest.client.ext.ClientHeadersFactory;
import org.eclipse.microprofile.rest.client.inject.RestClient;

@Slf4j
@ApplicationScoped
public class GedClientHeader implements ClientHeadersFactory {

    @Inject
    @RestClient
    private GedAuthClient gedAuthClient;

    private static String token;

    @Override
    public MultivaluedMap<String, String> update(
            MultivaluedMap<String, String> incomingHeaders, MultivaluedMap<String, String> clientOutgoingHeaders) {
        final var result = new MultivaluedHashMap<String, String>();
        try {
            if (token == null) {
                log.info("Getting token");
                token = gedAuthClient.token(new GedAuthorizeBodyDTO()).access_token();
            }
            log.info("Token: {}", token);
            result.add("Authorization", "Bearer " + token);
            return result;
        } catch (Exception e) {
            log.error("Unable to create token", e);
            return result;
        }
    }
}