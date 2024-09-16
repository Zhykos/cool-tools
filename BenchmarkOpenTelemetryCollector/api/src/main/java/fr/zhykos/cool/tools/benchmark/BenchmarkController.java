package fr.zhykos.cool.tools.benchmark;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.AllArgsConstructor;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/benchmark")
public class BenchmarkController {

    @GetMapping
    @CrossOrigin
    public ResponseEntity<BenchmarkDTO> getBenchmark() throws NoSuchAlgorithmException {
		log.info("BenchmarkController.getBenchmark");
        final var stringBuilder = new StringBuilder();
        for (int i = 0; i < 100_000; i++) {
            stringBuilder.append(hash());
        }
        return ResponseEntity.ok(new BenchmarkDTO(hash(stringBuilder.toString())));
    }

    private static String hash() throws NoSuchAlgorithmException {
        return hash(UUID.randomUUID().toString());
    }

    private static String hash(final String str) throws NoSuchAlgorithmException {
        final var messageDigest = MessageDigest.getInstance("SHA-512");
        messageDigest.update(str.getBytes());
        return new String(messageDigest.digest());
    }

}
