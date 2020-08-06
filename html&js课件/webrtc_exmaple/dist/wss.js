
var keypath = '/home/mcs/ssl/ap_ssl.key';//我把秘钥文件放在运行命令的目录下测试
var certpath = '/home/mcs/ssl/ap_ssl.crt';//console.log(keypath);
//console.log(certpath);
var wsConnect1;
var wsConnect2;
var fs=require('fs');
var https=require('https');
var ws=require('ws');

var options = {
    key: fs.readFileSync(keypath),
    cert: fs.readFileSync(certpath),
    //passphrase:'1234'//如果秘钥文件有密码的话，用这个属性设置密码
};

var server=https.createServer(options, function (req, res) {//要是单纯的https连接的话就会返回这个东西
    res.writeHead(403);//403即可
    res.end("This is a  WebSockets server!\n");
}).listen(18443);


var WSSserver = new ws.Server({server: server});
var sdp1;

WSSserver.on('connection', function(wsConnect){
    console.log("连接成功。");
    if(!wsConnect1) {
        console.log("ws1");
        wsConnect1 = wsConnect;
        wsConnect1.on('message', function(msg){
            console.log("ws1 send:"+msg);
            // wsConnect1.send(msg);
            sdp1=msg;
        });
    } else if (!wsConnect2) {
        console.log("ws2");
        wsConnect2 = wsConnect;

        wsConnect2.on('message', function(msg){
            console.log("ws2 send:"+msg);
            // wsConnect2.send(msg);
            if (sdp1!==null) {
                wsConnect2.send(sdp1);
                sdp1 = null;
            }
            if (msg!=="1")
            wsConnect1.send(msg);
        });
    }

});

console.log("WebSocket建立完毕");
