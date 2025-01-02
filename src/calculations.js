const xlsx = require("xlsx");

/**
 * Load employee data from Excel file.
 */
const loadEmployeeData = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  return sheetData;
};

/**
 * Perform calculations for an employee.
 */
const calculatePayslip = (employee) => {
  const { salary, leavesTaken } = employee;

  // Constants for calculations
  const basicPercentage = 0.5; // Basic salary is 50% of gross
  const hraPercentage = 0.2; // HRA is 20% of gross
  const medicalAllowance = 1250; // Fixed value
  const perDaySalary = salary / 30;

  // Calculate earnings
  const basicSalary = salary * basicPercentage;
  const hra = salary * hraPercentage;
  const grossEarnings = salary - perDaySalary * leavesTaken;

  // Calculate deductions
  const pf = basicSalary * 0.12; // PF = 12% of basic
  const professionalTax = 200; // Fixed PT
  const incomeTax = grossEarnings * 0.1; // 10% IT for simplicity
  const totalDeductions = pf + professionalTax + incomeTax;

  // Calculate net pay
  const netPay = grossEarnings - totalDeductions;

  return {
    basicSalary,
    hra,
    medicalAllowance,
    grossEarnings,
    pf,
    professionalTax,
    incomeTax,
    totalDeductions,
    netPay,
  };
};

module.exports = { loadEmployeeData, calculatePayslip };
