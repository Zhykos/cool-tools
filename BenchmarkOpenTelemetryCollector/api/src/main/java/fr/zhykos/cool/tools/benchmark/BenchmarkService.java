package fr.zhykos.cool.tools.benchmark;

import java.util.List;
import java.util.UUID;
import java.util.stream.StreamSupport;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@AllArgsConstructor
public class BenchmarkService {

	private final BenchmarkRepository repository;
	private final BenchmarkMapper mapper;

	public BenchmarkUUID createBenchmark() {
		final var entityToAddInRepository = BenchmarkEntity.builder().uuid(UUID.randomUUID().toString()).build();
		final var createdEntity = repository.save(entityToAddInRepository);
        log.info("New benchmark created: {}", createdEntity);
		return mapper.entityToDomain(createdEntity);
	}

	public List<BenchmarkUUID> listBenchmarks() {
		log.info("Listing all benchmarks");
		final Iterable<BenchmarkEntity> entities = repository.findAll();
		return StreamSupport.stream(entities.spliterator(), true).map(mapper::entityToDomain).toList();
	}

}
