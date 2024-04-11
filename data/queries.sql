-- SQLite
DROP TABLE IF EXISTS lists;
DROP TABLE IF EXISTS items;

CREATE TABLE lists(
    id INTEGER PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE items(
    id INTEGER PRIMARY KEY,
    content VARCHAR(100),
    list_id INTEGER REFERENCES lists(id)
);

INSERT INTO lists (name)
VALUES ('Today'), ('This Week');

INSERT INTO items (content, list_id)
VALUES ('Buy Milk', 1), ('Take dog on Walk', 2);

SELECT *
FROM items
JOIN lists
ON lists.id = items.list_id;