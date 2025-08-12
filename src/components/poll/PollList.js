import React, { Component } from 'react';
import { getAllPolls, castVote } from '../../services/api';
import { Card, List, Button, Radio, message, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

function PollListWithNavigation(){
    const navigate = useNavigate();
    return <PollList navigate={navigate} />
}

class PollList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            polls: [],
            isLoading: true,
            selectedOptions: {}
        };
    }

    componentDidMount() {
        this.loadPolls();
    }

    loadPolls = () => {
        this.setState({ isLoading: true });
        getAllPolls()
        .then(response => {
            console.log('Polls loaded:', response);
            const polls = response.content || response || [];
            this.setState({
                polls: polls,
                isLoading: false
            });
        })
        .catch(error => {
            console.error('Error loading polls:', error);
            message.error('Sorry! Something went wrong. Please make sure your backend is running on port 8080!');
            this.setState({
                polls: [],
                isLoading: false
            });
        });
    }

    handleVote = (pollId) => {
        const selectedOptionId = this.state.selectedOptions[pollId];

        if (!selectedOptionId) {
            message.warning('Please select an option before voting.');
            return;
        }

        const voteData = {
            option: {id: selectedOptionId}
        };
        castVote(pollId, voteData)
        .then(response => {
            message.success('Your vote has been recorded!');
            this.setState(prevState => ({
                selectedOptions: {
                    ...prevState.selectedOptions,
                    [pollId]: undefined
                }
            }));
        })
        .catch(error => {
            console.error('Error casting vote:', error);
            message.error('Failed tp cast vpte. Please try again!');
        });
    }


    render() {
        const { polls, isLoading, selectedOptions } = this.state;

        return (
            <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
                <div style={{ marginBottom: '24px', textAlign: 'center', backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <h1 style={{ color: '#1890ff', fontSize: '2.5em', margin: '0 0 16px 0' }}>🗳️ Polling App</h1>
                    <p style={{ color: '#666', fontSize: '16px' }}>Vote on the polls below and see what others think!</p>
                    <Space size="large">
                        <Button 
                            type="primary" 
                            size="large" 
                            onClick={() => this.props.navigate('/poll/new')}
                        >
                            ➕ Create New Poll
                        </Button>
                        <Button type="default" size="large" onClick={this.loadPolls}>
                            🔄 Refresh Polls
                        </Button>
                    </Space>
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '8px' }}>
                        <h3>Loading polls...</h3>
                    </div>
                ) : polls.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '8px' }}>
                        <h3>No polls available</h3>
                        <p>Create some polls using your Spring Boot backend!</p>
                    </div>
                ) : (
                    <List
                        grid={{ gutter: 16, column: 1 }}
                        dataSource={polls}
                        renderItem={poll => (
                            <List.Item>
                                <Card 
                                    title={
                                        <div style={{ fontSize: '18px', color: '#1890ff' }}>
                                            📊 {poll.question}
                                        </div>
                                    }
                                    extra={<span style={{ color: '#999' }}>ID: {poll.id}</span>}
                                    style={{ 
                                        marginBottom: '16px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        border: 'none'
                                    }}
                                    hoverable
                                >
                                    {poll.options && poll.options.length > 0 ? (
                                        <div>
                                            <h4 style={{ marginBottom: '16px', color: '#333' }}>Choose your option:</h4>
                                            <Radio.Group 
                                                value={selectedOptions[poll.id]}
                                                onChange={(e) => this.handleOptionChange(poll.id, e.target.value)}
                                                style={{ width: '100%' }}
                                            >
                                                <Space direction="vertical" style={{ width: '100%' }}>
                                                    {poll.options.map(option => (
                                                        <Radio 
                                                            key={option.id} 
                                                            value={option.id}
                                                            style={{ 
                                                                fontSize: '16px',
                                                                padding: '8px',
                                                                borderRadius: '4px',
                                                                display: 'block'
                                                            }}
                                                        >
                                                            {option.value}
                                                        </Radio>
                                                    ))}
                                                </Space>
                                            </Radio.Group>
                                            
                                            <div style={{ marginTop: '16px', textAlign: 'center' }}>
                                                <Button 
                                                    type="primary"
                                                    size="large"
                                                    onClick={() => this.handleVote(poll.id)}
                                                    disabled={!selectedOptions[poll.id]}
                                                    style={{ minWidth: '120px' }}
                                                >
                                                    🗳️ Cast Vote
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p style={{ textAlign: 'center', color: '#999' }}>No options available for this poll</p>
                                    )}
                                </Card>
                            </List.Item>
                        )}
                    />
                )}

                <div style={{ 
                    marginTop: '24px', 
                    padding: '16px', 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    <div style={{ color: '#666', fontSize: '14px' }}>
                        <strong>🔗 Backend Connection:</strong> http://localhost:8080
                        <br />
                        <small>✅ Successfully loaded {polls.length} polls from your Spring Boot API</small>
                    </div>
                </div>
            </div>
        );
    }
}

export default PollListWithNavigation;