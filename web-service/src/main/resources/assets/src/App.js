import * as React from 'react';
import NavBar from './components/NavBar';
import ChartDisplay from './components/ChartDisplay'
import CssBaseline from '@material-ui/core/CssBaseline';
import Axios from 'axios';

import * as BackGround from "./dot-grid.png";
import { registerWebSocket, sendGithubAnalysisRequest } from './api';

class App extends React.Component {
    /**
     * @param {any} props
     */
    constructor(props) {
        super(props);

        this.state = {
            data: undefined,
            user: {
                name: "",
                avatar_url: "",
                bio: ""
            }
        }
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        registerWebSocket(this.handleDataUpdate.bind(this));
    }


    /**
     * @param {string} username
     */
    handleSearch(username) {
        sendGithubAnalysisRequest(username);
        Axios.get(`https://api.github.com/users/${username}`)
            .then((response) => {
                this.setState({ user: { name: response.data.name, avatar_url: response.data.avatar_url, bio: response.data.bio } });
            })
    }

    /**
     * @param {any} newData
     */
    handleDataUpdate(newData) {
        this.setState({
            data: newData,
        });
    }

    render() {
        return (
            <div style={{ background: BackGround, backgroundRepeat: "repeat" }}>
                <CssBaseline />
                <NavBar />
                <ChartDisplay data={this.state.data} handleSearch={this.handleSearch} user={this.state.user} />
            </div>
        )
    }
}

export default App;
