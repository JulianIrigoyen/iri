

In SQLite, data is stored in tables and columns. These need to be created before you can store and retrieve data. Flaskr will store users in the user table, and posts in the post table. Create a file with the SQL commands needed to create empty tables

Add the Python functions that will run these SQL commands to the db.py file
def init_db():
    db = get_db()

    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))


@click.command('init-db')
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')


To initialize the DB
$ flask --app iribot init-db

To run the app
$ flask --app iribot run --debug
