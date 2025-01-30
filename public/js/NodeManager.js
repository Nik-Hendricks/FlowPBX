class NodeManager{
    constructor(app){
        this.nodes = {};
        this.init_widget_actions();
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
        let nm = this;
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
                        nm.widget_actions[widget.widget_action.name]({node: this, ...widget.widget_action.data});
                    }, widget.options);
                })
            }
            this.properties = { precision: 1 };
        }
        generic.title = props.name;
        LiteGraph.registerNodeType(`${props.nodepath}/${props.name}`, generic);
    }

    init_widget_actions(){
        this.widget_actions = {
            'add_input': (props) => {
                props.node.addInput(props.name, props.data_type);
            },
        }
    }
}




export default NodeManager;