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

const scanVal = /^([^=#\s]+)\s*=\s*([^:]*:.*)\s*(?:#|$)/gm;

let scan: RegExpExecArray | null = null;
const auths: Record<string, { auth: string }> = {};

while ((scan = scanVal.exec(src))) {
  let [, entry, cred] = scan;
  if (entry === "@") entry = "https://index.docker.io/v1/";
  log(`found ${entry}`);
  auths[entry] = { auth: btoa(cred) };
}

const outfile = env.OUTPUT_FILE || "docker-auths.json";

await Bun.write(outfile, JSON.stringify({ auths }));

log(`config written to ${outfile}`);
