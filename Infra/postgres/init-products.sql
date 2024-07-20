DROP TABLE if exists public.products;

CREATE TABLE public.products (
    id SERIAL PRIMARY KEY,
    "uuid" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL
);

INSERT INTO public.products(id, "uuid", "name", description, price) VALUES (1, '316ea7ac-cecf-4806-9df0-03aebb062388', 'Product 001', 'Description 001', 1.1);
INSERT INTO public.products(id, "uuid", "name", description, price) VALUES (2, 'dfc3faca-39fd-499b-82f2-1b9a8bf3499d', 'Product 002', 'Description 002', 2.0);
INSERT INTO public.products(id, "uuid", "name", description, price) VALUES (3, '91ef4024-df7d-4e38-8338-d3e274e85c80', 'Product 003', 'Description 003', 3.14);
INSERT INTO public.products(id, "uuid", "name", description, price) VALUES (4, 'a50e8f15-c51a-4929-a1d0-95439cf390c1', 'Product 004', 'Description 004', 44.0);
INSERT INTO public.products(id, "uuid", "name", description, price) VALUES (5, '36fa4b1d-e1c5-412f-b7f2-5c6e58122a2f', 'Product 005', 'Description 005', 51.0);
INSERT INTO public.products(id, "uuid", "name", description, price) VALUES (6, '6a7227dc-4628-408e-8dd8-ae3be1f79575', 'Product 006', 'Description 006', 64.0);
INSERT INTO public.products(id, "uuid", "name", description, price) VALUES (7, '487ed4fa-cb20-479a-87cf-165006d9b979', 'Product 007', 'Description 007', 77.0);
INSERT INTO public.products(id, "uuid", "name", description, price) VALUES (8, '700b4780-0173-42f3-98ad-e031f72546ac', 'Product 008', 'Description 008', 85.0);
INSERT INTO public.products(id, "uuid", "name", description, price) VALUES (9, '3c895ad7-fb7e-4099-b982-a56039935f81', 'Product 009', 'Description 009', 99.0);
INSERT INTO public.products(id, "uuid", "name", description, price) VALUES (10, 'bc52be51-3123-4765-b312-85e61d3ac795', 'Product 010', 'Description 010', 100.0);