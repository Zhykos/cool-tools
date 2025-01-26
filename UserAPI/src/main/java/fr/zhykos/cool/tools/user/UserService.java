package fr.zhykos.cool.tools.user;

import java.util.List;
import java.util.UUID;
import java.util.stream.StreamSupport;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@AllArgsConstructor
public class UserService {

	private final UserRepository usersRepository;
	private final UserMapper mapper;

	public User createUser(final String name) {
		final var entityToAddInRepository = UserEntity.builder().uuid(UUID.randomUUID().toString()).name(name).build();
		final var createdEntity = usersRepository.save(entityToAddInRepository);
        log.info("New user created: {}", createdEntity);
		return mapper.entityToDomain(createdEntity);
	}

	public List<User> listUsers() {
		final Iterable<UserEntity> entities = usersRepository.findAll();
		return StreamSupport.stream(entities.spliterator(), true).map(mapper::entityToDomain).toList();
	}

	@Transactional
	public List<User> deleteUser(final String uuid) {
		log.info("Deleting user with UUID: {}", uuid);
		final var deleteUsers = usersRepository.deleteByUuid(uuid);
		log.info("Deleted users: {}", deleteUsers);
		return deleteUsers.stream().map(mapper::entityToDomain).toList();
	}

}
