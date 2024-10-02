from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import shutil
import os

app = FastAPI()

# Directory where files will be saved
UPLOAD_DIRECTORY = "./uploads/"

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_location = f"{UPLOAD_DIRECTORY}{file.filename}"
    
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return JSONResponse(content={"message": "File uploaded successfully", "filename": file.filename})
