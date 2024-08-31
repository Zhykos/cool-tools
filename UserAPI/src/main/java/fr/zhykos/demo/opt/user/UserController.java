package fr.zhykos.demo.opt.user;

import java.net.URI;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/user")
@Tag(name = "User", description = "User API")
public class UserController {

	private final UserService userService;
	private final UserMapper mapper;

	@PostMapping
	@Operation(summary = "Create a user", description = "Create a user")
	@Parameter(name = "dto", description = "User creation DTO", required = true)
	@ApiResponse(responseCode = "201", description = "User created")
	public ResponseEntity<UserDTO> createUser(@RequestBody final UserCreationDTO dto) {
		final var createdUser = userService.createUser(dto.name());
		return ResponseEntity.created(URI.create("http://localhost:9001/user/" + createdUser.uuid()))
				.body(mapper.domainToDto(createdUser));
	}

	@GetMapping
	@Operation(summary = "List all users", description = "List all users")
	@ApiResponse(responseCode = "200", description = "List of users")
	public ResponseEntity<List<UserDTO>> listUsers() {
		final var users = userService.listUsers();
		return ResponseEntity.ok(users.parallelStream().map(mapper::domainToDto).toList());
	}

	@GetMapping("/fail")
	@Operation(summary = "Fail", description = "Fail")
	@ApiResponse(responseCode = "204", description = "Fail")
	public ResponseEntity<Object> fail() {
		userService.fail();
		return ResponseEntity.noContent().build();
	}

}
