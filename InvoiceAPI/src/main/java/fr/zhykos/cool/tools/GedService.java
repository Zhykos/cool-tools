package fr.zhykos.cool.tools;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.resteasy.reactive.client.api.ClientMultipartForm;

import java.io.File;
import java.util.Optional;

@ApplicationScoped
public class GedService {

    @Inject
    @RestClient
    private GedClient gedClient;

    @Inject
    private GedMapper mapper;

    public Optional<GedUploadedFile> sendToGed(File file) {
        try {
            System.out.println("Sending file to GED: " + file.getName());
            var myAccountDTO = gedClient.getMyAccount();
            System.out.println("My account: " + myAccountDTO);
            var body = GedCreateNodeBodyDTO.builder().ctype("document").parent_id(myAccountDTO.home_folder_id()).title(file.getName()).build();
            var createdNodeDTO = gedClient.createNode(body);
            System.out.println("Created node: " + createdNodeDTO);
            var clientMultipartForm = ClientMultipartForm.create().binaryFileUpload("file", file.getName(), file.getAbsolutePath(), "application/pdf");
            var result = gedClient.uploadFile(createdNodeDTO.id(), clientMultipartForm);
            System.out.println("Uploaded file: " + result);
            return Optional.of(mapper.dtoToDomain(result));
        } catch (Exception e) {
            System.err.println("Error while sending file to GED");
            e.printStackTrace();
            return Optional.empty();
        }
    }

}
