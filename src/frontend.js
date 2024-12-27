// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import axios from 'axios';
// import {
//     TextField,
//     Button,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Checkbox,
// } from '@mui/material';

// const Frontend = () => {
//     const [data, setData] = useState([]);
//     const [file, setFile] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedRows, setSelectedRows] = useState({});
//     const [message, setMessage] = useState('');

//     const handleFileUpload = (e) => {
//         const selectedFile = e.target.files[0];
//         setFile(selectedFile);
//         if (selectedFile) {
//             const reader = new FileReader();
//             reader.onload = (event) => {
//                 const binaryStr = event.target.result;
//                 const workbook = XLSX.read(binaryStr, { type: 'binary' });
//                 const sheetName = workbook.SheetNames[0];
//                 const worksheet = workbook.Sheets[sheetName];
//                 const jsonData = XLSX.utils.sheet_to_json(worksheet);

//                 const initialSelection = jsonData.reduce((acc, _, index) => {
//                     acc[index] = true;
//                     return acc;
//                 }, {});
//                 setData(jsonData);
//                 setSelectedRows(initialSelection);
//             };
//             reader.readAsBinaryString(selectedFile);
//         }
//     };

    // const handleSearch = (e) => {
    //     setSearchTerm(e.target.value);
    // };

    // const handleCheckboxToggle = (index) => {
    //     setSelectedRows((prev) => ({
    //         ...prev,
    //         [index]: !prev[index],
    //     }));
    // };

//     const handleSend = async () => {
//         if (!file) {
//             setMessage('Please select a file first.');
//             return;
//         }

//         const selectedData = data.filter((_, index) => selectedRows[index]);
//         if (selectedData.length === 0) {
//             setMessage('No rows selected.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('data', JSON.stringify(selectedData));

//         try {
//             const response = await axios.post('http://localhost:5000/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             setMessage(response.data);
//         } catch (error) {
//             setMessage(`Error: ${error.response?.data || error.message}`);
//         }
//     };

    // const filteredData = data.filter((row) =>
    //     Object.values(row).some(
    //         (val) =>
    //             val &&
    //             val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    //     )
    // );

//     return (
//         <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//             <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
//                 <h2 className="text-3xl font-serif font-bold mb-6 text-center text-indigo-600">
//                     Mail Automation
//                 </h2>


//                 <div className="mb-6 flex justify-center">
//                     <Button
//                         variant="contained"
//                         component="label"
//                         className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md"
//                     >
//                         Upload Excel File
//                         <input
//                             type="file"
//                             accept=".xlsx, .xls"
//                             hidden
//                             onChange={handleFileUpload}
//                         />
//                     </Button>
//                 </div>


// {data.length > 0 && (
//     <div className="mb-6">
//         <TextField
//             fullWidth
//             label="Search Contacts"
//             variant="outlined"
//             value={searchTerm}
//             onChange={handleSearch}
//             className="border border-gray-300 shadow-sm rounded-md"
//         />
//     </div>
// )}


// {filteredData.length > 0 ? (
//     <TableContainer component={Paper} className="shadow-md rounded-lg">
//         <Table>
//             <TableHead>
//                 <TableRow>
//                     <TableCell className="font-bold bg-indigo-50 text-indigo-700">
//                         Select
//                     </TableCell>
//                     {Object.keys(filteredData[0]).map((key) => (
//                         <TableCell
//                             key={key}
//                             className="font-bold bg-indigo-50 text-indigo-700"
//                         >
//                             {key}
//                         </TableCell>
//                     ))}
//                 </TableRow>
//             </TableHead>
//             <TableBody>
//                 {filteredData.map((row, index) => (
//                     <TableRow
//                         key={index}
//                         className="hover:bg-indigo-100 transition-colors"
//                     >
//                         <TableCell>
//                             <Checkbox
//                                 checked={selectedRows[index] || false}
//                                 onChange={() => handleCheckboxToggle(index)}
//                                 color="primary"
//                             />
//                         </TableCell>
//                         {Object.values(row).map((val, i) => (
//                             <TableCell key={i}>{val}</TableCell>
//                         ))}
//                     </TableRow>
//                 ))}
//             </TableBody>
//         </Table>
//     </TableContainer>
// ) : (
//     <p className="text-gray-500 text-center mt-6">
//         {data.length === 0
//             ? 'Upload a file to see data'
//             : 'No results found'}
//     </p>
// )}


//                 {data.length > 0 && (
//                     <div className="mt-6 flex justify-center">
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             onClick={handleSend}
//                             className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-md"
//                         >
//                             Send
//                         </Button>
//                     </div>
//                 )}


//                 {message && (
//                     <p className="text-center text-red-500 mt-4 text-lg font-semibold">
//                         {message}
//                     </p>
//                 )}
//             </div>
//         </div>

//     );
// };

// export default Frontend;
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
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
} from '@mui/material';

const Frontend = () => {
    const [data, setData] = useState([]);
    const [file, setFile] = useState(null);
    const [attachment, setAttachment] = useState(null); // State for the attachment
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState({});
    const [message, setMessage] = useState('');

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];

        // Check the input field's name to determine if it's the main file or attachment
        if (e.target.name === 'file') {
            setFile(selectedFile); // Set Excel file
            if (selectedFile) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const binaryStr = event.target.result;
                    const workbook = XLSX.read(binaryStr, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    // Initialize row selection state
                    const initialSelection = jsonData.reduce((acc, _, index) => {
                        acc[index] = true;
                        return acc;
                    }, {});
                    setData(jsonData); // Set the parsed data
                    setSelectedRows(initialSelection);
                };
                reader.readAsBinaryString(selectedFile);
            }
        } else if (e.target.name === 'attachment') {
            setAttachment(selectedFile); // Set optional attachment
        }
    };

    const handleAttachmentUpload = (e) => {
        const selectedAttachment = e.target.files[0];
        setAttachment(selectedAttachment);
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
            setMessage('Please select a file first.');
            return;
        }

        const selectedData = data.filter((_, index) => selectedRows[index]);
        if (selectedData.length === 0) {
            setMessage('No rows selected.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('data', JSON.stringify(selectedData));
        if (attachment) {
            formData.append('attachment', attachment); // Add the attachment
        }

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data);
        } catch (error) {
            setMessage(`Error: ${error.response?.data || error.message}`);
        }
    };

    const filteredData = data.filter((row) =>
        Object.values(row).some(
            (val) =>
                val &&
                val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-3xl font-serif font-bold mb-6 text-center text-indigo-600">
                    Mail Automation
                </h2>
                <div className="mb-6 flex flex-col space-y-4">
                    {/* Upload Excel File */}
                    <Button
                        variant="contained"
                        component="label"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md"
                    >
                        Upload Excel File
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            hidden
                            name="file" // This is critical
                            onChange={handleFileUpload}
                        />
                    </Button>

                    {/* Upload Optional Attachment */}
                    <Button
                        variant="contained"
                        component="label"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md"
                    >
                        Upload Optional Attachment
                        <input
                            type="file"
                            accept="*/*"
                            hidden
                            name="attachment" // This is critical
                            onChange={handleAttachmentUpload}
                        />
                    </Button>
                </div>
                {data.length > 0 && (
                    <div className="mb-6">
                        <TextField
                            fullWidth
                            label="Search Contacts"
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="border border-gray-300 shadow-sm rounded-md"
                        />
                    </div>
                )}


                {filteredData.length > 0 ? (
                    <TableContainer component={Paper} className="shadow-md rounded-lg">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="font-bold bg-indigo-50 text-indigo-700">
                                        Select
                                    </TableCell>
                                    {Object.keys(filteredData[0]).map((key) => (
                                        <TableCell
                                            key={key}
                                            className="font-bold bg-indigo-50 text-indigo-700"
                                        >
                                            {key}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        className="hover:bg-indigo-100 transition-colors"
                                    >
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedRows[index] || false}
                                                onChange={() => handleCheckboxToggle(index)}
                                                color="primary"
                                            />
                                        </TableCell>
                                        {Object.values(row).map((val, i) => (
                                            <TableCell key={i}>{val}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <p className="text-gray-500 text-center mt-6">
                        {data.length === 0
                            ? 'Upload a file to see data'
                            : 'No results found'}
                    </p>
                )}


                {data.length > 0 && (
                    <div className="mt-6 flex justify-center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSend}
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-md"
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
