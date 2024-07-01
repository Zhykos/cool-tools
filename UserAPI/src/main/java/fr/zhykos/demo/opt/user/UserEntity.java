package fr.zhykos.demo.opt.user;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Builder
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class UserEntity {
	@Id
	@GeneratedValue
	private Long id;

	private final String uuid;

	private final String name;
}
