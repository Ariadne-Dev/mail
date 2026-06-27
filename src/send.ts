#!/usr/bin/env node
import { Resend } from "resend";
import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env");

if (existsSync(envPath)) {
  config({ path: envPath });
}

function usage(): never {
  console.error(`Usage:
  mail send --to recipient@example.com --subject "Subject" --body "Body"
  mail send --to recipient@example.com --subject "Subject" --file message.txt
  mail send --dry-run --to recipient@example.com --subject "Subject" --body "Body"

Environment (see .env.example):
  RESEND_API_KEY, MAIL_FROM
`);
  process.exit(1);
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing ${name}. Copy .env.example to .env and add your Resend credentials.`);
    process.exit(1);
  }
  return value;
}

async function readFileArg(path: string): Promise<string> {
  const { readFile } = await import("node:fs/promises");
  const text = (await readFile(path, "utf8")).trim();
  if (!text) {
    console.error(`File is empty: ${path}`);
    process.exit(1);
  }
  return text;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0) usage();

  let dryRun = false;
  let to = process.env.MAIL_TO?.trim() ?? "";
  let subject = "";
  let body = "";

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--dry-run") {
      dryRun = true;
    } else if (arg === "--to") {
      to = args[++i]?.trim() ?? "";
    } else if (arg === "--subject") {
      subject = args[++i]?.trim() ?? "";
    } else if (arg === "--body") {
      body = args[++i]?.trim() ?? "";
    } else if (arg === "--file") {
      const path = args[++i];
      if (!path) usage();
      body = await readFileArg(path);
    } else if (arg.startsWith("-")) {
      usage();
    }
  }

  if (!to || !subject || !body) usage();

  const from = requireEnv("MAIL_FROM");

  if (dryRun) {
    console.log("Dry run — would send:\n");
    console.log(`From:    ${from}`);
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`\n${body}`);
    return;
  }

  const resend = new Resend(requireEnv("RESEND_API_KEY"));
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    text: body,
  });

  if (error) {
    console.error(error.message);
    process.exit(1);
  }

  console.log(`Sent: ${data?.id ?? "ok"}`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
