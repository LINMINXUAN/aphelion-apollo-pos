-- Flyway V4: 插入預設使用者
-- 預設密碼皆為: password (BCrypt Encoded: $2a$10$wT.f/t.k/j.k.j.k.j.k.u.k.j.k.j.k.j.k.j.k.j.k.j.k.j) ... wait, let me use a valid one.
-- pass: admin123 -> $2a$10$r.7/k/1.o.5.5.5.5.5.5.u.5.5.5.5.5.5.5.5.5.5.5.5.5
-- 為了確保正確，使用通用的 'password' hash: $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG (password)

INSERT INTO
    users (
        username,
        password,
        role,
        full_name,
        active
    )
VALUES (
        'admin',
        '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
        'ROLE_ADMIN',
        'System Administrator',
        true
    ),
    (
        'staff',
        '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
        'ROLE_STAFF',
        'Morning Staff',
        true
    );