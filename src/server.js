// require('dotenv').config();
// const express = require('express');
// const multer = require('multer');
// const xlsx = require('xlsx');
// const nodemailer = require('nodemailer');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// // const handlebars = require('handlebars');
// // const fs = require('fs');
// // const path = require('path');
// // const emailData = require('./email_data.js');
// // const generateHtmlContent = require('./email.js');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const upload = multer({ dest: 'uploads/' });

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });


// app.post('/upload', upload.fields([{ name: 'file' }, { name: 'attachment' }]), (req, res) => {
//     const file = req.files?.file?.[0]; // Excel file
//     const attachment = req.files?.attachment?.[0]; // Optional attachment

//     if (!file) {
//         return res.status(400).send('No Excel file uploaded.');
//     }

//     const workbook = xlsx.readFile(file.path);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const data = xlsx.utils.sheet_to_json(sheet);


//     // const templatePath = path.join(__dirname, 'email.html');
//     // const templateSource = fs.readFileSync(templatePath, 'utf8');
//     // const template = handlebars.compile(templateSource);

//     const promises = data.map((row) => {
//         // const emailHtml = template({ name: row.Name, message: row.Text });
//         // const htmlContent = generateHtmlContent(emailData);
//         return transporter.sendMail({
//             from: 'rithankumar007@gmail.com', 
//             to: row.Email, 
//             subject: `Hello ${row.Name}`, 
//             text: `Hi ${row.Name}, ${row.Text}`,
//         });
//     });
//     Promise.all(promises)
//         .then(() => res.status(200).send('Emails sent successfully!'))
//         .catch((error) => res.status(500).send('Failed to send emails. ' + error.message));
// });


require('dotenv').config();
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
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

app.post('/upload', upload.fields([{ name: 'file' }, { name: 'attachment-0' }, { name: 'attachment-1' }]), (req, res) => {
    const file = req.files?.file?.[0]; 
    if (!file) {
        return res.status(400).send('No Excel file uploaded.');
    }

    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const promises = data.map((row, index) => {
        const attachments = [];
        const rowAttachment = req.files[`attachment-${index}`]?.[0];
        if (rowAttachment) {
            attachments.push({
                filename: rowAttachment.originalname,
                path: rowAttachment.path,
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: row.Email,
            subject: `Hello ${row.Name}`,
            text: `Hi ${row.Name}, ${row.Text}`,
            attachments, 
        };

        return transporter.sendMail(mailOptions);
    });

    const fs = require('fs');

    Promise.all(promises)
      .then(() => {
        // Clean up uploaded files
        Object.values(req.files).flat().forEach((file) => {
          fs.unlinkSync(file.path);
        });
        res.status(200).send('Emails sent successfully!');
      })
      .catch((error) => {
        res.status(500).send('Failed to send emails. ' + error.message);
      });
    
});



const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
