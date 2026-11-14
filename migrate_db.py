import sqlite3

con = sqlite3.connect('data/studio.db')
cur = con.cursor()
try:
    cur.execute("ALTER TABLE orders ADD COLUMN error_message TEXT;")
    print("Added column error_message")
except Exception as e:
    print("Column error_message status:", e)

# Recreate table with updated CHECK constraint allowing 'failed'
cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='orders';")
sql = cur.fetchone()[0]
print("Current schema:", sql)

if "'failed'" not in sql:
    print("Migrating schema to include 'failed' status...")
    cur.execute("PRAGMA foreign_keys = OFF;")
    cur.execute("""
    CREATE TABLE orders_new (
      id TEXT PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('submitted', 'in_production', 'ready', 'failed')),
      video_style TEXT NOT NULL DEFAULT 'style2_spotlight',
      brief TEXT NOT NULL,
      photo_filename TEXT NOT NULL,
      photo_original_name TEXT NOT NULL,
      photo_mime_type TEXT NOT NULL,
      photo_size INTEGER NOT NULL,
      video_filename TEXT,
      video_original_name TEXT,
      video_mime_type TEXT,
      video_size INTEGER,
      ad_metadata TEXT,
      error_message TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    """)
    cur.execute("""
    INSERT INTO orders_new (id, token, status, video_style, brief, photo_filename, photo_original_name, photo_mime_type, photo_size, video_filename, video_original_name, video_mime_type, video_size, ad_metadata, created_at, updated_at)
    SELECT id, token, status, video_style, brief, photo_filename, photo_original_name, photo_mime_type, photo_size, video_filename, video_original_name, video_mime_type, video_size, ad_metadata, created_at, updated_at FROM orders;
    """)
    cur.execute("DROP TABLE orders;")
    cur.execute("ALTER TABLE orders_new RENAME TO orders;")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_orders_token ON orders(token);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);")
    con.commit()
    print("Migration complete!")
else:
    print("Schema already supports 'failed'")
con.close()

