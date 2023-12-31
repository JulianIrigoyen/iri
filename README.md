
PoC - Easily setup python flask app with sqlite db and react frontend. This project was created to test OpenAI's APIs in conjuction with various market APIs (eg - binance.py).

To execute: 

    Create a .env file next to the .env.example with that format with your api keys
    Create and activate a python virtual environment - from the root directory (iri):
        Create:
            python3 -m venv venv (venv here is the name of the virtual env, it can be anything)
        Activate:
            For Windows: venv\Scripts\activate
            For macOS and Linux: source myenv/bin/activate

    Install dependencies:
        pip install -r requirements.txt
    Run the Flask App: 
        Init DB: flask --app iribot init-db
        Run App (from main directory): flask --app iribot run --debug --port 3693 (to work with the included Postman collection)

To interact with DB:

    Navigate to the directory where your Flask application is located.
    Activate the virtual environment  where your Flask application is installed.

    Start the SQLite command-line tool by running the following command:
    
        ```sqlite3```

    Connect to your Flask SQLite database file. If your Flask application uses a SQLite database, the database file is typically stored in         your project directory with a .db extension. You can connect to the database by running the following command:
        ```  .open path/to/your/database.db ```
    
    Replace path/to/your/database.db with the actual path to your SQLite database file. See the instance directory. 
    eg /Users/iri369/code/python/iri/instance/iribot.sqlite
    
    Once connected, you can run various SQLite commands to interact with the database. For example, you can query the tables, insert data,         update records, or perform other SQL operations. Here are some commonly used SQLite commands:

    To view the tables in the database:
    ```.tables```


https://flask.palletsprojects.com/en/2.3.x/tutorial/layout/

To run the FE (localhost:3000): 
 ```
    cd frontend/src
    npm install
    npm start
 ```
