package fr.zhykos.cool.tools;

import java.util.List;

public record GedDocumentsDTO(
        List<GedVersionDTO> versions
) {
}
