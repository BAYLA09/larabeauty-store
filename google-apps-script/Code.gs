/**
 * Lara Beauty — Google Sheets order webhook
 * Target tab: Tabellenblatt1 (first sheet)
 */

const SPREADSHEET_ID = "1n_vZl2t3X_KV0Rkpj6dR9TZRRm3OETv3IjIdzcH-diU";
const SHEET_NAME = "Tabellenblatt1";
const WEBHOOK_SECRET = "lara-beauty-secret-2026";

function doPost(e) {
  try {
    const body = parseRequestBody_(e);

    if (String(body.secret || "") !== WEBHOOK_SECRET) {
      return jsonResponse_({ success: false, error: "invalid_secret" });
    }

    const sheet = getOrdersSheet_();
    const lines = normalizeLines_(body);

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
      sheet: sheet.getName(),
      rowsAdded: lines.length,
    });
  } catch (error) {
    return jsonResponse_({ success: false, error: String(error) });
  }
}

function normalizeLines_(body) {
  if (Array.isArray(body.lines) && body.lines.length) {
    return body.lines;
  }

  if (body.items) {
    return [
      {
        product: String(body.items),
        url: body.sourceUrl || "",
        sku: body.sku || "",
        quantity: Number(body.quantity || 1),
        totalPrice: Number(body.total || 0),
      },
    ];
  }

  return [];
}

function getOrdersSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const named = spreadsheet.getSheetByName(SHEET_NAME);

  if (named) {
    return named;
  }

  return spreadsheet.getSheets()[0];
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
