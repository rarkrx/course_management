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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">
          Excel File Viewer
        </h1>

        {/* File Upload Form */}
        <form
          onSubmit={handleFileUpload}
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          <input
            type="file"
            className="block w-full md:w-auto text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-dark file:text-white
              hover:file:bg-secondary-dark
            "
            onChange={handleFileChange}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary-dark text-white font-semibold rounded-md shadow-lg hover:bg-secondary-dark transition"
          >
            Upload & Process File
          </button>
        </form>

        {/* Message */}
        <p className={`mt-4 text-lg ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>

        {/* Table Display */}
        {tableData.length > 0 && (
          <div className="mt-8">
            <Table
              columns={columns}
              data={tableData}
              completeData={tableData}
              query="excel_data"
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default FileUpload;
