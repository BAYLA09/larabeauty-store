/**
 * Lara Beauty — Google Sheets order webhook
 *
 * Setup:
 * 1. Open your sheet → Extensions → Apps Script
 * 2. Paste this file, save
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the /exec URL (without /u/1/ in the path)
 */

const SPREADSHEET_ID = "1n_vZl2t3X_KV0Rkpj6dR9TZRRm3OETv3IjIdzcH-diU";
const SHEET_NAME = "Commandes";
const WEBHOOK_SECRET = "lara-beauty-secret-2026";

const HEADERS = [
  "Date",
  "Order ID",
  "Customer Name",
  "Phone",
  "Area",
  "Items",
  "Total",
  "Currency",
  "Status",
  "Source URL",
  "Event ID",
];

function doPost(e) {
  try {
    const body = parseRequestBody_(e);
    const secret = String(body.secret || "");

    if (secret !== WEBHOOK_SECRET) {
      return jsonResponse_({ success: false, error: "invalid_secret" });
    }

    const sheet = getOrdersSheet_();
    ensureHeaders_(sheet);

    const row = [
      body.date || new Date().toISOString(),
      body.orderId || "",
      body.customerName || "",
      body.phone || "",
      body.area || "",
      body.items || "",
      Number(body.total || 0),
      body.currency || "AED",
      body.status || "new",
      body.sourceUrl || "",
      body.eventId || "",
    ];

    sheet.appendRow(row);

    return jsonResponse_({ success: true, orderId: body.orderId || "" });
  } catch (error) {
    return jsonResponse_({
      success: false,
      error: String(error),
    });
  }
}

function getOrdersSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  return sheet;
}

function ensureHeaders_(sheet) {
  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = firstRow.some(function (cell) {
    return String(cell || "").trim() !== "";
  });

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
}

function parseRequestBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("missing_body");
  }

  return JSON.parse(e.postData.contents);
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
