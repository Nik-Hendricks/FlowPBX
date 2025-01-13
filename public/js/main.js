import api from './api.js';


class APP{
    constructor(){
        this.api = api;
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
        })
    }

    update(){
        this.content.InnerHTML('').Append([
            this.AppHeader(),
            this.AppBody()
        ])
    }

    AppHeader(){
        let header = document.createElement('div')
        header.SetAttributes({
            id: 'app-header'
        })
        header.Style({
            width: '100%',
            height: '65px',
            backgroundColor: 'black',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        })
        header.InnerHTML('VOIP')
        return header
    }

    AppBody(){
        let body = document.createElement('div')
        body.SetAttributes({
            id: 'app-body'
        })
        body.Style({
            width: '100%',
            height: 'calc(100% - 100px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        })
        //body.Append([
        //    this.LoginForm()
        //])
        return body
    }

}

window.APP = new APP();