package fr.zhykos.cool.tools.benchmark;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/benchmark")
public class BenchmarkController {

	private final BenchmarkService benchmarkService;
	private final BenchmarkMapper mapper;

	@PostMapping
	@CrossOrigin
	public ResponseEntity<BenchmarkDTO> createBenchmark() {
		final var benchmark = benchmarkService.createBenchmark();
		return ResponseEntity.created(URI.create("http://localhost:8999/benchmark/" + benchmark.uuid()))
				.body(mapper.domainToDto(benchmark));
	}

	@GetMapping
	@CrossOrigin
	public ResponseEntity<List<BenchmarkDTO>> listBenchmarks() {
		final var benchmarks = benchmarkService.listBenchmarks();
		return ResponseEntity.ok(benchmarks.parallelStream().map(mapper::domainToDto).toList());
	}

}
