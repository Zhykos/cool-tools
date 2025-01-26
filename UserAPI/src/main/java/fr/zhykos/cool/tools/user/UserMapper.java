package fr.zhykos.cool.tools.user;

import org.springframework.stereotype.Component;

@Component
public class UserMapper {

	public User entityToDomain(final UserEntity entity) {
		return new User(entity.getUuid(), entity.getName());
	}

	public UserDTO domainToDto(final User user) {
		return new UserDTO(user.uuid(), user.name());
	}
}
