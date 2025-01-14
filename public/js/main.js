import api from './api.js';


class APP{
    constructor(){
        (async () => {
            this.api = api;
            this.DataManager = {
                users: await this.api.get_data({table: 'users', query: {}}),
                routes: await this.api.get_data({table: 'routes', query: {}}),
            }
            this._header_height = 50;
            this._header_background_color = 'black';
            this._header_color = 'white';
            this._side_bar_width = 250;
            this._side_bar_color = this._header_color;
            this._side_bar_background_color = this._header_background_color;
            this._table_header_height = 40;
            this._table_toolbar_button_width = 150;
            this._table_header_row_background_color = '#f1f1f1';
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

    AppHeader(){
        let header = document.createElement('div')
        header.SetAttributes({
            id: 'app-header'
        })
        header.Style({
            width: '100%',
            height: `${this._header_height}px`,
            backgroundColor:  this._header_background_color,
            color: this._header_color,
            display:'block',
            textAlign:'center',
            lineHeight: `${this._header_height}px`, 
        })
        header.InnerHTML('FlowPBX')
        return header
    }

    AppSideBar(items){
        return document.createElement('div').SetAttributes({
            id: 'app-sidebar'
        }).Style({
            width: `${this._side_bar_width}px`,
            height: `calc(100% - ${this._header_height}px)`,
            backgroundColor: this._side_bar_background_color,
            color: this._side_bar_color,
            display:'block',
            position:'fixed',
            float:'left',
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
                        display:'block',
                    }).on('click', () => {
                        item.callback()
                    })
                ])
            })  
        )
    }

    AppBody(){
        let body = document.createElement('div').SetAttributes({
            id: 'app-body'
        }).Style({
            width: (window.innerWidth < 700) ? '100%' : `calc(100% - ${this._side_bar_width}px)`,
            marginLeft: (window.innerWidth < 700) ? '0' : `${this._side_bar_width}px`,
            height: '100%',
            display: 'block',
            float: 'left',
        })
        //body.Append([
        //    this.LoginForm()
        //])
        return body
    }

    Toolbar1(){
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
                    this.Prompt({
                        title: 'Add Extension',
                        inputs: [
                            {value: 'type', key_name: 'type', type: 'select', options: ['User', 'Trunk', 'Route']},
                            {value: 'Extension', key_name: 'extension'},
                            {value: 'Username', key_name: 'username'},
                            {value: 'Password', key_name: 'password'},
                        ],
                        callback: async (props) => {
                            let r = await this.api.set_data({table: 'users', data: {username: props.username, password: props.password}})
                            console.log(r)
                        }
                    })
                    //let r = await this.api.set_data({table: 'users', data: {username: 'test', password: 'test', email: 'test', role: 'test'}})
                    //console.log(r)
                })()
            })
        ])
    }

    //views

    Dashboard(){
        let dashboard = document.createElement('div')
        dashboard.Style({
            width: '100%',
            height: '100%',
        })
        dashboard.InnerHTML('Dashboard')
        return dashboard
    }

    Extensions(){
        let data = this.DataManager.users;
        return this.DataTable({
            data: data,
            toolbar: this.Toolbar1(),
            columns: [
                {name: 'Extension'},
                {name: 'Type'},
                {name: 'Username'},
                {name: 'Password'},
            ]
        })
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
            row = Object.keys(row).reduce((acc, key) => {
                acc[key.toLowerCase()] = row[key]
                return acc
            }, {})
            let row_el = document.createElement('div').Style({
                width: '100%',
                height: `${this._table_header_height}px`,
                display: 'block',
                position: 'relative',
                float: 'left',
            }).Append(
                props.columns.map((column) => {
                    let c_name = column.name.toLowerCase()
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
            )

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
            //select text inputs and password inputs
            let values = {}
            Object.entries(prompt.querySelectorAll('input[type="text"], input[type="password"], select')).map((entry) => {
                return entry[1]
            }).forEach((input) => {
                console.log(input.getAttribute('key_name'))
                console.log(input.value)
                values[input.getAttribute('key_name')] = input.value
            })
            console.log(values)
            props.callback(values)
            prompt._remove()
        })

        prompt.Append([
            title,
            ...props.inputs.map((input) => {
                if(input.type == 'select'){
                    let i = document.createElement('select').Style({
                        width: '100%',
                        height: '40px',
                        display: 'block',
                        marginTop: '10px',
                        padding: '5px',
                        boxSizing: 'border-box',
                    }).SetAttributes({placeholder: input.value, key_name: input.key_name}).Append([
                        document.createElement('option').InnerHTML(`Select ${input.value}`),
                        ...input.options.map((option) => {
                            return document.createElement('option').InnerHTML(option)
                        })
                    ])
                    return i
                }else{
                    let i = document.createElement('input').Style({
                        width: '100%',
                        height: '40px',
                        display: 'block',
                        marginTop: '10px',
                        padding: '5px',
                        boxSizing: 'border-box',
                    }).SetAttributes({placeholder: input.value, type: input.type || 'text', key_name: input.key_name})  
                    return i
                }
            }),
            submit
        ])

        prompt._remove = () => {
            blocker.remove()
            prompt.remove()
        }

        document.body.Append([blocker, prompt])
    }

}

window.app = new APP();