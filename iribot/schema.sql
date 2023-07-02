DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS indicators;
DROP TABLE IF EXISTS symbols;
DROP TABLE IF EXISTS symbol_x_indicator;

CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE post (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  FOREIGN KEY (author_id) REFERENCES user (id)
);

CREATE TABLE indicators (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,

                        date TEXT NOT NULL,
                        close REAL NOT NULL,
                        EMA20 REAL NOT NULL,
                        EMA7 REAL NOT NULL,
                        EMA1 REAL NOT NULL,
                        RSI REAL NOT NULL,
                        status TEXT NOT NULL,
                        support REAL NOT NULL,
                        resistance REAL NOT NULL
);

CREATE TABLE symbols (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT NOT NULL
);

CREATE TABLE symbol_x_indicator (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
     symbol_id INTEGER NOT NULL,
      indicator_id INTEGER NOT NULL,
       FOREIGN KEY (symbol_id) REFERENCES symbols (id),
       FOREIGN KEY (indicator_id) REFERENCES indicators (id)
);

