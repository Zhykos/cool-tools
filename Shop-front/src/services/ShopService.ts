import type { BasketDTO } from "@/dto/BasketDTO";
import type { OrderDTO } from "@/dto/OrderDTO";
import type { ProductDTO } from "@/dto/ProductDTO";
import type { UserDTO } from "@/dto/UserDTO";

export const createUser = async (username: string): Promise<UserDTO> => {
  const res = await fetch(import.meta.env.VITE_USER_API_URI as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: username }),
  });

  return await res.json();
};

export const getUsers = async (): Promise<UserDTO[]> => {
  const res = await fetch(import.meta.env.VITE_USER_API_URI as string);
  return await res.json();
};

export const getProducts = async (): Promise<ProductDTO[]> => {
  // Do not really treat the flux and return only the first 10 products
  const res = await fetch(import.meta.env.VITE_PRODUCT_API_URI as string);
  const allTxt: string = await res.text();
  return allTxt
    .split(/\n|\r/)
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line) as ProductDTO)
    .slice(0, 10);
};

export const createBasket = async (
  user: UserDTO,
  product: ProductDTO,
): Promise<BasketDTO> => {
  const res = await fetch(`${import.meta.env.VITE_BASKET_API_URI as string}/${user.uuid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId: product.uuid }),
  });
  return await res.json();
};

export const getBasket = async (user: UserDTO): Promise<BasketDTO> => {
  const res = await fetch(`${import.meta.env.VITE_BASKET_API_URI as string}/${user.uuid}`);
  return await res.json();
};

export const createOrder = async (basket: BasketDTO): Promise<OrderDTO> => {
  const res = await fetch(import.meta.env.VITE_ORDER_API_URI as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      UserID: basket.userId,
      ProductID: basket.productId,
    }),
  });
  return await res.json();
};
