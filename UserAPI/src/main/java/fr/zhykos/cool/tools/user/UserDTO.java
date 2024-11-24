package fr.zhykos.cool.tools.user;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User DTO")
public record UserDTO(
        @Schema(description = "User UUID")
        String uuid,

        @Schema(description = "User name")
        String name
) { }
