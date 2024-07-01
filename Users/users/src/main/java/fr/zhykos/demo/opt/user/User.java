package fr.zhykos.demo.opt.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class User {
	private final String uuid;
	private final String name;
}
