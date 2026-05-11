INSERT INTO scores (id, user_id, user_name, nivel, tiempo_segundos, puzles_resueltos, created_at) VALUES
('sc-001', 'user-001', 'SombraPlayer',      'Nivel 1 — Pasillos',  187, 3, CURRENT_TIMESTAMP),
('sc-002', 'user-001', 'SombraPlayer',      'Nivel 2 — Oficinas',  312, 5, CURRENT_TIMESTAMP),
('sc-003', 'user-002', 'BackroomsExplorer', 'Nivel 1 — Pasillos',  243, 2, CURRENT_TIMESTAMP),
('sc-004', 'user-002', 'BackroomsExplorer', 'Nivel 2 — Oficinas',  289, 4, CURRENT_TIMESTAMP),
('sc-005', 'user-003', 'NightmareGamer',    'Nivel 1 — Pasillos',  158, 3, CURRENT_TIMESTAMP),
('sc-006', 'user-003', 'NightmareGamer',    'Nivel 2 — Oficinas',  401, 6, CURRENT_TIMESTAMP),
('sc-007', 'user-004', 'VoidWalker',        'Nivel 1 — Pasillos',  220, 1, CURRENT_TIMESTAMP),
('sc-008', 'user-005', 'LiminalFan',        'Nivel 1 — Pasillos',  195, 2, CURRENT_TIMESTAMP),
('sc-009', 'user-005', 'LiminalFan',        'Nivel 2 — Oficinas',  267, 4, CURRENT_TIMESTAMP);

INSERT INTO reviews (id, user_id, user_name, rating, text, created_at, updated_at) VALUES
('rev-001', 'user-001', 'SombraPlayer', 5, 'Una experiencia de terror única. Los pasillos amarillos infinitos crean una atmósfera opresiva que pocos juegos logran. El diseño de sonido es impecable.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('rev-002', 'user-002', 'BackroomsExplorer', 4, 'Muy buen juego indie de terror. La IA del enemigo funciona bien y los jumpscares están bien colocados. Para ser un proyecto estudiantil está increíble.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('rev-003', 'user-003', 'NightmareGamer', 5, 'Me encantó la ambientación. El noclip al vacío está bien recreado. Recomendado para fans del lore de las Backrooms.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO comments (id, review_id, user_id, user_name, content, created_at) VALUES
('com-001', 'rev-001', 'user-004', 'VoidWalker', '¡Totalmente de acuerdo! Los sonidos de las tuberías me pusieron los pelos de punta.', CURRENT_TIMESTAMP),
('com-002', 'rev-002', 'user-005', 'LiminalFan', '¿Has llegado al nivel 2? Ahí es donde se pone realmente interesante.', CURRENT_TIMESTAMP);
