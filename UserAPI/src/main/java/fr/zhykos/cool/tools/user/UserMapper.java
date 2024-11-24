package fr.zhykos.cool.tools.user;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

	User entityToDomain(UserEntity entity);

	UserDTO domainToDto(User user);
}
