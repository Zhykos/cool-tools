package fr.zhykos.cool.tools;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.io.File;

@ApplicationScoped
public class GedService {

    @Inject
    @RestClient
    private GedClient gedClient;

    @Inject
    private GedMapper mapper;

    public GedUploadedFile sendToGed(File file) {
        var myAccountDTO = gedClient.getMyAccount();
        System.out.println("My account: " + myAccountDTO);
        var body = GedCreateNodeBodyDTO.builder().ctype("document").parent_id(myAccountDTO.home_folder_id()).title(file.getName()).build();
        var createdNodeDTO = gedClient.createNode(body);
        System.out.println("Created node: " + createdNodeDTO);
        var result = gedClient.uploadFile(createdNodeDTO.id(), file);
        System.out.println("Uploaded file: " + result);
        return mapper.dtoToDomain(result);
    }

}
