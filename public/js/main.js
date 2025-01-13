import api from './api.js';


class APP{
    constructor(){
        this.api = api;
        this._header_height = 50;
        this._header_background_color = 'black';
        this._header_color = 'white';
        this._side_bar_width = 250;
        this._side_bar_color = this._header_color;
        this._side_bar_background_color = this._header_background_color;
        this._table_header_height = 40;
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
                icon: 'groups',
                name:'Users',
                callback: () => {
                    this.content.querySelector('#app-body').InnerHTML('').Append([
                        this.Users()
                    ])
                    
                }
            }
        ]


        this.init_dom();
        this.update()
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
                    height: '50px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer'
                }).Append([
                    document.createElement('i').Classes(['material-icons']).InnerHTML(item.icon).Style({
                        float: 'left',
                        marginLeft: '10px',
                        height: '100%',
                    }),
                    document.createElement('span').InnerHTML(item.name).Style({
                        height: '100%',
                        position:'relative',
                        width:'100%',
                        textAlign:'center', 
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

    Users(){
        return this.DataTable({
            columns: [
                {name: 'Username', width: 20},
                {name: 'Password', width: 20},
                {name: 'Email', width: 20},
                {name: 'Role', width: 20},
                {name: 'Actions', width: 20},
            ]
        })
    }

    DataTable(props){
        let table = document.createElement('div').Style({
            width: '100%',
            height: '100%',
        }).Append([
            document.createElement('div').Style({
                width:'100%',
                height: `${this._table_header_height}px`,
                display:'block',
            }).Append([

            ]),
            document.createElement('div').Style({
                width: '100%',
                height: `${this._table_header_height}px`,
                display: 'block',
                alignItems: 'center',
            }).SetAttributes({id: 'table-header'}).Append([
                ...props.columns.map((column) => {
                    return document.createElement('div').Style({
                        width: `${column.width}%`,
                        height: '100%',
                        display: 'block',
                        textAlign: 'center',
                        alignItems: 'center',
                        float: 'left',
                        lineHeight: `${this._table_header_height}px`,
                    }).InnerHTML(column.name)
                })
            ]),
            document.createElement('div').Style({
                width: '100%',
                height: 'calc(100% - 50px)',
                display: 'block',
            }).SetAttributes({id: 'table-body'})
        ])

        return table
    }

}

window.app = new APP();