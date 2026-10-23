import os
from contextlib import contextmanager
from pathlib import Path

import psycopg
from dotenv import load_dotenv
from psycopg.rows import dict_row

load_dotenv(Path(__file__).with_name(".env"))


def get_database_url() -> str:
    """Tagasta DATABASE_URL väärtuse."""
    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        raise RuntimeError(
            "DATABASE_URL puudub."
        )

    return database_url


@contextmanager
def get_connection():
    """Ava ühendus ja sulge see with-ploki lõpus."""
    with psycopg.connect(
        get_database_url(),
        row_factory=dict_row,
    ) as connection:
        yield connection
