package fr.zhykos.cool.tools.benchmark;

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
public class BenchmarkEntity {
	@Id
	@GeneratedValue
	private Long id;

	private final String uuid;
}
