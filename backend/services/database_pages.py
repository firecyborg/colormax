from database import get_connection

def get_categories():
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT ID, name
                FROM categories
                ORDER BY name"""
            )
            return cursor.fetchall()

def get_pages(category_id=None):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            if category_id is None:
                cursor.execute(
                    """
                    SELECT p.id, p.title, p.file_path, p.category_id, c.name AS category
                    FROM coloring_pages p
                    JOIN categories c ON c.id = p.category_id
                    ORDER BY c.name, p.file_path
                    """
                )
            else:
                cursor.execute(
                    """
                    SELECT p.id, p.title, p.file_path, p.category_id, c.name AS category
                    FROM coloring_pages p
                    JOIN categories c ON c.id = p.category_id
                    WHERE p.category_id = %s
                    ORDER BY p.file_path
                    """,
                    (category_id,),
                )
            return cursor.fetchall()