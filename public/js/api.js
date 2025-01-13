const api = {
    //props {table: string, query: object}
    get_data: async (props) => {
        fetch('/api/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(props)
        })
    },

    DataManager: () => {
        return {
            users: window.app.api.get_data({table: 'users', query: {}}),
            roles: window.app.api.get_data({table: 'roles', query: {}}),
            routes: window.app.api.get_data({table: 'routes', query: {}}),
        }
    }
};

export default api;