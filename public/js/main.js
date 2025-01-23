import api from './api.js';


class APP{
    constructor(){
        (async () => {
            this.api = api;
            this.DataManager = {
                extensions: await this.api.get_data({table: 'extensions', query: {}}),
                routes: await this.api.get_data({table: 'routes', query: {}}),
                trunks: await this.api.get_data({table: 'trunks', query: {}}),
                trunk_uacs: await this.api.get_trunk_uacs(),
            }
            this._header_height = 50;
            this._header_background_color = 'black';
            this._header_color = 'white';
            this._side_bar_color = this._header_color;
            this._side_bar_background_color = this._header_background_color;
            this._table_header_height = 40;
            this._table_toolbar_button_width = 150;
            this._table_header_row_background_color = '#f1f1f1';
            this.side_bar_toggled = false;
            this._side_bar_width = (window.innerWidth < 700) ? 250 : (this.side_bar_toggled) ? 250 : 50;
            this.side_bar_items = [
                {
                    icon: 'dashboard',
                    name: 'Dashboard',
                    callback: () => {
                        this.content.querySelector('#app-body').InnerHTML('').Append([
                            this.Dashboard()
                        ])
                    }
                },
                {
                    icon: 'tag',
                    name:'Extensions',
                    callback: () => {
                        this.content.querySelector('#app-body').InnerHTML('').Append([
                            this.Extensions()
                        ])
                    }
                },
                {
                    //trunks
                    icon: 'phone',
                    name:'Trunks',
                    callback: () => {
                        this.content.querySelector('#app-body').InnerHTML('').Append([
                            this.Trunks()
                        ])
                    }
                },
                {
                    //routes
                    icon: 'alt_route',
                    name:'Routes',
                    callback: () => {
                        this.content.querySelector('#app-body').InnerHTML('').Append([
                            this.Routes()
                        ])
                    }
                },
                //sip debug
                {
                    icon: 'bug_report',
                    name:'SIP Debug',
                    callback: () => {
                        this.content.querySelector('#app-body').InnerHTML('').Append([
                            this.SipUACSView()
                        ])
                    }
                }
            ]

            this.init_dom();
            this.update()
        })()
    }

    init_dom(){
        HTMLElement.prototype.Style = function(styles){
            for(var key in styles){
                this.style[key] = styles[key]
            }
            return this
        }
          
        HTMLElement.prototype.Append = function(els){
            for(var el in els){
                this.append(els[el])
            }
          
            return this
        }
          
        HTMLElement.prototype.SetAttributes = function(attrs){
            for(var key in attrs){
                this.setAttribute(key, attrs[key])
            }
            return this
        }
        
        HTMLElement.prototype.Classes = function(classes){
            for(var cls in classes){
                this.classList.add(classes[cls])
            }
            return this
        }
        
        HTMLElement.prototype.on = function(event, callback){
            this.addEventListener(event, callback)
            return this
        }
        
        HTMLElement.prototype.onWindowResize = function(callback){
            window.addEventListener('resize', callback)
            return this
        }
        
        HTMLElement.prototype.onViewLoad = function(callback){
            window.addEventListener('load', callback)
            return this
        }
        
        HTMLElement.prototype.InnerHTML = function(html){
             this.innerHTML = html;
             return this;
        }

        this.content = document.createElement('div').Style({
            width: '100%',
            height: '100%',
            display:'block',
        })

        document.body.Append([this.content]).Style({
            margin:'0',
            padding:'0', 
            width:'100%',
            height:'100%',
        })
    }

    update(){
        this.content.InnerHTML('').Append([
            this.AppHeader(),
            this.AppBody(),
            this.AppSideBar(this.side_bar_items)
        ])
    }

    RouteViewReturn(){

    }

    AppHeader(){
        let header = document.createElement('div').Style({
            width: '100%',
            height: `${this._header_height}px`,
            backgroundColor:  this._header_background_color,
            color: this._header_color,
            display:'block',
            textAlign:'center',
            lineHeight: `${this._header_height}px`, 
        }).SetAttributes({
            id: 'app-header'
        })

        let title = document.createElement('span').InnerHTML('FlowPBX').Style({
            fontSize: '20px',
            fontWeight: 'bold',
        })

        let mobile_menu = document.createElement('i').Classes(['material-icons']).InnerHTML('menu').Style({
            float: 'left',
            marginLeft: '10px',
            height: '100%',
            lineHeight: `${this._header_height}px`,
            display:'block',
        }).on('click', () => {
            let sidebar = document.querySelector('#app-sidebar')
            let main_body = document.querySelector('#app-body')
            if(window.innerWidth < 700){
                if(this.side_bar_toggled){
                    sidebar.Style({left: `-${this._side_bar_width}px`})
                    this.side_bar_toggled = false;
                }else{
                    sidebar.Style({left: '0'})
                    this.side_bar_toggled = true;
                }
            }else{
                if(this.side_bar_toggled){
                    this._side_bar_width = 50;
                    sidebar.Style({width: `${this._side_bar_width}px`})
                    main_body.Style({marginLeft: `${this._side_bar_width}px`, width: `calc(100% - ${this._side_bar_width}px)`})
                    this.side_bar_toggled = false;
                    sidebar.querySelectorAll('span').forEach((span) => {
                        span.Style({opacity: '0'})
                    })
                }else{
                    this._side_bar_width = 250;
                    sidebar.Style({width: `${this._side_bar_width}px`})
                    main_body.Style({marginLeft: `${this._side_bar_width}px`, width: `calc(100% - ${this._side_bar_width}px)`})
                    this.side_bar_toggled = true;
                    sidebar.querySelectorAll('span').forEach((span) => {
                        span.Style({opacity: '1'})
                    })
                }
            }

        })

        header.Append([mobile_menu, title])


        return header
    }

    AppSideBar(items){
        let ret = document.createElement('div').SetAttributes({
            id: 'app-sidebar'
        }).Style({
            width: `${this._side_bar_width}px`,
            height: `calc(100% - ${this._header_height}px)`,
            backgroundColor: this._side_bar_background_color,
            color: this._side_bar_color,
            display:'block',
            position:'absolute',
            float:'left',
            transition: 'ease-in-out left 0.3s, ease-in-out width 0.3s',
        }).Append(
            items.map((item) => {
                return document.createElement('div').Style({
                    width: '100%',
                    height: `${this._header_height}px`,
                    display: 'block',
                    cursor: 'pointer',
                    position:'relative',
                }).Append([
                    document.createElement('i').Classes(['material-icons']).InnerHTML(item.icon).Style({
                        float: 'left',
                        marginLeft: '10px',
                        height: '100%',
                        lineHeight: `${this._header_height}px`,
                        display:'block',
                    }),
                    document.createElement('span').InnerHTML(item.name).Style({
                        height: '100%',
                        position:'relative',
                        width:'100%',
                        textAlign:'center', 
                        position:'absolute',
                        lineHeight: `${this._header_height}px`,
                        opacity: (window.innerWidth < 700) ? '1' : (this.side_bar_toggled) ? '1' : '0',
                        transition: 'ease-in-out opacity 0.3s',
                    })
                ]).on('click', () => {
                    item.callback()
                })
            })  
        )

        if(window.innerWidth < 700){
            ret.Style({
                left: (this.side_bar_toggled) ? '0' : `-${this._side_bar_width}px`,
            })
        }else{
            ret.Style({
                width: (this.side_bar_toggled) ? `${this._side_bar_width}px` : '50px',
            })
        }

        return ret
    }

    AppBody(){
        let body = document.createElement('div').SetAttributes({
            id: 'app-body'
        }).Style({
            width: (window.innerWidth < 700) ? '100%' : `calc(100% - ${this._side_bar_width}px)` ,
            marginLeft: (window.innerWidth < 700) ? '0' : `${this._side_bar_width}px`,
            height: '100%',
            display: 'block',
            float: 'left',
            transition: 'ease-in-out margin-left 0.3s, ease-in-out width 0.3s',
        })
        return body
    }

    Toolbar1(props){
        return document.createElement('div').Style({
            width:'100%',
            height: `${this._table_header_height}px`,
            display:'block',
            position:'relative',
            float:'left',
        }).Append([
            //add button
            document.createElement('div').Style({
                width: `${this._table_toolbar_button_width}px`,
                height: `calc(${this._table_header_height}px - 10px)`,
                display: 'block',
                textAlign: 'center',
                lineHeight: `${this._table_header_height}px`,
                marginLeft: '5px',
                marginTop: '5px',
                cursor: 'pointer',
                position:'relative',
                float:'left',
                backgroundColor: '#2ecc71',
                borderRadius: '5px',
                color: 'white',
            }).Append([
                //icon 
                document.createElement('i').Classes(['material-icons']).InnerHTML('add').Style({
                    float: 'left',
                    margin:'0px',
                    height: '100%',
                    width:`${this._table_header_height - 10}px`,
                    lineHeight: `${this._table_header_height - 10}px`,
                    display:'block',
                }),
                //text
                document.createElement('span').InnerHTML('Add').Style({
                    height: '100%',
                    float:'left',
                    width:'100%',
                    textAlign:'center', 
                    position:'absolute',
                    display:'block',
                    lineHeight: `${this._table_header_height - 10}px`,
                    margin:'0px',
                })
            ]).on('click', () => {
                (async () => {
                    console.log(props)
                    await props.prompt.bind(this)()
                })()
            })
        ])
    }

    PromptTypeInput(props){
        return {value: props.value, placeholder: 'Type', key_name: 'type', type: 'select', options: ['User', 'Trunk', 'Route'], on_change: (e) => {
            let v = e.target.parentElement._get_values()
            e.target.parentElement._remove()
            if(e.target.value == 'Trunk'){
                this.TrunkPrompt(v)
            }else if(e.target.value == 'User'){
                this.UserPrompt(v)
            }else if(e.target.value == 'Route'){
                this.RoutePrompt(v)
            }
        }}
    }

    UserPrompt(props){
        props = props || {}
        console.log(props)
        return this.Prompt({
            _id: props._id || undefined,
            title: 'Add User',
            inputs: [
                this.PromptTypeInput({value: props.type}),
                {value: props.extension, placeholder: 'Extension', key_name: 'extension'},
                {value: props.username, placeholder: 'Username', key_name: 'username'},
                {value: props.password, placeholder: 'Password', key_name: 'password'},
            ],
            callback: async (p) => {
                let r = await this.api.set_data({table: 'extensions', data: p})
                console.log(r)
            }
        })
    }

    TrunkPrompt(props){
        props = props || {}
        console.log(props)
        return this.Prompt({
            _id: props._id || undefined,
            title: 'Add Trunk',
            inputs: [
                this.PromptTypeInput({value: props.type}),
                {value: props.trunk_name, placeholder: 'Trunk Name', key_name: 'trunk_name'},
                {value: props.username, placeholder: 'Username', key_name: 'username'},
                {value: props.password, placeholder: 'Password', key_name: 'password'},
                {value: props.ip, placeholder: 'IP', key_name: 'ip'},
                {value: props.port, placeholder: 'Port', key_name: 'port'},
            ],
            callback: async (p) => {
                let r = await this.api.set_data({table: 'trunks', data: p})
                console.log(r)
            }
        })
    }

    PromptRouteTypeInput(props){
        return {value: props.value, placeholder: 'Type', key_name: 'endpoint_type', type: 'select', options: ['Extension', 'Trunk'], on_change: (e) => {
            let v = e.target.parentElement._get_values()
            e.target.parentElement._remove()
            this.RoutePrompt(v)
        }}
    }

    PromptRouteEndpointInput(props){
        return {value: props.value, placeholder: 'Endpoint', key_name: 'endpoint', type: 'select', options: ((props.endpoint_type  || '' ).toLowerCase() == 'extension') ? this.DataManager.extensions.map((user) => {
            return `${user.extension} - ${user.username}`
        }) : this.DataManager.trunks.map((trunk) => {
            return trunk.trunk_name
        })}
    }

    RoutePrompt(props){
        props = props || {}
        return this.Prompt({
            title: 'Add Route',
            inputs: [
                this.PromptTypeInput({value: props.type}),
                this.PromptRouteTypeInput({value: props.endpoint_type}),
                {value: props.name, placeholder: 'Name', key_name: 'name'},
                {value: props.match, placeholder: 'Match', key_name: 'match'},
                this.PromptRouteEndpointInput({value: props.endpoint, endpoint_type: props.endpoint_type}),
            ],
            callback: async (props) => {
                let r = await this.api.set_data({table: 'routes', data: props})
                console.log(r)
            }
        })
    }

    Dashboard(){
        let dashboard = document.createElement('div').Style({
            width: '100%',
            height: '100%',
        })
        let chart1 = document.createElement('canvas').SetAttributes({id: 'myChart'})
        let chart1_container = document.createElement('div').Style({
            width: '50%',
            height: '50%',
            display: 'block',
        }).Append([
            chart1
        ])

        dashboard.Append([
            chart1_container
        ])
       
        new Chart(chart1, {
          type: 'line',
          data: {
            labels: [
                'Monday',
                '12:30',
                '1:00',
                '1:30',
                '2:00',
                '2:30',
                '3:00',
                '3:30',
                '4:00',
                '4:30',
                '5:00',
                '5:30',
                '6:00',
                '6:30',
                '7:00',
                '7:30',
                '8:00',
                '8:30',
                '9:00',
                '9:30',
                '10:00',
                '10:30',
                '11:00',
                '11:30',
                '12:00',
                'Tuesday',
                '12:30',
                '1:00',
                '1:30',
                '2:00',
                '2:30',
                '3:00',
                '3:30',
                '4:00',
                '4:30',
                '5:00',
                '5:30',
                '6:00',
                '6:30',
                '7:00',
                '7:30',
                '8:00',
                '8:30',
                '9:00',
                '9:30',
                '10:00',
                '10:30',
                '11:00',
                '11:30',
                '12:00',
                'Wednesday',
                '12:30',
                '1:00',
                '1:30',
                '2:00',
                '2:30',
                '3:00',
                '3:30',
                '4:00',
                '4:30',
                '5:00',
                '5:30',
                '6:00',
                '6:30',
                '7:00',
                '7:30',
                '8:00',
                '8:30',
                '9:00',
                '9:30',
                '10:00',
                '10:30',
                '11:00',
                '11:30',
                '12:00',
                'Thursday',
                '12:30',
                '1:00',
                '1:30',
                '2:00',
                '2:30',
                '3:00',
                '3:30',
                '4:00',
                '4:30',
                '5:00',
                '5:30',
                '6:00',
                '6:30',
                '7:00',
                '7:30',
                '8:00',
                '8:30',
                '9:00',
                '9:30',
                '10:00',
                '10:30',
                '11:00',
                '11:30',
                '12:00',
                'Friday',
                '12:30',
                '1:00',
                '1:30',
                '2:00',
                '2:30',
                '3:00',
                '3:30',
                '4:00',
                '4:30',
                '5:00',
                '5:30',
                '6:00',
                '6:30',
                '7:00',
                '7:30',
                '8:00',
                '8:30',
                '9:00',
                '9:30',
                '10:00',
                '10:30',
                '11:00',
                '11:30',
                '12:00',
                'Saturday',
                '12:30',
                '1:00',
                '1:30',
                '2:00',
                '2:30',
                '3:00',
                '3:30',
                '4:00',
                '4:30',
                '5:00',
                '5:30',
                '6:00',
                '6:30',
                '7:00',
                '7:30',
                '8:00',
                '8:30',
                '9:00',
                '9:30',
                '10:00',
                '10:30',
                '11:00',
                '11:30',
                '12:00',
                'Sunday',
            ],
            datasets: [{
              label: '# of Calls',
              data: [12, 19, 3, 5, 2, 3],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });

        return dashboard
    }

    Extensions(){
        let data = this.DataManager.extensions.filter((user) => {
            return user.type.toLowerCase() == 'user'
        })
        return this.DataTable({
            data: data,
            toolbar: this.Toolbar1({prompt: this.UserPrompt}),
            columns: [
                {name: 'Extension', key_name: 'extension'},
                {name: 'Type', key_name: 'type'},
                {name: 'Username', key_name: 'username'},
                {name: 'Password', key_name: 'password'},
            ],
            row_onclick: (ev) => {
                let extension_data = this.DataManager.extensions.filter((extension) => {
                    return extension._id == ev.target.parentElement.getAttribute('data-id')
                })
                let d = extension_data[0]
                d._id = ev.target.parentElement.getAttribute('data-id')
                this.UserPrompt(d)
            }
        })
    }

    Trunks(){
        let data = this.DataManager.trunks;
        return this.DataTable({
            data: data,
            toolbar: this.Toolbar1({prompt: this.TrunkPrompt}),
            columns: [
                {name: 'Trunk Name', key_name: 'trunk_name'},
                {name: 'Type', key_name: 'type'},
                {name: 'Username', key_name: 'username'},
                {name: 'Password', key_name: 'password'},
                {name: 'IP', key_name: 'ip'},
                {name: 'Port', key_name: 'port'},
            ],
            row_onclick: (ev) => {
                let trunk_data = this.DataManager.trunks.filter((trunk) => {
                    return trunk._id == ev.target.parentElement.getAttribute('data-id')
                })
                let d = trunk_data[0]
                d._id = ev.target.parentElement.getAttribute('data-id')
                this.TrunkPrompt(d)
            }
        })
    }

    Routes(){
        let data = this.DataManager.routes
        return this.DataTable({
            data: data,
            toolbar: this.Toolbar1({prompt: this.RoutePrompt}),
            columns: [
                {name: 'Name', key_name: 'name'},
                {name: 'Type', key_name: 'type'},
                {name: 'Match', key_name: 'match'},
                {name: 'Endpoint', key_name: 'endpoint'},
            ],
            row_onclick: (ev) => {
                console.log(ev.target.parentElement.getAttribute('data-id'))
            }
        })
    }

    SipUACSView(){
        console.log(this.DataManager.trunk_uacs)
        let data = []

        for(var uac in this.DataManager.trunk_uacs){
            data.push({
                trunk_name: uac,
                username: this.DataManager.trunk_uacs[uac].username,
                ip: this.DataManager.trunk_uacs[uac].ip,
                port: this.DataManager.trunk_uacs[uac].port,
                status: this.DataManager.trunk_uacs[uac].status
            })
        }

        return document.createElement('div').InnerHTML('SIP Debug').Style({
            width: '100%',
            height: '100%',
            display: 'block',
            textAlign: 'center',
            lineHeight: '100px',
            fontSize: '20px',
        }).Append([
            this.DataTable({
                data: data,
                columns: [
                    {name: 'Trunk Name', key_name: 'trunk_name'},
                    {name: 'Username', key_name: 'username'},
                    {name: 'IP', key_name: 'ip'},
                    {name: 'Port', key_name: 'port'},
                    {name: 'Status', key_name: 'status'},
                ],
                row_onclick: (ev) => {
                    console.log(ev.target.parentElement.children[0].innerHTML)

                    let d = this.DataManager.trunk_uacs[ev.target.parentElement.children[0].innerHTML].message_stack
                    document.querySelector('#app-body').InnerHTML('').Append([
                        this.SIPDebugView(d)
                    ])
                }
            })
        ])
    }

    SIPDebugView(d){
        var data = [];
        console.log(d)
        console.log(d.length)
        Object.entries(d).forEach((entry) => {
            data.push(entry[1])
        })

        console.log(data)
        
        return document.createElement('div').InnerHTML('SIP Debug').Style({
            width: '100%',
            height: '100%',
            display: 'block',
            textAlign: 'center',
            lineHeight: '100px',
            fontSize: '20px',
        }).Append([
            ...data.map((dialog) => {
                dialog = Object.entries(dialog).map((entry) => { return entry[1]});
                console.log(dialog[0][0].message);
                
                let dialog_name_el = document.createElement('div').Style({
                    display:'block',
                    width:'100%',
                    height:'40px',
                    lineHeight:'40px',
                    textAlign:'center',
                }).Append([
                    document.createElement('span').InnerHTML('data_array').SetAttributes({class:'material-icons'}).Style({
                        display:'block',
                        fontSize:'24px',
                        height:'40px',
                        lineHeight:'40px',
                        float:'left',
                        paddingLeft:'10px',
                        color:'#3498db',
                    }),
                    document.createElement('span').InnerHTML(dialog[0][0].message.headers.From.split('tag=')[1]).Style({
                        display:'block',
                        fontSize:'18px',
                        height:'auto',
                        position:'absolute',
                        width:'calc(100% - 20px)',
                    }),
                ])
                let dialog_el = document.createElement('div').Style({
                    display:'block',
                    width:'calc(100% - 20px)',
                    height:'40px',
                    lineHeight:'40px',
                    textAlign:'center',
                    fontSize:'18px',
                    borderRadius:'5px',
                    background:'rgb(18, 23, 28)',
                    color:'white',
                    cursor:'pointer',
                    marginLeft:'10px',
                    marginRight:'10px',
                    marginTop:'5px',
                    float:'left',
                    transition:'height 0.3s',
                }).SetAttributes({
                    toggled:false,
                })

                dialog_el.Append([
                    dialog_name_el,
                ]).on('click', () => {
                    console.log(dialog_el)
                    dialog_el.SetAttributes({toggled: dialog_el.getAttribute('toggled') == 'true' ? 'false' : 'true'});
                    if(dialog_el.getAttribute('toggled') == 'true'){
                        dialog_el.Append(this.SIPFlowElement(dialog_name_el, dialog));
                        dialog_el.Style({
                            height:'auto',
                        })
                    }else{
                        dialog_el.innerHTML = '';
                        dialog_el.Append([dialog_name_el]);
                    }
                })

                return dialog_el;

            })
        ])
    }

    DataTable(props){
        if(props.data === undefined){
            props.data = []
        }
        let row_count = 0;
        let table = document.createElement('div').Style({
            width: '100%',
            height: '100%',
        }).Append([
            ((props.toolbar !== undefined) ? props.toolbar : document.createElement('div').Style({
                width:'100%',
                height: `${this._table_header_height}px`,
                display:'block',
                position:'relative',
                float:'left',
            })).Style({
                backgroundColor: this._table_header_row_background_color,
            }),
            document.createElement('div').Style({
                width: '100%',
                height: `${this._table_header_height}px`,
                display: 'block',
                alignItems: 'center',
            }).SetAttributes({id: 'table-header'}).Append([
                ...props.columns.map((column) => {
                    return document.createElement('div').Style({
                        width: `calc(100% / ${props.columns.length})`,
                        height: '100%',
                        display: 'block',
                        textAlign: 'center',
                        alignItems: 'center',
                        float: 'left',
                        lineHeight: `${this._table_header_height}px`,
                        background:this._table_header_row_background_color,
                        fontWeight: 'bold',
                    }).InnerHTML(column.name)
                })
            ]),
            document.createElement('div').Style({
                width: '100%',
                height: 'calc(100% - 50px)',
                display: 'block',
            }).SetAttributes({id: 'table-body'})
        ])

        for(var row of props.data){
            //row = Object.keys(row).reduce((acc, key) => {
            //    acc[key.toLowerCase()] = row[key]
            //    return acc
            //}, {})
            let row_el = document.createElement('div').Style({
                width: '100%',
                height: `${this._table_header_height}px`,
                display: 'block',
                position: 'relative',
                float: 'left',
            }).Append(
                props.columns.map((column) => {
                    let c_name = column.key_name.toLowerCase()
                    return document.createElement('div').Style({
                        width: `calc(100% / ${props.columns.length})`,
                        height: '100%',
                        display: 'block',
                        textAlign: 'center',
                        alignItems: 'center',
                        float: 'left',
                        lineHeight: `${this._table_header_height}px`,
                        borderBottom: '1px solid #f1f1f1',
                    }).InnerHTML(row[c_name])
                })
            ).SetAttributes({'data-id': row._id}).on('click', (ev) => {
                if(props.row_onclick !== undefined){
                    props.row_onclick(ev)
                }
            })

            table.querySelector('#table-body').Append([row_el])
        }

        return table
    }

    Prompt(props){
        let blocker = document.createElement('div').Style({
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            top: '0',
            left: '0',
            display: 'block',
            zIndex: '1000',
        }).on('click', () => {
            prompt._remove()
        })

        let prompt = document.createElement('div').Style({
            width: '300px',
            height: 90 + props.inputs.length * 50 + 'px',
            backgroundColor: 'white',
            position: 'absolute',
            top: `calc(50% - ${90 + props.inputs.length * 50}px / 2)`,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'block',
            borderRadius: '5px',
            padding: '10px',
            boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.5)',
            zIndex: '1001',
        })

        let title = document.createElement('div').Style({
            width: '100%',
            height: '40px',
            display: 'block',
            textAlign: 'center',
            lineHeight: '40px',
            fontSize: '20px',
        }).InnerHTML(props.title)


        let submit = document.createElement('div').Style({
            width: '100%',
            height: '40px',
            display: 'block',
            marginTop: '10px',
            textAlign: 'center',
            lineHeight: '40px',
            cursor: 'pointer',
            backgroundColor: 'blue',
            color: 'white',
            borderRadius: '5px',
        }).InnerHTML('Submit').on('click', () => {
            console.log(prompt._get_values())
            props.callback(prompt._get_values())
            prompt._remove()
        })

        prompt.Append([
            title,
            ...props.inputs.map((input) => {
                if(input.type == 'select'){
                    console.log(input)
                    let i = document.createElement('select').Style({
                        width: '100%',
                        height: '40px',
                        display: 'block',
                        marginTop: '10px',
                        padding: '5px',
                        boxSizing: 'border-box',
                    }).SetAttributes({value: (input.value !== undefined) ? input.value.toLowerCase() : '', placeholder: input.placeholder, key_name: input.key_name}).Append([
                        document.createElement('option').InnerHTML(input.value || `Select ${input.placeholder}`),
                        ...input.options.map((option) => {
                            return document.createElement('option').InnerHTML(option)
                        })
                    ]).on('change', (e) => {
                        if(input.on_change !== undefined){
                            input.on_change(e)
                        }
                    })
                    return i
                }else{
                    let i = document.createElement('input').Style({
                        width: '100%',
                        height: '40px',
                        display: 'block',
                        marginTop: '10px',
                        padding: '5px',
                        boxSizing: 'border-box',
                    }).SetAttributes({value: input.value || '', placeholder: input.placeholder, type: input.type || 'text', key_name: input.key_name}).on('click', (e) => {
                        e.stopPropagation()
                        if(input.on_click !== undefined){
                            input.on_click(e)
                        }
                    })
                    return i
                }
            }),
            submit
        ])

        prompt._remove = () => {
            blocker.remove()
            prompt.remove()
        }

        prompt._get_values = () => {
            let values = {}
            Object.entries(prompt.querySelectorAll('input[type="text"], input[type="password"], select')).map((entry) => {
                return entry[1]
            }).forEach((input) => {
                console.log(input.getAttribute('key_name'))
                console.log(input.value)
                values[input.getAttribute('key_name')] = input.value
            })

            console.log(props)
            if(props._id !== undefined){
                values._id = props._id
            }

            return values;
        }

        document.body.Append([blocker, prompt])
    }

    SIPFlowElement(dialog_name_el, dialog){

        return [
            dialog_name_el,
            ...dialog.map((messages) => {
                return document.createElement('div').Style({
                    display:'block',
                    width:'100%',
                    height:'100%',
                }).Append([
                    ...messages.map((message) => {
                        return document.createElement('div').Style({
                            display:'block',
                            width:'100%',
                            height:'100%',
                            float:'left',
                            borderBottom:'1px solid #ddd',
                        }).Append([
                            document.createElement('span').InnerHTML(message.sent ? 'arrow_upward' : 'arrow_downward').SetAttributes({class:'material-icons'}).Style({
                                display:'block',
                                width:'auto',
                                height:'40px',
                                lineHeight:'40px',
                                textAlign:'center',
                                float:'left',
                                fontSize:'15px',
                                color: message.sent ? '#2ecc71' : '#f39c12',
                                marginLeft:'10px',
                            }),
                            document.createElement('span').InnerHTML(message.message.method !== undefined ? message.message.method : message.message.statusCode).Style({
                                display:'block',
                                width:'auto',
                                height:'100%',
                                textAlign:'left',
                                paddingLeft:'10px',
                                float:'left',
                                fontSize:'15px',
                                color: message.message.method !== undefined ? '#3498db' : 'white',
                            }),
                            (message.message.isResponse) ? document.createElement('span').InnerHTML(`${message.message.statusText}`).Style({
                                display:'block',
                                width:'auto',
                                height:'100%',
                                textAlign:'left',
                                paddingLeft:'10px',
                                float:'left',
                                fontSize:'12px',
                                color:(message.message.statusCode > 199 && message.message.statusCode < 300) ? '#2ecc71' : (message.message.statusCode > 399 && message.message.statusCode < 500) ? '#e74c3c' : (message.message.statusCode > 499 && message.message.statusCode < 600) ? '#e74c3c' : '#16a085',

                            }) : undefined,
                            document.createElement('span').InnerHTML(`${message.message.headers.From.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;')}`).Style({
                                display:'block',
                                width:'auto',
                                height:'100%',
                                textAlign:'left',
                                paddingLeft:'10px',
                                float:'left',
                                fontSize:'12px',
                                color:'grey',
                            }),
                            document.createElement('span').InnerHTML(`${message.message.headers.Via.split('branch=')[1].split(';')[0]}`).Style({
                                display:'block',
                                width:'auto',
                                height:'100%',
                                textAlign:'left',
                                paddingLeft:'10px',
                                float:'left',
                                fontSize:'12px',
                                color:'grey',
                            }),
                        ].filter((el) => { return el !== undefined}))
                    })
                ])
            })
        ]
    }

}

window.app = new APP();