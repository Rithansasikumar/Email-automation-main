const generateHtmlContent = (payslipData) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #333333;
            font-size: 24px;
        }
        .header p {
            margin: 0;
            color: #555555;
            font-size: 14px;
        }
        .payslip-details {
            margin-bottom: 20px;
        }
        .payslip-details table {
            width: 100%;
            border-collapse: collapse;
        }
        .payslip-details th,
        .payslip-details td {
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }
        .payslip-details th {
            background: #f7f7f7;
            font-weight: bold;
            color: #333333;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #555555;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Payslip for ${payslipData.Month}</h1>
            <p>Employee Name: ${payslipData.EmployeeName} | Employee ID: ${payslipData.EmployeeID}</p>
        </div>
        <div class="payslip-details">
            <table>
                <tr>
                    <th>Earnings</th>
                    <th>Amount</th>
                </tr>
                <tr>
                    <td>Basic Pay</td>
                    <td>${payslipData.BasicPay}</td>
                </tr>
                <tr>
                    <td>HRA</td>
                    <td>${payslipData.HRA}</td>
                </tr>
                <tr>
                    <td>Other Allowances</td>
                    <td>${payslipData.OtherAllowances}</td>
                </tr>
                <tr>
                    <th>Total Earnings</th>
                    <th>${payslipData.TotalEarnings}</th>
                </tr>
                <tr>
                    <th>Deductions</th>
                    <th>Amount</th>
                </tr>
                <tr>
                    <td>Tax</td>
                    <td>${payslipData.Tax}</td>
                </tr>
                <tr>
                    <td>PF</td>
                    <td>${payslipData.PF}</td>
                </tr>
                <tr>
                    <td>Other Deductions</td>
                    <td>${payslipData.OtherDeductions}</td>
                </tr>
                <tr>
                    <th>Total Deductions</th>
                    <th>${payslipData.TotalDeductions}</th>
                </tr>
                <tr>
                    <th>Net Pay</th>
                    <th>${payslipData.NetPay}</th>
                </tr>
            </table>
        </div>
        <div class="footer">
            <p>This is a computer-generated payslip and does not require a signature.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = generateHtmlContent;
