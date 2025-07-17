DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nickname TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL,
  is_official INTEGER DEFAULT 0, -- 0 for false, 1 for true
  created_at TEXT
);

-- New table for rate limiting
DROP TABLE IF EXISTS rate_limits;
CREATE TABLE rate_limits (
  ip_address TEXT PRIMARY KEY,
  last_post_at TEXT NOT NULL
);
