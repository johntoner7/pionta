import pandas as pd
import mysql.connector
from mysql.connector import pooling

# Database configuration
db_config = {
    'user': 'root',
    'host': 'localhost',
    'database': 'pionta',
}

# Create a connection pool
pool = mysql.connector.pooling.MySQLConnectionPool(**db_config)

def get_pint_id(connection, pint_name):
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT id FROM pints WHERE name = %s', (pint_name,))
    row = cursor.fetchone()
    cursor.close()
    return row['id'] if row else None

def create_pint(connection, pint_name):
    cursor = connection.cursor()
    cursor.execute('INSERT INTO pints (name) VALUES (%s)', (pint_name,))
    connection.commit()
    pint_id = cursor.lastrowid
    cursor.close()
    return pint_id

def add_price(connection, bar_id, pint_id, price):
    cursor = connection.cursor()
    cursor.execute('INSERT INTO prices (barId, pintId, price) VALUES (%s, %s, %s)', (bar_id, pint_id, price))
    connection.commit()
    cursor.close()

def add_pint(pint_name, bar_id, price):
    connection = pool.get_connection()
    try:
        connection.start_transaction()
        pint_id = get_pint_id(connection, pint_name)
        if not pint_id:
            pint_id = create_pint(connection, pint_name)
        add_price(connection, bar_id, pint_id, price)
        connection.commit()
        print(f'Pint and price added successfully: pintId={pint_id}, barId={bar_id}, price={price}')
    except Exception as e:
        connection.rollback()
        print(f'Error: {e}')
    finally:
        connection.close()

def main():
    # Read CSV file
    df = pd.read_csv('pints.csv')

    # Iterate over CSV rows and add pints
    for index, row in df.iterrows():
        add_pint(row['pintName'], row['barId'], row['price'])

if __name__ == "__main__":
    main()