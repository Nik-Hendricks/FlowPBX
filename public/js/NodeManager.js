class NodeManager{
    constructor(app){
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

    register_node(props){
        function generic(){
            props.inputs.forEach(input => {
                this.addInput(input.name, input.type);
            });
            props.outputs.forEach(output => {
                this.addOutput(output.name, output.type);
            });
            this.serialize_widgets = true;
            if(props.widgets){
                props.widgets.forEach(widget => {
                    this.addWidget(widget.type, widget.name, widget.value, () => {
                        widget.callback(this);
                    }, widget.options);
                })
            }
            this.properties = { precision: 1 };
        }
        generic.title = props.name;
        LiteGraph.registerNodeType(`${props.nodepath}/${props.name}`, generic);
    }
}




export default NodeManager;