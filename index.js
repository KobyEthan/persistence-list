import express from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";

const app = express();
const port = 3000;

// Establish database connection
const db = new sqlite3.Database(
  "./data/database.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) console.error(err.message);
  }
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Get items for the current list
async function getItems(currentListId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM items WHERE list_id = ?`;
    db.all(sql, [currentListId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
// Get a list by its ID
async function getListById(listId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM lists WHERE id = ?`;
    db.get(sql, [listId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}
// Get an array of all the lists in the db
async function getAllLists() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM lists`;
    db.all(sql, [], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
      return row;
    });
  });
}

app.get("/", async (req, res) => {
  try {
    let currentListId;
    if (req.query.currentListId) {
      currentListId = req.query.currentListId;
    } else {
      // Default to the first list if no current list ID is provided
      const allLists = await getAllLists();
      currentListId = allLists[0].id;
    }
    const items = await getItems(currentListId);
    const currentList = await getListById(currentListId);
    const lists = await getAllLists();

    res.render("index.ejs", {
      listItems: items,
      currentList: currentList,
      lists: lists,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Get the new.ejs file, to make a new list
app.get("/new", async (req, res) => {
  res.render("new.ejs");
});

// Get whichever list the user selects
app.get("/get-list", async (req, res) => {
  try {
    const listId = req.query.list;
    const currentList = await getListById(listId);
    const items = await getItems(listId);
    const lists = await getAllLists();

    res.render("index.ejs", {
      listItems: items,
      currentList: currentList,
      lists: lists,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Add a new list to the database
app.post("/new-list", (req, res) => {
  const newListName = req.body.newListName;
  const sql = `INSERT INTO lists (name) VALUES (?)`;
  db.run(sql, [newListName], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.redirect("/");
  });
});

app.post("/delete-list", (req, res) => {
  const listId = req.body.deletedListId;
  const sql = `DELETE FROM lists WHERE id = ?`;
  db.run(sql, [listId], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.redirect("/");
  });
});

// Todo Item related requests:
app.post("/add", (req, res) => {
  const currentListId = req.body.currentListId;
  const item = req.body.newItem;
  const listId = req.body.currentListId;
  const sql = `INSERT INTO items (content, list_id) VALUES (?, ?)`;
  db.run(sql, [item, listId], (err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  // Display the list that had an item added
  res.redirect(`/?currentListId=${currentListId}`);
});

app.post("/edit", (req, res) => {
  const currentListId = req.body.currentListId;
  const item = req.body.updatedItemContent;
  const id = req.body.updatedItemId;
  const sql = `UPDATE items SET content = ? WHERE id = ?`;
  db.run(sql, [item, id], (err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  // Display the list that had an item edited
  res.redirect(`/?currentListId=${currentListId}`);
});

app.post("/delete", (req, res) => {
  const currentListId = req.body.currentListId;
  const id = req.body.deletedItemId;
  const sql = `DELETE FROM items WHERE id = ?`;
  db.run(sql, [id], (err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  // Display the list that had an item deleted
  res.redirect(`/?currentListId=${currentListId}`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
