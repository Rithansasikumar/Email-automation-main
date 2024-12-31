require('dotenv').config();
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');


const app = express();
app.use(cors());
app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


app.post('/upload', upload.fields([{ name: 'file' }, { name: 'attachment' }]), async (req, res) => {
    const file = req.files?.file?.[0];
    const attachment = req.files?.attachment?.[0];

    if (!file) {
        return res.status(400).send('No Excel file uploaded.');
    }


    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const emailHtmlFilePath = path.join(__dirname, 'email.html');
    const emailHtmlContent = fs.readFileSync(emailHtmlFilePath, 'utf8');


    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(emailHtmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    const promises = data.map((row) => {
        return transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: row.Email,
            subject: `Hello ${row.Name}`,
            text: `Hi ${row.Name}, ${row.Text}`,
            attachments: [
                {
                    filename: `Payslip-.pdf`,
                    content: pdfBuffer,
                    contentType:'application/pdf',
                    encoding: 'base64',
                },
            ],

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
