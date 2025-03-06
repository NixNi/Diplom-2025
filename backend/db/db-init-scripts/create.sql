DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

CREATE TABLE "users" (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    info TEXT,
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "groups" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    owner INTEGER REFERENCES "users" (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "posts" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER  REFERENCES "users" (id),
    group_id INTEGER REFERENCES "groups" (id),
    post_text TEXT,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "answers" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "users" (id),
    answer_text TEXT,
    post INTEGER REFERENCES "posts" (id) ON DELETE CASCADE,
    parent_answer INTEGER REFERENCES "answers" (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "ugr" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "users" (id),
    group_id INTEGER REFERENCES "groups" (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, group_id)
);


CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER updated_by_trigger
BEFORE UPDATE ON "users"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER updated_by_trigger
BEFORE UPDATE ON "groups"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER updated_by_trigger
BEFORE UPDATE ON "posts"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER updated_by_trigger
BEFORE UPDATE ON "answers"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER updated_by_trigger
BEFORE UPDATE ON "ugr"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();