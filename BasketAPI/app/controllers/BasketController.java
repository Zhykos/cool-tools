package controllers;

import java.util.*;
import play.libs.Json;
import play.mvc.*;
import play.mvc.Http.*;

public class BasketController extends Controller {

    private final List<BasketEntity> fakeDatabase = new ArrayList<>();

    public Result getBasket(String userId) {
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
            return ok(Json.toJson(dto));
        }
        return notFound();
    }

    public Result createBasket(Request request, String userId) {
        var body = request.body().parseJson(CreateBasketDTO.class);

        if (body.isPresent()) {
            var basket = new BasketEntity();
            Json.toJson(basket);
            basket.userId = userId;
            basket.productId = body.get().productId;
            fakeDatabase.add(basket);
            var dto = new BasketDTO();
            dto.productId = basket.productId;
            dto.userId = basket.userId;
            dto.basketId = basket.hashCode();

            return created(Json.toJson(dto)).withHeader(
                "Access-Control-Allow-Origin",
                "*"
            );
        }

        return badRequest();
    }

    public Result preflightCreateBasket(String userId) {
        System.out.println("Preflight request " + userId);
        return ok()
            .withHeader("Access-Control-Allow-Origin", "*")
            .withHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS"
            )
            .withHeader("Access-Control-Allow-Headers", "*")
            .withHeader("Access-Control-Allow-Credentials", "true")
            .withHeader("Access-Control-Max-Age", "3600");
    }
}
