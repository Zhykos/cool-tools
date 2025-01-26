package fr.zhykos.cool.tools.basket;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.websocket.server.PathParam;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/basket")
@Tag(name = "Basket", description = "Basket API")
public class BasketController {

    private final List<BasketEntity> fakeDatabase = new ArrayList<>();

    @GetMapping("/{id}")
    @CrossOrigin
    public ResponseEntity<BasketDTO> getBasket(@PathVariable("id") String userId) {
        var basketOpt = fakeDatabase
            .stream()
            .filter(basket -> basket.userId.equals(userId))
            .findFirst();
        if (basketOpt.isPresent()) {
            BasketEntity basket = basketOpt.get();
            var dto = new BasketDTO();
            dto.productId = basket.productId;
            dto.userId = basket.userId;
            dto.basketId = basket.hashCode();
            
            return ResponseEntity.ok(dto);
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}")
    @CrossOrigin
    public ResponseEntity<BasketDTO> createBasket(@RequestBody final CreateBasketDTO body, @PathVariable("id") String userId) {
        var basket = new BasketEntity();
        basket.userId = userId;
        basket.productId = body.productId;
        fakeDatabase.add(basket);
        var dto = new BasketDTO();
        dto.productId = basket.productId;
        dto.userId = basket.userId;
        dto.basketId = basket.hashCode();
        return ResponseEntity.created(URI.create("")).body(dto);
    }

}
