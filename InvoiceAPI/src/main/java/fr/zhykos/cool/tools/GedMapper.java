package fr.zhykos.cool.tools;

import org.mapstruct.Mapper;

@Mapper(componentModel = "cdi")
public interface GedMapper {

	GedUploadedFile dtoToDomain(GedDTO dto);

}
