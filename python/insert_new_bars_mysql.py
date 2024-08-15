import csv
import pymysql

# Database connection details
db_config = {
    'host': 'localhost',
    'user': 'root',
    'database': 'pionta'
}

# CSV file path
csv_file_path = 'bars_info.csv'

# Connect to the database
connection = pymysql.connect(
    host=db_config['host'],
    user=db_config['user'],
    database=db_config['database']
)

try:
    with connection.cursor() as cursor:
        # Read the CSV file
        with open(csv_file_path, newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                name = row['barName']
                latitude = float(row['latitude'])
                longitude = float(row['longitude'])
                description = "blank"
                
                # Execute the SQL command
                sql = 'INSERT IGNORE INTO bars (name, description, latitude, longitude) VALUES (%s, %s, %s, %s)'
                cursor.execute(sql, (name, description, latitude, longitude))
        
        # Commit the transaction
        connection.commit()
finally:
    # Close the connection
    connection.close()

print("Data has been inserted into the database.")