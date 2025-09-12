/**
 * Google Apps Script for Member Authentication
 * Handles login verification and returns user business unit
 */

// Configuration
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Replace with your actual spreadsheet ID
const SHEET_NAME = 'Members'; // Sheet containing member data

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
      .createTextOutput(JSON.stringify({success: false, message: 'Username is required'}))
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
    
    // Find username and bu columns
    const usernameCol = headers.indexOf('username');
    const buCol = headers.indexOf('bu');
    
    if (usernameCol === -1 || buCol === -1) {
      return ContentService
        .createTextOutput(JSON.stringify({success: false, message: 'Required columns (username, bu) not found'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Search for the username
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[usernameCol] && row[usernameCol].toString().toLowerCase() === username.toLowerCase()) {
        const bu = row[buCol] ? row[buCol].toString().toLowerCase() : '';
        
        // Determine PDF based on BU
        let pdfFile;
        if (bu === 'corporate') {
          pdfFile = 'Handbook_RENDE.pdf';
        } else if (bu === 'sport') {
          pdfFile = 'Handbook_RENDE_002.pdf';
        } else {
          return ContentService
            .createTextOutput(JSON.stringify({success: false, message: 'Invalid business unit'}))
            .setMimeType(ContentService.MimeType.JSON);
        }
        
        return ContentService
          .createTextOutput(JSON.stringify({
            success: true, 
            bu: bu,
            pdfFile: pdfFile,
            message: 'Login successful'
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Username not found
    return ContentService
      .createTextOutput(JSON.stringify({success: false, message: 'Username not found'}))
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