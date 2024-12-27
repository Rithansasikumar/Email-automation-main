const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rithankumar007@gmail.com', 
        pass: 'ewjw okjv uany uzqu', 
    },
});

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const promises = data.map((row) => {
        return transporter.sendMail({
            from: 'rithankumar007@gmail.com', 
            to: row.Email, 
            subject: `Hello ${row.Name}`, 
            text: `Hi ${row.Name}, this is an automated email.`,
            ContentVisibilityAutoStateChangeEvent
        });
    });

    Promise.all(promises)
        .then(() => res.status(200).send('Emails sent successfully!'))
        .catch((error) => res.status(500).send('Failed to send emails. ' + error.message));
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

