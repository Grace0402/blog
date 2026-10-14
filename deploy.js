const { Client } = require("ssh2");
const fs = require("fs");
const path = require("path");

const HOST = process.env.DEPLOY_HOST;
const USER = process.env.DEPLOY_USER || "root";
const PASS = process.env.DEPLOY_PASSWORD;

if (!HOST || !PASS) {
  console.error("缺少部署凭据：请先设置环境变量 DEPLOY_HOST / DEPLOY_USER / DEPLOY_PASSWORD");
  process.exit(1);
}

function connect() {
  const conn = new Client();
  return new Promise((resolve, reject) => {
    conn.on("ready", () => resolve(conn));
    conn.on("error", reject);
    conn.connect({ host: HOST, port: 22, username: USER, password: PASS, readyTimeout: 15000 });
  });
}

function exec(conn, cmd) {
  return new Promise((resolve, reject) => {
    console.log("\n>>> " + cmd.substring(0, 120) + (cmd.length > 120 ? "..." : ""));
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = "", errOut = "";
      stream.on("data", d => { out += d.toString(); process.stdout.write(d); });
      stream.stderr.on("data", d => { errOut += d.toString(); process.stderr.write(d); });
      stream.on("close", code => {
        if (code !== 0) console.log(" [Exit: " + code + "]");
        resolve({ code, stdout: out, stderr: errOut });
      });
    });
  });
}

function sftpPut(conn, local, remote) {
  return new Promise((resolve, reject) => {
    console.log("\n>>> Uploading " + local + " -> " + remote);
    conn.sftp((err, sftp) => {
      if (err) return reject(err);
      const readStream = fs.createReadStream(local);
      const writeStream = sftp.createWriteStream(remote);
      readStream.pipe(writeStream);
      writeStream.on("close", () => { console.log(" Upload done!"); resolve(); });
      writeStream.on("error", reject);
    });
  });
}

async function main() {
  console.log("=== 1. Connecting to server ===");
  const conn = await connect();
  console.log("Connected!");

  console.log("\n=== 2. Check OS ===");
  let osInfo = await exec(conn, "cat /etc/os-release | head -5");
  let isDebian = osInfo.stdout.includes("Ubuntu") || osInfo.stdout.includes("Debian");

  if (isDebian) {
    console.log("\n=== 3. Install Node.js 20 ===");
    await exec(conn, "node -v 2>/dev/null && echo 'node exists' || (curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs)");
    await exec(conn, "node -v && npm -v");

    console.log("\n=== 4. Install Nginx & certbot ===");
    await exec(conn, "apt-get update -qq && apt-get install -y -qq nginx git certbot python3-certbot-nginx 2>&1 | tail -5");

    console.log("\n=== 5. Install PM2 ===");
    await exec(conn, "npm install -g pm2 2>&1 | tail -3");
  } else {
    console.log("\n=== 3. Install Node.js 20 (CentOS) ===");
    await exec(conn, "node -v 2>/dev/null && echo 'node exists' || (curl -fsSL https://rpm.nodesource.com/setup_20.x | bash - && yum install -y nodejs)");
    await exec(conn, "node -v && npm -v");

    console.log("\n=== 4. Install Nginx & certbot ===");
    await exec(conn, "yum install -y nginx git certbot python3-certbot-nginx 2>&1 | tail -5");

    console.log("\n=== 5. Install PM2 ===");
    await exec(conn, "npm install -g pm2 2>&1 | tail -3");
  }

  console.log("\n=== 6. Create project dir ===");
  await exec(conn, "mkdir -p /var/www/blog");

  console.log("\n=== 7. Upload project package ===");
  await sftpPut(conn, "D:\\Blog\\blog-deploy.tar.gz", "/var/www/blog/blog-deploy.tar.gz");

  console.log("\n=== 8. Extract & install deps ===");
  await exec(conn, "cd /var/www/blog && tar -xzf blog-deploy.tar.gz && rm -f blog-deploy.tar.gz && echo 'extracted'");
  await exec(conn, "cd /var/www/blog && npm install --production 2>&1 | tail -5");

  console.log("\n=== 9. Start with PM2 ===");
  await exec(conn, "pm2 delete blog 2>/dev/null; cd /var/www/blog && pm2 start npm --name blog -- run start");
  await exec(conn, "pm2 save");
  await exec(conn, "pm2 startup 2>/dev/null | grep sudo | bash 2>/dev/null || echo 'startup ok'");

  console.log("\n=== 10. Verify ===");
  await exec(conn, "sleep 3 && curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000");
  await exec(conn, "pm2 list");

  console.log("\n=== Deploy done! ===");
  console.log("Blog: http://" + HOST + ":3000");
  console.log("Next: configure Nginx + HTTPS. Tell me your domain!");

  conn.end();
}

main().catch(e => { console.error("FAIL:", e.message); process.exit(1); });