export async function GET() {
  return Response.json({
    status: "ok",
    service: "lara-beauty-store",
    market: "UAE",
    countryCode: "AE",
    currency: "AED",
    repo: "BAYLA09/larabeauty-store",
    branch: "main",
    timestamp: new Date().toISOString(),
  });
}
