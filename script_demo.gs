/**
 * Google Apps Script for Member Authentication
 * Handles login verification and returns user business unit
 */

// Configuration
const SPREADSHEET_ID = '1qYlpT4LdG-RM_P7Jat14pMoXP7FFrohWgWXncWbLVt8'; // Replace with your actual spreadsheet ID
const SHEET_NAME = 'PDF1'; // Sheet containing member data

/**
 * Web app entry point
 * Handles GET and POST requests
 */
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

/**
 * Main request handler
 */
function handleRequest(e) {
  try {
    const action = e.parameter.action;
    
    switch(action) {
      case 'login':
        return handleLogin(e.parameter.username);
      case 'test':
        return ContentService
          .createTextOutput(JSON.stringify({success: true, message: 'Script is working'}))
          .setMimeType(ContentService.MimeType.JSON);
      default:
        return ContentService
          .createTextOutput(JSON.stringify({success: false, message: 'Invalid action'}))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle login authentication
 */
function handleLogin(username) {
  if (!username) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, message: 'Code is required'}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({success: false, message: 'Members sheet not found'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Get all data from the sheet
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Find required columns
    const codeCol = headers.indexOf('CODE');
    const companyCol = headers.indexOf('Company');
    const buCol = headers.indexOf('BU');
    const pdfCol = headers.indexOf('PDF');
    
    if (codeCol === -1 || companyCol === -1 || buCol === -1 || pdfCol === -1) {
      return ContentService
        .createTextOutput(JSON.stringify({success: false, message: 'Required columns (CODE, Company, BU, PDF) not found'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Search for the code
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[codeCol] && row[codeCol].toString() === username) {
        const company = row[companyCol] ? row[companyCol].toString() : '';
        const bu = row[buCol] ? row[buCol].toString() : '';
        const pdf = row[pdfCol] ? row[pdfCol].toString() : '';
        
        // Determine PDF file based on PDF column value
        let pdfFile;
        if (pdf === 'PDF1') {
          pdfFile = 'Handbook_RENDE.pdf';
        } else if (pdf === 'PDF2') {
          pdfFile = 'Handbook_RENDE_002.pdf';
        } else {
          return ContentService
            .createTextOutput(JSON.stringify({success: false, message: 'Invalid PDF type'}))
            .setMimeType(ContentService.MimeType.JSON);
        }
        
        return ContentService
          .createTextOutput(JSON.stringify({
            success: true, 
            code: username,
            company: company,
            bu: bu,
            pdf: pdf,
            pdfFile: pdfFile,
            message: 'Login successful'
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Code not found
    return ContentService
      .createTextOutput(JSON.stringify({success: false, message: 'Code not found'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, message: 'Database error: ' + error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function to verify script setup
 */
function testScript() {
  Logger.log('Script is working correctly');
  return 'Script test successful';
}