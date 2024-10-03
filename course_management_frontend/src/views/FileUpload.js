import React, { useState } from 'react';
import axios from 'axios';
import Table from '../table/Table'


const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response)
      // Set table columns and data
      setColumns(response.data.columns);
      setTableData(response.data.data);
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Failed to upload file');
    }
  };

  return (
    <div>
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload File</button>
      </form>
      <p>{message}</p>
      {/* Display the table if data is available */}
      {tableData.length > 0 && (
        <Table columns={columns} data={tableData} completeData={tableData} query="excel_data" />
      )}
    </div>
  );
};

export default FileUpload;
