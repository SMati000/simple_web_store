--Las ruta de las imagenes se interpretan como relativas: a partir del root del proyecto del front, ./public/assets/...

INSERT INTO `product` (id, category, description, image, min_prev_req_days, name, price, rating, stock)
VALUES
(1, 0, 'Deliciosa torta de brownie con chocolate', '/productos/brownie.jpg', 2, 'Torta Brownie', 450.00, 5, 3),
(2, 1, 'Exquisito pie de lima con un toque ácido', '/productos/limepie.jpg', 3, 'Pie de Lima', 350.00, 4, 2),
(3, 0, 'Torta de zanahoria con frosting de queso crema', '/productos/carrot.jpg', 1, 'Torta Zanahoria', 500.00, 5, 4),
(4, 1, 'Alfajores de maicena caseros', '/productos/maicena.jpg', 2, 'Alfajores de Maicena', 150.00, 4, 6),
(5, 2, 'Tarta de almendra con toque dulce', '/productos/tartaAlmendra.jpg', 3, 'Tarta de Almendra', 400.00, 3, 5),
(6, 1, 'Cheesecake de frutilla fresco y delicioso', '/productos/cheescakeFrutilla.jpg', 1, 'Cheesecake Frutilla', 550.00, 5, 3),
(7, 2, 'Panes saborizados caseros, ideales para acompañar', '/productos/panesSaborizados.jpg', 2, 'Panes Saborizados', 200.00, 4, 4),
(8, 2, 'Chipa, tradicional receta de queso', '/productos/chipa.jpg', 4, 'Chipa', 100.00, 3, 2),
(9, 1, 'Tarta frutal con base de crema pastelera', '/productos/tartaFrutal.jpg', 3, 'Tarta Frutal', 450.00, 5, 1),
(10, 1, 'Pie de limón, perfecto equilibrio entre ácido y dulce', '/productos/pielemon.jpg', 2, 'Pie de Limón', 320.00, 4, 2),
(11, 1, 'Clásico tiramisú con café y cacao', '/productos/tiramisu.jpg', 5, 'Tiramisú', 500.00, 5, 2),
(12, 3, 'Cookies de avena y nuez, crujientes y saludables', '/productos/cookieAvenaYNuez.jpg', 1, 'Cookies Avena y Nuez', 180.00, 4, 6),
(13, 3, 'Paletas de chocolate para los más chicos', '/productos/pops.jpg', 1, 'Paletas de Chocolate', 100.00, 3, 4),
(14, 0, 'Torta Oreo con capas de galleta y crema', '/productos/tortaOreo.jpg', 3, 'Torta Oreo', 600.00, 5, 3),
(15, 1, 'Rogel con dulce de leche y merengue', '/productos/rogel.jpg', 2, 'Rogel', 450.00, 5, 2),
(16, 1, 'Clásico tres leches, cremoso y suave', '/productos/tresleches.jpg', 4, 'Tres Leches', 500.00, 5, 1),
(17, 2, 'Scones de queso, ideales para merendar', '/productos/sconesqueso.jpg', 2, 'Scones de Queso', 150.00, 3, 5),
(18, 1, 'Torta de limón esponjosa con glaseado', '/productos/lemon.jpg', 3, 'Torta de Limón', 350.00, 4, 4),
(19, 0, 'Torta selva negra con cerezas y crema', '/productos/selva.jpg', 5, 'Torta Selva Negra', 650.00, 5, 3),
(20, 3, 'Cupcakes decorados para fiestas', '/productos/cupcake.jpg', 1, 'Cupcakes Decorados', 200.00, 4, 6),
(21, 2, 'Torta con Chocolinas y dulce de leche que no necesita horno!', '/productos/chocotorta.jpg', 1, 'Chocotorta', 750.00, 0, 5);

INSERT INTO `comment` (id, user, product_id, approved, text) VALUES
(1, 'ana@example.com', 1, 1, 'Muy buen brownie.'),
(2, 'juan@example.com', 1, 1, 'Podría ser más barato, pero está bien.'),
(3, 'maria@example.com', 3, 1, 'Buena torta!'),
(4, 'jose@example.com', 4, 1, 'El envío tardó un poco.'),
(5, 'ramiro@example.com', 4, 1, 'Muy ricos'),
(6, 'laura@example.com', 6, 1, 'Tuvo un problema el envío, pero me prepararon otro.'),
(7, 'paula@example.com', 7, 1, 'Me sorprendió para bien.'),
(8, 'luis@example.com', 10, 1, 'Excelente relación precio/calidad.'),
(9, 'lucia@example.com', 10, 1, 'Lo recomendaría sin problema.'),
(10, 'vale@example.com', 10, 1, 'Buena compra, muy rico.'),
(11, 'andrea@example.com', 19, 1, 'Satisfecha.'),
(12, 'german@example.com', 20, 1, 'Nada que criticar, perfecto.');
