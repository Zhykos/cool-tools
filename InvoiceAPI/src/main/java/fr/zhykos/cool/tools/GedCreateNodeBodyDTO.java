package fr.zhykos.cool.tools;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class GedCreateNodeBodyDTO {
    private String ctype;
    private String parent_id;
    private String title;
}
