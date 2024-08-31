package fr.zhykos.cool.tools;

import org.mapstruct.Mapper;

@Mapper(componentModel = "cdi")
public interface GeolocationMapper {

	Geolocation dtoToDomain(GeolocationDTO dto);

}
