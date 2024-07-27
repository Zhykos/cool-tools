package controllers;

import java.util.*;
import play.api.libs.json.*;
import play.mvc.*;
import play.mvc.Http.*;

public class BasketController extends Controller {

    private final List<BasketEntity> fakeDatabase = new ArrayList<>();

    public Result getBasket(String userId) {
        var basketOpt = fakeDatabase.stream()
            .filter(basket -> basket.userId.equals(userId))
            .findFirst();
        if (basketOpt.isPresent()) {
            return ok("ProductID = " + basketOpt.get().productId);
        }
        return notFound();
    }

    public Result createBasket(Request request, String userId) {
        var body = request.body().parseJson(CreateBasketDTO.class);
        if (body.isPresent()) {
            var basket = new BasketEntity();
            basket.userId = userId;
            basket.productId = body.get().productId;
            fakeDatabase.add(basket);
            return created();
        }
        return badRequest();
    }

}
