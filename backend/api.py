import sqlite3
import pandas as pd

# Step 1: Connect to SQLite
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# Step 2: Load Excel file into a pandas DataFrame
df = pd.read_excel('sample_roa_data.xlsx')

# Step 3: Get column names from the DataFrame
columns = df.columns.tolist()
#print(columns)
# Step 4: Dynamically create the SQLite table based on the Excel columns
# Form a SQL CREATE TABLE statement dynamically
columns_list = []
for column in columns:
    column = column.replace(" ", "_").upper()
    if column.upper().find('DATE')>-1:
        columns_list.append(f"'{column}' DATE")
        
    else:
        columns_list.append(f"'{column}' TEXT")
        
df.columns = [column.upper().replace(" ", "_") for column in df.columns.tolist()] 
            
create_table_query = f"CREATE TABLE IF NOT EXISTS my_table ({', '.join(columns_list)})"
print("Query:",create_table_query)
cursor.execute(create_table_query)
conn.commit()


# Step 5: Insert data from the DataFrame into the SQLite table
df.to_sql('my_table', conn, if_exists='append', index=False)

# Step 6: Query and print data (Optional, to verify)
cursor.execute('SELECT * FROM my_table')
rows = cursor.fetchall()

for row in rows:
    print(row)

# Step 7: Close the connection
conn.close()
