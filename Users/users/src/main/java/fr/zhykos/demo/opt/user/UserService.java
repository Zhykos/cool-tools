package fr.zhykos.demo.opt.user;

import java.util.List;
import java.util.UUID;
import java.util.stream.StreamSupport;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@AllArgsConstructor
public class UserService {

	private final UserRepository usersRepository;
	private final UserMapper mapper;

	public User createUser(final String name) {
		final var entityToAddInRepository = UserEntity.builder().uuid(UUID.randomUUID().toString()).name(name).build();
		final var createdEntity = usersRepository.save(entityToAddInRepository);
		log.info("New user created: " + createdEntity);
		return mapper.entityToDomain(createdEntity);
	}

	public List<User> listUsers() {
		final Iterable<UserEntity> entities = usersRepository.findAll();
		return StreamSupport.stream(entities.spliterator(), true).map(mapper::entityToDomain).toList();
	}

}
