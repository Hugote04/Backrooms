INSERT INTO reviews (id, user_id, user_name, rating, text, created_at, updated_at) VALUES
('rev-001', 'user-001', 'SombraPlayer', 5, 'Una experiencia de terror única. Los pasillos amarillos infinitos crean una atmósfera opresiva que pocos juegos logran. El diseño de sonido es impecable.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('rev-002', 'user-002', 'BackroomsExplorer', 4, 'Muy buen juego indie de terror. La IA del enemigo funciona bien y los jumpscares están bien colocados. Para ser un proyecto estudiantil está increíble.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('rev-003', 'user-003', 'NightmareGamer', 5, 'Me encantó la ambientación. El noclip al vacío está bien recreado. Recomendado para fans del lore de las Backrooms.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO comments (id, review_id, user_id, user_name, content, created_at) VALUES
('com-001', 'rev-001', 'user-004', 'VoidWalker', '¡Totalmente de acuerdo! Los sonidos de las tuberías me pusieron los pelos de punta.', CURRENT_TIMESTAMP),
('com-002', 'rev-002', 'user-005', 'LiminalFan', '¿Has llegado al nivel 2? Ahí es donde se pone realmente interesante.', CURRENT_TIMESTAMP);
