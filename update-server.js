var { Client } = require('ssh2');
var fs = require('fs');

var HOST = process.env.DEPLOY_HOST;
var USER = process.env.DEPLOY_USER || 'root';
var PASS = process.env.DEPLOY_PASSWORD;
if (!HOST || !PASS) { console.error('请设置环境变量 DEPLOY_HOST / DEPLOY_USER / DEPLOY_PASSWORD'); process.exit(1); }

var conn = new Client();
conn.on('ready', function() {
  console.log('Connected! Uploading...');

  conn.sftp(function(err, sftp) {
    if (err) { console.error(err); process.exit(1); }
    var readStream = fs.createReadStream('D:\\Blog\\blog-update.tar.gz');
    var writeStream = sftp.createWriteStream('/var/www/blog/blog-update.tar.gz');
    var total = fs.statSync('D:\\Blog\\blog-update.tar.gz').size;
    var sent = 0;
    readStream.on('data', function(c) { sent += c.length; if (sent % (10*1024*1024) < 1024*1024) process.stdout.write(Math.round(sent/total*100) + '% '); });
    readStream.pipe(writeStream);
    writeStream.on('close', function() {
      console.log('\nUpload done! Extracting...');
      conn.exec('cd /var/www/blog && tar -xzf blog-update.tar.gz && rm -f blog-update.tar.gz && npm install --production 2>&1 | tail -3 && pm2 restart blog && echo DEPLOY_OK', function(e, stream) {
        stream.on('data', function(d) { process.stdout.write(d.toString()); });
        stream.stderr.on('data', function(d) { process.stderr.write(d.toString()); });
        stream.on('close', function() { console.log('\nDone!'); conn.end(); });
      });
    });
  });
});
conn.connect({ host: HOST, port: 22, username: USER, password: PASS, readyTimeout: 15000 });