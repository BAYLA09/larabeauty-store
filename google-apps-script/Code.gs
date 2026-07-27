/**
 * Lara Beauty — Google Sheets order webhook
 *
 * Writes one row per product line to tab "Tabellenblatt1".
 *
 * Columns: date | order id | country | name | phone | product | url | sku | quantite | totalprice | currency
 */

const SPREADSHEET_ID = "1n_vZl2t3X_KV0Rkpj6dR9TZRRm3OETv3IjIdzcH-diU";
const SHEET_NAME = "Tabellenblatt1";
const WEBHOOK_SECRET = "lara-beauty-secret-2026";

function doPost(e) {
  try {
    const body = parseRequestBody_(e);
    const secret = String(body.secret || "");

    if (secret !== WEBHOOK_SECRET) {
      return jsonResponse_({ success: false, error: "invalid_secret" });
    }

    const sheet = getOrdersSheet_();
    const lines = Array.isArray(body.lines) ? body.lines : [];

    if (!lines.length) {
      return jsonResponse_({ success: false, error: "missing_lines" });
    }

    lines.forEach(function (line) {
      sheet.appendRow([
        body.date || new Date().toISOString(),
        body.orderId || "",
        body.country || "AE",
        body.customerName || "",
        body.phone || "",
        line.product || "",
        line.url || body.sourceUrl || "",
        line.sku || "",
        Number(line.quantity || 0),
        Number(line.totalPrice || 0),
        body.currency || "AED",
      ]);
    });

    return jsonResponse_({
      success: true,
      orderId: body.orderId || "",
      rowsAdded: lines.length,
    });
  } catch (error) {
    return jsonResponse_({
      success: false,
      error: String(error),
    });
  }
}

function getOrdersSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error("sheet_not_found: " + SHEET_NAME);
  }

  return sheet;
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
