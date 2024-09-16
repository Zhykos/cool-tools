package fr.zhykos.cool.tools.benchmark;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BenchmarkMapper {

	BenchmarkUUID entityToDomain(BenchmarkEntity entity);

	BenchmarkDTO domainToDto(BenchmarkUUID benchmarkUUID);
}
