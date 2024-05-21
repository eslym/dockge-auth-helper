const log = console.log;
const env = Bun.env;

let src: string;

if (env.AUTH_SECRET) {
  src = await Bun.file(`/var/run/secrets/${env.AUTH_SECRET}`).text();
} else if (env.AUTH_TOKENS) {
  src = env.AUTH_TOKENS;
} else {
  log("no AUTH_SECRET or AUTH_TOKENS found!");
  process.exit(1);
}

const scanLine = /^(.+)$/gm;

let line: RegExpExecArray | null = null;
const auths: Record<string, { auth: string }> = {};

while ((line = scanLine.exec(src))) {
  if (!URL.canParse(line[1])) continue;
  const entry = line[1].match(/^[a-z][a-z0-9.+]*:\/\//i)
    ? line[1]
    : `https://${line[1]}`;
  const url = new URL(entry);
  const auth = btoa(
    `${decodeURIComponent(url.username)}:${decodeURIComponent(url.password)}`
  );
  url.username = url.password = "";
  log(`found auth for ${url.toString()}.`);
  auths[url.toString()] = { auth };
}

const outfile = env.OUTPUT_FILE || "docker-auths.json";

await Bun.write(outfile, JSON.stringify({ auths }));

log(`config written to ${outfile}`);
