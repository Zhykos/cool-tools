DROP TABLE if exists public.products;

CREATE TABLE public.products (
    id SERIAL PRIMARY KEY,
    "uuid" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL
);

-- Thanks ChatGPT for the data
INSERT INTO public.products (id, uuid, name, description, price) VALUES (1, '1d9f5cd4-d25e-4bc0-8459-694b359bf388', 'Zulu 346', 'Top choice for consumers.', 243.42);
INSERT INTO public.products (id, uuid, name, description, price) VALUES (2, 'c66607ba-7830-40c6-a8f3-1f8b0e9fa5a0', 'Uniform 904', 'Limited edition product.', 289.53);
INSERT INTO public.products (id, uuid, name, description, price) VALUES (3, 'b0a07547-89b0-47c0-8c05-1b8b6a7c55b5', 'Sierra 176', 'Highly recommended by experts.', 762.11);
INSERT INTO public.products (id, uuid, name, description, price) VALUES (4, '758939b3-7c95-449e-a98a-9547909de54a', 'Golf 684', 'Eco-friendly and reliable.', 502.06);
INSERT INTO public.products (id, uuid, name, description, price) VALUES (5, 'acf5d866-4b6e-439b-9d31-7934cabfb7ac', 'Tango 353', 'Made from premium materials.', 48.86);
INSERT INTO public.products (id, uuid, name, description, price) VALUES (6, '45a51f37-5e46-4c1b-a00f-7b710fa1363f', 'Quebec 830', 'Best value for the price.', 639.74);
INSERT INTO public.products (id, uuid, name, description, price) VALUES (7, '0ea44385-16f1-4aa9-98d1-013d0a082145', 'Alpha 466', 'Limited edition product.', 844.26);
INSERT INTO public.products (id, uuid, name, description, price) VALUES (8, '655d4e2b-99fb-45fd-9b17-71e6dcbce04f', 'Delta 406', 'High quality and durable.', 525.35);
INSERT INTO public.products (id, uuid, name, description, price) VALUES (9, 'f2aa1141-08bc-427c-81f2-a5662a18412a', 'November 880', 'Customer favorite with great reviews.', 859.49);
INSERT INTO public.products (id, uuid, name, description, price) VALUES (10, 'ad49de78-3e95-4f19-addd-a3cfd7b419b0', 'Bravo 646', 'Innovative design and superior performance.', 426.92);
INSERT INTO public.products (id, uuid, name, description, price) VALUES (11, '8f1656ed-b5b6-49aa-9179-c0e1545c1de3', 'India 831', 'Innovative design and superior performance.', 862.82);
INSERT INTO public.products (id, uuid, name, description, price) VALUES (12, 'd8b88f70-542b-4a67-b2dc-87c58e27dde9', 'Hotel 238', 'Highly recommended by experts.', 702.06);
INSERT INTO public.products (id, uuid, name, description, price) VALUES (13, 'd47e4905-460c-4a70-be19-ba9c67414d5f', 'X-ray 246', 'Innovative design and superior performance.', 609.24);
INSERT INTO public.products (id, uuid, name, description, price) VALUES (14, 'e6672667-0da1-41af-9cba-9c10890634d0', 'Mike 242', 'Eco-friendly and reliable.', 579.13);
INSERT INTO public.products (id, uuid, name, description, price) VALUES (15, '63ba97a0-f282-4ad7-9600-f3aebea4990b', 'November 328', 'High quality and durable.', 163.37);