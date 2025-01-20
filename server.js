//Nik Hendricks 10/13/23
import VOIP         from 'node.js-sip'
import SIP          from 'node.js-sip/SIP/index.js'
import express      from 'express';
import http         from 'http';
import https        from 'https';
import { Server }   from "socket.io";
import nedb         from 'nedb';
import cookieParser from 'cookie-parser';
import fs           from 'fs';

class FlowPBX {
    constructor(){
        this.init_express();
        this.init_DB();
        this.init_VOIP();
        this.http_io.on('connection', (socket) => {
            console.log('a user connected');
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
        this.update_voip_users();
    }
    
    
    init_express(express_events){
        const app           = express();
        const __dirname     = fs.realpathSync('.');
        const httpServer    = http.createServer(app);
                
        app.use(express.static('public'));
        app.use(express.json({limit: '50mb'}));
        app.use(cookieParser());

        app.post('/api/get', (req, res) => {
            console.log('GET DATA')
            let d = this.get_data(req.body.table, req.body.query).then(d => {
                res.send(d)
            })
        })

        app.post('/api/set', (req, res) => {
            console.log('SET DATA')
            //find and check if the data exists
            let table = this.DB[req.body.table];
            let data = req.body.data;
            let id = data._id;
            let query = req.body.query || {};
            
            //future we will check auth key here passed in data and then remove it.
            
            if(id !== undefined){
                table.findOne({ _id: id }, (err, doc) => {
                    if(doc !== null){
                        console.log('UPDATING')
                        console.log(doc)
                        table.update({ _id: id }, { $set: {...data} }, query, (err, numReplaced) => {
                            res.send({status:'updated'})
                        })
                    }else{
                        table.insert(data, (err, newDoc) => {
                            res.send({status:'inserted'})
                        })
                    }
                })
            }else{
                table.insert(data, (err, newDoc) => {
                    res.send({status:'inserted'})
                    this.update_voip_users();
                })
            }
        })
        
        this.httpServer = httpServer;
        this.http_io = new Server(this.httpServer);
        this.httpServer.listen(80, () => {
            console.log('HTTP Server running on port 80');
        });
    }
    
    get_data(table, query){
        return new Promise(resolve => {
            this.DB[table].find(query, (err, docs) => {
                resolve(docs);
            })
        })
    }
    
    init_DB(){
        this.DB = {
            users:              new nedb({ filename: 'DB/users.db', autoload: true }),
            trunks:             new nedb({ filename: 'DB/trunks.db', autoload: true }),
            routes:             new nedb({ filename: 'DB/routes.db', autoload: true }),
            calls:              new nedb({ filename: 'DB/calls.db', autoload: true }),
            //msg_stack:          new nedb({ filename: 'DB/msg_stack.db', autoload: true }),
        }
    }
    
    update_voip_users(){
        this.get_data('users', {}).then(d => {
            d.forEach((user) => {
                console.log('ADDING USER')
                this.VOIP.UserManager.addUser({
                    username:user.username,
                    password:user.password,
                    extension:user.extension,
                    ip:undefined,
                    port:undefined,
                })
            })
        })
        this.get_data('trunks', {}).then(d => {
            d.forEach((trunk) => {
                console.log('ADDING TRUNK')
                this.VOIP.TrunkManager.addTrunk({
                    name:trunk.name,
                    type:trunk.type,
                    username:trunk.username,
                    password:trunk.password,
                    ip:trunk.ip,
                    port:trunk.port,
                    callId:trunk.callId,
                })
            })
        })
        this.get_data('routes', {}).then(d => {
            d.forEach((route) => {
                console.log('ADDING ROUTE')
                this.VOIP.Router.addRoute({
                    name: route.name,
                    type: route.type,
                    match: route.match,
                    endpoint: route.endpoint,
                })
            })
        })
    }
    
    init_VOIP(){
        this.VOIP = new VOIP({
            type:'server',
            transport:{
                type: 'udp4',
                port: 5060,
            },
        },
        (d) => {
            console.log('')
            console.log('VOIP EVENT')
            console.log(d)
            console.log('')


            if(d.message !== undefined){
                let parsed_headers = SIP.Parser.ParseHeaders(d.message.headers);
                if(d.type == 'REGISTER'){
                    this.VOIP.uas_handle_registration(d.message, (response) => {
                        console.log('response')
                        console.log(response)
                    })
                }else if(d.type == 'INVITE'){
                    console.log('SENDING TO INVITE TO UAS')
                    this.VOIP.uas_handle_invite(d.message, (response) => {
                        console.log('response')
                        console.log(response)
                    })
                    
                }else{
                    console.log('UNKNOWN MESSAGE')
                    console.log(d)
                }
            }
        })
    }
        
}


const USERS = {
    '1000':{
        password:'rootPassword',
        name:'test testerson',
        ip:undefined,
        port:undefined,
        registered:false,
        call_id:undefined,  
        extension: '1000'
    },
    '1001':{
        password:'rootPassword',
        name:'Bill Billerson',
        ip:undefined,
        port:undefined,
        registered:false,
        call_id:undefined,  
        extension: '1001'
    }
}




//server.TrunkManager.addTrunk({
//    name:'trunk1',
//    type:'SIP',
//    username:'1001',
//    password:'rootPassword',
//    ip:'192.168.1.2',
//    port:5060,
//    callId:'1234567890'
//})
//
//server.Router.addRoute({
//    name: 'Main Trunk Route',
//    type: 'trunk',
//    match: '^[0-9]{11}$',
//    endpoint: 'trunk:trunk1',
//})
//
//setTimeout(() => {
//    server.TrunkManager.trunks['trunk1'].register();
//}, 1000)
//
var flowpbx = new FlowPBX();