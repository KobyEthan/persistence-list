-- SQLite

-- DROP TABLE IF EXISTS items;

-- CREATE TABLE items (
--     id INTEGER PRIMARY KEY,
--     content varchar(100)
-- );

-- SELECT * FROM items;

SELECT *
FROM sqlite_master
WHERE type = 'table' AND name NOT LIKE 'sqlite_%';