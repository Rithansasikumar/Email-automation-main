import React, { useState } from 'react';
import axios from 'axios';

function Frontend() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (    ) => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

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

    return (
        <div style={{ padding: '20px' }}>
            <h1>Email Automation</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload and Send Emails</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Frontend;
