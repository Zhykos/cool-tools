package fr.zhykos.cool.tools.user;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {

	private final UserService userService;
	private final UserMapper mapper;

	@PostMapping
	@CrossOrigin
	public ResponseEntity<UserDTO> createUser() {
		final var createdUser = userService.createUser();
		return ResponseEntity.created(URI.create("http://localhost:8999/user/" + createdUser.uuid()))
				.body(mapper.domainToDto(createdUser));
	}

	@GetMapping
	@CrossOrigin
	public ResponseEntity<List<UserDTO>> listUsers() {
		final var users = userService.listUsers();
		return ResponseEntity.ok(users.parallelStream().map(mapper::domainToDto).toList());
	}

}
