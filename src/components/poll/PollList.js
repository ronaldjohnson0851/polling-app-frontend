import React, { Component } from 'react';
import { getAllPolls } from '../../services/api';
import { Card, List } from 'antd';

class PollList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            polls: [],
            isLoading: true
        };
    }

    componentDidMount() {
        this.loadPolls();
    }

    loadPolls = () => {
        getAllPolls()
        .then(response => {
            this.setState({
                polls: response.content || response,
                isLoading: false
            });
        })
        .catch(error => {
            console.log('Error loading polls:', error);
            this.setState({
                isLoading: false
            });
        });
    }

    render() {
        return (
            <div>
                <h1>Polling App</h1>
                <List
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={this.state.polls}
                    loading={this.state.isLoading}
                    renderItem={poll => (
                        <List.Item>
                            <Card title={poll.question}>
                                {poll.options && poll.options.map(option => (
                                    <p key={option.id}>{option.value}</p>
                                ))}
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}

export default PollList;