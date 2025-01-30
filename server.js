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
        this.LiveData = {};
        this.get_data('extensions', {}).then(extensions => {
            this.get_data('trunks', {}).then(trunks => {
                this.get_data('routes', {}).then(routes => {
                    this.init_VOIP();
                    this.init_nodes(extensions);
                    this.http_io.on('connection', (socket) => {
                        console.log('a user connected');
                        socket.on('disconnect', () => {
                            console.log('user disconnected');
                        });
                    });
                    this.update_voip_users(extensions, trunks, routes);
                })
            })
        })
    }
    
    
    init_express(express_events){
        const app           = express();
        const __dirname     = fs.realpathSync('.');
        const httpServer    = http.createServer(app);
                
        app.use(express.static('public'));
        app.use(express.json({limit: '50mb'}));
        app.use(cookieParser());

        app.get('/js/:file', (req, res) => {
            res.sendFile(__dirname + '/public/js/' + req.params.file);
        })

        app.get('/css/:file', (req, res) => {
            res.sendFile(__dirname + '/public/css/' + req.params.file);
        })

        app.post('/api/get', (req, res) => {
            console.log('GET DATA')
            let d = this.get_data(req.body.table, req.body.query).then(d => {
                res.send(d)
            })
        })

        app.post('/api/set', (req, res) => {
            console.log('SET DATA')
            let table = this.DB[req.body.table];
            let data = req.body.data;
            let id = data._id;
            let query = req.body.query || {};
            
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
                    this.get_data('extensions', {}).then(extensions => {
                        this.get_data('trunks', {}).then(trunks => {
                            this.get_data('routes', {}).then(routes => {
                                this.update_voip_users(extensions, trunks, routes);
                            })
                        })
                    })
                })
            }
        })

        app.get('/api/get_litegraph_nodes', (req, res) => {
            let ret = {};
            this.nodes.forEach(node => {
                ret[node.name] = node;
            })
            res.send(ret);
        })

        app.get('/pbx/uacs/', (req, res) => {
            let ret = {};
           for(var t in this.VOIP.TrunkManager.items){
                let trunk = this.VOIP.TrunkManager.items[t];
                ret[t] = trunk.uac
           }
            res.json(ret);
        })

        app.get('*', (req, res) => {
            res.sendFile(__dirname + '/public/index.html');
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
            extensions:         new nedb({ filename: 'DB/extensions.db', autoload: true }),
            trunks:             new nedb({ filename: 'DB/trunks.db', autoload: true }),
            routes:             new nedb({ filename: 'DB/routes.db', autoload: true }),
            calls:              new nedb({ filename: 'DB/calls.db', autoload: true }),
            //msg_stack:          new nedb({ filename: 'DB/msg_stack.db', autoload: true }),
        }
    }
    
    update_voip_users(extensions, trunks, routes){
        console.log({
            extensions: extensions,
            trunks: trunks,
            routes: routes
        })
        extensions.forEach((user) => {
            console.log('ADDING USER')
            this.VOIP.UserManager.addUser({
                username:user.username,
                password:user.password,
                extension:user.extension,
                ip:undefined,
                port:undefined,
            })
        })
        

            trunks.forEach((trunk) => {
                console.log('ADDING TRUNK')
                this.VOIP.TrunkManager.addTrunk({
                    name:trunk.trunk_name,
                    type:trunk.type,
                    username:trunk.username,
                    password:trunk.password,
                    ip:trunk.ip,
                    port:trunk.port,
                    callId:trunk.callId,
                })
            })
        
            routes.forEach((route) => {
                let nodes = route.nodes;
                if(nodes){
                    nodes.links.forEach(link => {
                        let from = nodes.nodes.filter(node => { return node.id == link[1] })[0];
                        let output = from.outputs.filter(o => {return o.links !== null}).filter(o => {return o.links.includes(link[0])})[0]
                        console.log(`FROM => ${from.type} -> ${output.type} : ${output.name}`)
                        console.log(this.nodes.filter(node => { return node.name == from.type.split('/')[1] })[0].onServerExecute)
                        let to = nodes.nodes.filter(node => { return node.id == link[3] })[0];
                        let input = to.inputs[link[4]];
                        console.log(`TO => ${to.type} -> ${input.type} : ${input.name} : ${input.link}`)
                    })
                }
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

    init_nodes(extensions){
        this.nodes = [
            {
                name: 'IVR',
                nodepath: 'VOIP',
                inputs: [
                    {name: 'MOH', type: 'audio_stream'},
                    {name: 'Input', type: 'number'},
                ],
                outputs: [
                    {name: '1', type: 'number'},
                    {name: '2', type: 'number'},
                    {name: '3', type: 'number'},
                    {name: '4', type: 'number'},
                    {name: '5', type: 'number'},
                    {name: '6', type: 'number'},
                    {name: '7', type: 'number'},
                    {name: '8', type: 'number'},
                    {name: '9', type: 'number'},
                    {name: '0', type: 'number'},
                ],
                widgets: [
                    {
                        type: 'button',
                        name: 'Add Input',
                        callback: (value) => {
                            console.log(value)
                            value.addInput('Input', 'number')
                        }
                    }
                ],
                onExecute: (node) => {
                    console.log(node)
                },
                onServerExecute: (node) => {
                    console.log(node)
                }
            },
            {
                name: 'MOH',
                nodepath: 'VOIP',
                inputs: [
                    {name: 'Input', type: 'number'},
                ],
                outputs: [
                    {name: 'Output', type: 'audio_stream'},
                ],
                widgets: [
                    {
                        type: 'slider',
                        name: 'Volume',
                        value: 50,
                        callback: (value) => {
                            console.log(value)
                        },
                        options: {
                            min: 0,
                            max: 100,
                        }
                    },
                    {
                        type:'text',
                        name: 'Text',
                        value: 'Hello World',
                        onWidgetChange: (value) => {
                            console.log(value)
                        }
                    }
                ],
                onExecute: (node) => {
                    console.log(node)
                },
                onServerExecute: (node) => {
                    console.log(node)
                }
            },
            {
                name: 'Route Match',
                nodepath: 'VOIP',
                inputs: [],
                outputs: [
                    {name: 'Match', type: 'number'},
                ],
                widgets: [
                    {
                        type: 'text',
                        name: 'Match',
                        value: '1234',
                        callback: (value) => {
                            console.log(value)
                        }
                    }
                ],
                onServerExecute: (node) => {
                    console.log(node)
                }
            },
            {
                name: 'User Endpoint',
                nodepath: 'VOIP',
                inputs: [
                    {name: 'Input', type: 'number'},
                ],
                outputs: [],
                widgets: [
                    {
                        type: "combo",
                        name: "User",
                        value: "User 1",
                        options:{
                            values: extensions.map(e => { return e.username })
                            
                        },
                        callback: (value) => {
                            console.log(value)
                        }
                    }
                ],
                onServerExecute: (value) => {
                    console.log(value)
                }
            }
        ]
    }
        
}

var flowpbx = new FlowPBX();