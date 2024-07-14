package fr.zhykos.demo.opt.user;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User creation DTO")
public record UserCreationDTO(
        @Schema(description = "User name")
        String name
) { }
