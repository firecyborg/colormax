-- Colormax andmebaasi tabelid

-- Kasutajad
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    birthday      DATE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Kategooriad (Autod, Kosmos, Loomad, Muinasjutud)
CREATE TABLE IF NOT EXISTS categories (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Värvimislehed (pildid)
CREATE TABLE IF NOT EXISTS coloring_pages (
    id          SERIAL PRIMARY KEY,
    category_id INTEGER      NOT NULL REFERENCES categories(id),
    title       VARCHAR(150) NOT NULL,
    file_path   VARCHAR(255) NOT NULL UNIQUE
);

-- Koostatud raamat (On vaja kontot)
CREATE TABLE IF NOT EXISTS books (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Raamatu lehed ja nende järjekord (1–20, sama lehte ei saa ühes raamatus korrata)
CREATE TABLE IF NOT EXISTS book_pages (
    book_id  INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    page_id  INTEGER NOT NULL REFERENCES coloring_pages(id),
    position INTEGER NOT NULL CHECK (position BETWEEN 1 AND 20),
    PRIMARY KEY (book_id, position),
    constraint book_pages_unique_page unique (book_id, page_id)
);


-- Tellimused (On vaja kontot)
CREATE TABLE IF NOT EXISTS orders (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id         INTEGER       NOT NULL REFERENCES books(id),
    customer_name   VARCHAR(100)  NOT NULL,
    customer_email  VARCHAR(255)  NOT NULL,
    address         VARCHAR(255)  NOT NULL,
    delivery_method VARCHAR(20)   NOT NULL
        CHECK (delivery_method IN ('kuller', 'asutaja', 'ulemaailmne')),
    payment_method  VARCHAR(20)   NOT NULL
        CHECK (payment_method IN ('kaart', 'pangalink', 'arve')),
    page_count      INTEGER       NOT NULL CHECK (page_count BETWEEN 1 AND 20),
    base_price      NUMERIC(10,2) NOT NULL,
    pages_price     NUMERIC(10,2) NOT NULL,
    delivery_price  NUMERIC(10,2) NOT NULL,
    total_price     NUMERIC(10,2) NOT NULL,
    status          VARCHAR(20)   NOT NULL DEFAULT 'uus'
        CHECK (status IN ('uus', 'makstud', 'saadetud', 'tühistatud')),
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);
