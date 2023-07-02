import sqlite3

class DatabaseService:
    def __init__(self):
        self.conn = sqlite3.connect('/Users/iri369/code/python/iri/instance/iribot.sqlite')

    def get_connection(self):
        return sqlite3.connect('/Users/iri369/code/python/iri/instance/iribot.sqlite')
    def insert_indicator(self, indicator):
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                print('saving indicator - executing')
                cursor.execute("""
                    INSERT INTO indicators (
                        timestamp, date, close, EMA20, EMA7, EMA1, RSI, status, support, resistance
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    indicator['timestamp'],
                    indicator['date'],
                    indicator['close'],
                    indicator['EMA20'],
                    indicator['EMA7'],
                    indicator['EMA1'],
                    indicator['RSI'],
                    indicator['status'],
                    indicator['support'],
                    indicator['resistance']
                ))
                print('saving indicator - executed')
                conn.commit()
        except sqlite3.Error as e:
            print(f"Error saving indicator: {e}")

    def insert_symbol(self, symbol):
        self.cursor.execute("INSERT INTO symbols (symbol) VALUES (?)", (symbol,))
        self.conn.commit()
        return self.cursor.lastrowid

    def insert_symbol_indicator_relationship(self, symbol_id, indicator_id):
        self.cursor.execute("INSERT INTO symbol_x_indicator (symbol_id, indicator_id) VALUES (?, ?)", (symbol_id, indicator_id))
        self.conn.commit()

    def close(self):
        self.conn.close()
