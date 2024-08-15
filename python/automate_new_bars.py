import json
import csv

# Replace 'file_path.json' with the path to your JSON file
input_file_path = 'file_path.json'
output_file_path = 'bars_info4.csv'

# Read the JSON data from the file
with open(input_file_path, 'r') as file:
    data = json.load(file)

# Extract bar information
bars_info = []
for feature in data.get('features', []):
    bar_name = feature.get('text')
    coordinates = feature.get('geometry', {}).get('coordinates', [])
    
    if len(coordinates) == 2:
        longitude, latitude = coordinates
        bars_info.append({
            'barName': bar_name,
            'longitude': longitude,
            'latitude': latitude
        })

# Write the extracted information to a CSV file
with open(output_file_path, 'w', newline='') as csvfile:
    fieldnames = ['barName', 'longitude', 'latitude']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    
    writer.writeheader()
    for bar in bars_info:
        writer.writerow(bar)

print(f"Data has been written to {output_file_path}")
