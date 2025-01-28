class NodeManager{
    constructor(){
        this.nodes = {};
    }

    init_litegraph(){
        this.graph = new LiteGraph.LGraph();
        this.canvas_element = document.createElement('canvas').Style({
            position: 'relative',
            width: '100%',
            height: '100%',
        })
        this.canvas = new LiteGraph.LGraphCanvas(this.canvas_element, this.graph);
        this.canvas_element.width = document.querySelector('#app-body').offsetWidth;
        this.canvas_element.height = document.querySelector('#app-body').offsetHeight;
        this.graph.start();
    }

    Node(props){
        this.nodes[props.name] = function () {};
        LiteGraph.registerNodeType(`${props.nodepath}/${props.name}`, this.nodes[props.name]);
        props.inputs.forEach(input => {
            this.nodes[props.name].prototype.addInput(input.name, input.type);
        });
        props.outputs.forEach(output => {
            this.nodes[props.name].prototype.addOutput(output.name, output.type);
        });
        this.nodes[props.name].prototype.onExecute = function(){
            props.onExecute(this);
        }
        this.nodes[props.name].title = props.name;
        this.serialize_widgets = true;
        if(props.widgets){
            props.widgets.forEach(widget => {
                this.nodes[props.name].prototype.addWidget(widget.type, widget.name, widget.value, widget.onWidgetChange, widget.options);
            })
        }
    
    
        console.log(this.nodes)
    }
}


export default NodeManager;