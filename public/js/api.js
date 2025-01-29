const api = {
    //props {table: string, query: object}
    get_data: async (props) => {
        return new Promise(resolve => {
            console.log('GET DATA')
            fetch('/api/get', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    table: props.table,
                    query: props.query
                })
            }).then(response => response.json()).then(data => {
                resolve(data);
            });
        })
    },


    //props {table: string, data: object, query: object}
    set_data: async (props) => {
        return new Promise(resolve => {
            console.log('SET DATA')
            fetch('/api/set', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    table: props.table,
                    data: props.data,
                    query: props.query
                })
            }).then(response => response.json()).then(data => {
                resolve(data);
            });
        })
    },

    get_trunk_uacs: async () => {
        return new Promise(resolve => {
            fetch('/pbx/uacs/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json()).then(data => {
                resolve(data);
            });
        })
    },

    get_litegraph_nodes: async () => {
        return new Promise(resolve => {
            fetch('/api/get_litegraph_nodes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json()).then(data => {
                console.log(data)
                resolve(data);
            });
        })
    },
};

export default api;