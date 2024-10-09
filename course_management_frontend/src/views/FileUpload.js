import React, { useState } from "react";
import axios from "axios";
import Table from "../table/Table";
import { slide as Menu } from "react-burger-menu";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const FileUpload = () => {
  // const [activeTab, setActiveTab] = useState("upload");
  const [initalfile, setInitalFile] = useState(null);
  const [otherfile, setOtherFile] = useState(null);
  const [message, setMessage] = useState("");
  const [tableData, setTableData] = useState([]);
  const [oldTableData, setOldTableData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleInitalFileChange = (e) => {
    setInitalFile(e.target.files[0]);
  };

  const handleInitalFileUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", initalfile);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      // Set table columns and data
      setColumns(response.data.columns);
      setTableData(response.data.data);
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Failed to upload file");
    }
  };

  const handleOtherFileChange = (e) => {
    setOtherFile(e.target.files[0]);
  };

  const handleOtherFileUpload = async (e,functiontype) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", initalfile);

    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/${functiontype}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      // Set table columns and data
      setColumns(response.data.columns);
      setTableData(response.data.data);
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Failed to upload file");
    }
  }

  return (
    <>
      {/* Sidebar */}
      <Menu
        className="w-1/4 bg-primary-dark text-white p-6"
        noOverlay
        disableOverlayClick
      >
        <Popup
          trigger={
            <button className="px-3 py-2 bg-secondary-dark hover:bg-gray-600 text-white font-bold rounded-md w-full text-center mb-4">
              Add new records
            </button>
          }
          modal
        >
          <span> Modal content </span>
        </Popup>

        <Popup
          trigger={
            <button className="px-3 py-2 bg-secondary-dark hover:bg-gray-600 text-white font-bold rounded-md w-full text-center mb-4">
              Calculate recommendations
            </button>
          }
          modal
        >
          <span> Modal content </span>
        </Popup>

        <Popup
          trigger={<button className="px-3 py-2 bg-secondary-dark hover:bg-gray-600 text-white font-bold rounded-md w-full text-center mb-4"> Open Modal </button>}
          modal
          nested
        >
          {(close) => (
            <div className="modal">
              <span> Modal content </span>
              <form
                onSubmit={(e) =>{
                  handleOtherFileUpload(e,"upload-new-users")
                }}
                className="flex flex-col md:flex-row gap-4 items-center justify-between"
              >
                <input
                  type="file"
                  className="block md:w-auto text-sm
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-dark 
              hover:file:bg-secondary-dark
            "
                  onChange={handleOtherFileChange}
                />

                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-dark text-white font-semibold rounded-md shadow-lg hover:bg-secondary-dark transition"
                  /* onClick={() => {
                    console.log("modal closed ");
                    close();
                  }} */
                > 
                  Upload & Process File
                </button>
              </form>
            </div>
          )}
        </Popup>
      </Menu>

      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">
            Excel File Viewer
          </h1>

          {/* File Upload Form */}
          <form
            onSubmit={(e) =>{
              handleInitalFileUpload(e)
            }}
            className="flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            <input
              type="file"
              className="block md:w-auto text-sm
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-dark 
              hover:file:bg-secondary-dark
            "
              onChange={handleInitalFileChange}
            />

            <button
              type="submit"
              className="px-6 py-2 bg-primary-dark text-white font-semibold rounded-md shadow-lg hover:bg-secondary-dark transition"
            >
              Upload & Process File
            </button>
          </form>

          {/* Message */}
          <p
            className={`mt-4 text-lg ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
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
    </>
  );
};
export default FileUpload;
