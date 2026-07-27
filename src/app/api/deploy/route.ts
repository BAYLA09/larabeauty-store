import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(request: Request) {
  const expected =
    process.env.DEPLOY_WEBHOOK_SECRET || "lara-beauty-secret-2026";
  const auth = request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!token || token !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const script = path.join(process.cwd(), "scripts", "deploy-production.sh");
  const child = spawn("bash", [script], {
    detached: true,
    stdio: "ignore",
    env: process.env,
  });
  child.unref();

  return NextResponse.json({
    success: true,
    message: "deploy started",
    host: process.env.HOSTNAME || "server",
  });
}
