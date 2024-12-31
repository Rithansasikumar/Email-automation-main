import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from "@mui/material";
import { CloudUpload, Search, Send } from "@mui/icons-material";

const Frontend = () => {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState({});
  const [message, setMessage] = useState("");

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (e.target.name === "file") {
      setFile(selectedFile);
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const binaryStr = event.target.result;
          const workbook = XLSX.read(binaryStr, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const initialSelection = jsonData.reduce((acc, _, index) => {
            acc[index] = true;
            return acc;
          }, {});
          setData(jsonData);
          setSelectedRows(initialSelection);
        };
        reader.readAsBinaryString(selectedFile);
      }
    } else if (e.target.name === "attachment") {
      setAttachment(selectedFile);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCheckboxToggle = (index) => {
    setSelectedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSend = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const selectedData = data.filter((_, index) => selectedRows[index]);
    if (selectedData.length === 0) {
      setMessage("No rows selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", JSON.stringify(selectedData));
    console.log(selectedData);
    return selectedData;

    // selectedData.forEach((row, index) => {
    //   const attachment = row.attachment;
    //   if (attachment) {
    //     formData.append(`attachment-${index}`, attachment);
    //   }
    // });

    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data);
    } catch (error) {
      setMessage(`Error: ${error.response?.data || error.message}`);
    }
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  const handleRowAttachmentUpload = (index, e) => {
    const newData = [...data];
    newData[index].attachment = e.target.files[0] || null; 
    setData(newData);
  };
  

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-6xl bg-gray-800 shadow-lg rounded-lg p-8">
        <h2 className="text-4xl font-bold mb-6 text-center text-blue-400">
          Mail Automation
        </h2>
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
          <Button
            variant="contained"
            component="label"
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
            startIcon={<CloudUpload />}
          >
            Upload Excel File
            <input
              type="file"
              accept=".xlsx, .xls"
              hidden
              name="file"
              onChange={handleFileUpload}
            />
          </Button>

          <Button
            variant="contained"
            component="label"
            hidden
            className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
            startIcon={<CloudUpload />}
          >
            Upload Optional Attachment
            <input
              type="file"
              accept="*/*"
              hidden
              name="attachment"
              onChange={handleFileUpload}
            />
          </Button>
        </div>

        {data.length > 0 && (
          <TextField
            fullWidth
            placeholder="Search Contacts"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <Search className="text-gray-400 mr-2" />,
            }}
            className="mb-6 bg-gray-700 text-white rounded-md"
          />
        )}

        {filteredData.length > 0 ? (
          <TableContainer component={Paper} className="bg-gray-800 shadow-md rounded-lg">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold bg-gray-700 text-blue-300">
                    Select
                  </TableCell>
                  {Object.keys(filteredData[0]).map((key) => (
                    <TableCell
                      key={key}
                      className="font-bold bg-gray-700 text-blue-300"
                    >
                      {key}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-gray-700">
                    <TableCell>
                      <Checkbox
                        checked={selectedRows[index] || false}
                        onChange={() => handleCheckboxToggle(index)}
                        color="primary"
                      />
                    </TableCell>
                    {Object.entries(row).map(([key, val], i) => (
                      <TableCell key={i} className="text-white">
                        {key === "attachment" && val instanceof File ? val.name : val} {/* Display file name */}
                      </TableCell>
                    ))}
                    {/* <TableCell>
                      <input
                        type="file"
                        onChange={(e) => handleRowAttachmentUpload(index, e)}
                        className="border border-gray-300 rounded-md p-2"
                      />
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p className="text-center text-gray-400 mt-6">
            {data.length === 0
              ? "Upload a file to see data"
              : "No results found"}
          </p>
        )}

        {data.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSend}
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center space-x-2"
              startIcon={<Send />}
            >
              Send
            </Button>
          </div>
        )}

        {message && (
          <p className="text-center text-red-500 mt-4 text-lg font-semibold">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Frontend;
