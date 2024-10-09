from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import uvicorn
import pandas as pd
import sqlite3

app = FastAPI()
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# Directory where files will be saved
UPLOAD_DIRECTORY = "./uploads/"

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_location = f"{UPLOAD_DIRECTORY}{file.filename}"
    
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Read the Excel file into a pandas DataFrame
    df = pd.read_excel(file_location)
    df = df.fillna('')
    
    columns = df.columns.tolist()
    #print(columns)
    # Step 4: Dynamically create the SQLite table based on the Excel columns
    # Form a SQL CREATE TABLE statement dynamically
    sql_columns_list = []
    for column in columns:
        column = column.replace(" ", "_").upper()
        if column.upper().find('DATE')>-1:
            sql_columns_list.append(f"'{column}' DATE")
            
        else:
            sql_columns_list.append(f"'{column}' TEXT")
         
    columns_list = [column.upper().replace(" ","_")for column in df.columns.values.tolist()]
    df.columns = columns_list
    
    create_table_query = f"CREATE TABLE IF NOT EXISTS my_table ({', '.join(sql_columns_list)})"
    print("Query:",create_table_query)
    cursor.execute(create_table_query)
    conn.commit()
    
    df.to_sql('my_table', conn, if_exists='replace', index=False)

    api_columns = []
    column_index=0
    for column_name in df.columns.values.tolist():
        api_columns.append(
            {
                "Header": column_name,
                "accessor": f"{column_index}"
            }
        )
        column_index += 1
    
    # Convert the DataFrame to JSON
    df_split = df.to_dict(orient="split")
    data_json = df_split['data']
    #data_json.insert(0,columns_list)
    print(data_json)
    return JSONResponse(content={"message": "File uploaded successfully", 
                                 "filename": file.filename,
                                 "data" : data_json,
                                 "columns" : api_columns,
                                 })

@app.post("/upload-new-users")
async def upload_new_users_file(file: UploadFile = File(...)):
    file_location = f"{UPLOAD_DIRECTORY}{file.filename}"
    
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Read the Excel file into a pandas DataFrame
    new_df = pd.read_excel(file_location)
    new_df = new_df.fillna('')


    if df != []:
        df = pd.concat([df, new_df], axis=1)
        
        api_columns = []
        column_index=0
    
        for column_name in df.columns.values.tolist():
            api_columns.append(
                {
                    "Header": column_name,
                    "accessor": f"{column_index}"
                }
            )
            column_index += 1
        # Convert the DataFrame to JSON
        df_split = df.to_dict(orient="split")
        data_json = df_split['data']
        #data_json.insert(0,columns_list)
        print(data_json)
        return JSONResponse(content={"message": "File uploaded successfully", 
                                        "filename": file.filename,
                                        "data" : data_json,
                                        "columns" : api_columns,
                                        })
    
@app.get("/dbdata")
async def get_db_data():
    cursor.execute('SELECT c.name FROM pragma_table_info("my_table") c;') 
    rows = cursor.fetchall()
    columns = [n[0] for n in rows]
    
    api_columns = []
    column_index=0

    for column_name in columns:
        api_columns.append(
            {
                "Header": column_name,
                "accessor": f"{column_index}"
            }
        )
        column_index += 1
        
    cursor.execute('SELECT * FROM my_table')
    rows = cursor.fetchall()
    df = pd.DataFrame(rows)
    # Convert the DataFrame to JSON
    df_split = df.to_dict(orient="split")
    data_json = df_split['data']
    #data_json.insert(0,columns_list)
    print(data_json)
    return JSONResponse(content={"message": "File uploaded successfully", 
                                 "filename": "Database",
                                 "data" : data_json,
                                 "columns" : api_columns,
                                 })

if __name__ == '__main__':
    uvicorn.run("app:app", port=5000, reload=True, access_log=False)