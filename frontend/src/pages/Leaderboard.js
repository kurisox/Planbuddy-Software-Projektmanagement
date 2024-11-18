import CONFIG from '../config';
import Cookies from 'js-cookie';

import React from 'react';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';

class Leaderboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showAlert: false
        };
    }

    componentDidMount() {
        fetch(CONFIG.baseURL + 'user/top/10', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('planbuddy-jwt')
            }
        })
        .then(res => res.json())
        .then(result => this.setState({ data: result }))
        .catch(error => this.setState({ showAlert: true }));
    }

    render() {
        return (
            <div>
                {this.state.showAlert ? <Alert severity="error" variant="filled"
                    onClose={() => this.setState({ showAlert: false })}>Failed to load data</Alert> : <></>}
                <List>
                    {this.state.data.map(user => (
                        <li class="leaderboard-entry">
                            <p>
                                <span class="username">{user.USERNAME}</span>
                                <span class="xp">{user.XP} XP</span>
                            </p>
                        </li>
                    ))}
                </List>
            </div>
        );
    }
}

export default Leaderboard; 