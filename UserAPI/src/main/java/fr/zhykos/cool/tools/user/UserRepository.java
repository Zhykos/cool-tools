package fr.zhykos.cool.tools.user;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserRepository extends CrudRepository<UserEntity, Long> {
    List<UserEntity> deleteByUuid(String uuid);
}
