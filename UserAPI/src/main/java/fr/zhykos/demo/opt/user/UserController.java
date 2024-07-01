package fr.zhykos.demo.opt.user;

import java.net.URI;
import java.util.List;

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
public class UserController {

	private final UserService userService;
	private final UserMapper mapper;

	@PostMapping
	public ResponseEntity<UserDTO> createUser(@RequestBody final UserCreationDTO dto) {
		final var createdUser = userService.createUser(dto.name());
		return ResponseEntity.created(URI.create("http://localhost:8080/user/" + createdUser.getUuid()))
				.body(mapper.domainToDto(createdUser));
	}

	@GetMapping
	public ResponseEntity<List<UserDTO>> listUsers() {
		final var users = userService.listUsers();
		return ResponseEntity.ok(users.parallelStream().map(mapper::domainToDto).toList());
	}

	@GetMapping("/fail")
	public ResponseEntity<Object> fail() {
		userService.fail();
		return ResponseEntity.noContent().build();
	}

}
