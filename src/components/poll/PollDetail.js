import React, { Component } from 'react';
import { getPoll, castVote } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Card, 
    Radio, 
    Button, 
    Space, 
    message, 
    Typography, 
    Spin, 
    Alert,
    Breadcrumb 
} from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function PollDetailWithRouter() {
    const { pollId } = useParams();
    const navigate = useNavigate();
    return <PollDetail pollId={pollId} navigate={navigate} />;
}

class PollDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            poll: null,
            selectedOption: null,
            isLoading: true,
            isVoting: false,
            error: null
        };
    }

    componentDidMount() {
        this.loadPoll();
    }

    loadPoll = () => {
        const { pollId } = this.props;
        
        if (!pollId) {
            this.setState({ 
                error: 'No poll ID provided',
                isLoading: false 
            });
            return;
        }

        this.setState({ isLoading: true, error: null });
        
        getPoll(pollId)
        .then(response => {
            this.setState({
                poll: response,
                isLoading: false
            });
        })
        .catch(error => {
            console.error('Error loading poll:', error);
            this.setState({
                error: 'Failed to load poll. It may not exist or there may be a connection issue.',
                isLoading: false
            });
        });
    }

    handleOptionChange = (e) => {
        this.setState({ selectedOption: e.target.value });
    }

    handleVote = () => {
        const { poll, selectedOption } = this.state;
        
        if (!selectedOption) {
            message.warning('Please select an option before voting!');
            return;
        }

        const voteData = {
            option: { id: selectedOption }
        };

        this.setState({ isVoting: true });

        castVote(poll.id, voteData)
        .then(response => {
            message.success('Vote cast successfully!');
            this.setState({ 
                selectedOption: null,
                isVoting: false 
            });
        })
        .catch(error => {
            console.error('Error casting vote:', error);
            message.error('Failed to cast vote. Please try again.');
            this.setState({ isVoting: false });
        });
    }

    render() {
        const { poll, selectedOption, isLoading, isVoting, error } = this.state;
        const { navigate } = this.props;

        if (isLoading) {
            return (
                <div style={{ 
                    padding: '50px', 
                    textAlign: 'center',
                    minHeight: '100vh',
                    backgroundColor: '#f0f2f5'
                }}>
                    <Spin size="large" />
                    <div style={{ marginTop: '16px' }}>
                        <Text>Loading poll details...</Text>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div style={{ 
                    padding: '24px', 
                    maxWidth: '800px', 
                    margin: '0 auto',
                    backgroundColor: '#f0f2f5',
                    minHeight: '100vh'
                }}>
                    <Breadcrumb style={{ marginBottom: '24px' }}>
                        <Breadcrumb.Item>
                            <Button 
                                type="link" 
                                icon={<HomeOutlined />}
                                onClick={() => navigate('/')}
                            >
                                Home
                            </Button>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Poll Details</Breadcrumb.Item>
                    </Breadcrumb>

                    <Alert
                        message="Error Loading Poll"
                        description={error}
                        type="error"
                        action={
                            <Space>
                                <Button onClick={this.loadPoll}>Retry</Button>
                                <Button onClick={() => navigate('/')}>Go Home</Button>
                            </Space>
                        }
                    />
                </div>
            );
        }

        return (
            <div style={{ 
                padding: '24px', 
                maxWidth: '800px', 
                margin: '0 auto',
                backgroundColor: '#f0f2f5',
                minHeight: '100vh'
            }}>
                {/* Breadcrumb Navigation */}
                <Breadcrumb style={{ marginBottom: '24px' }}>
                    <Breadcrumb.Item>
                        <Button 
                            type="link" 
                            icon={<HomeOutlined />}
                            onClick={() => navigate('/')}
                        >
                            Home
                        </Button>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Poll Details</Breadcrumb.Item>
                </Breadcrumb>

                {/* Back Button */}
                <Button 
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/')}
                    style={{ marginBottom: '16px' }}
                >
                    Back to All Polls
                </Button>

                {/* Poll Card */}
                <Card style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: 'none'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <Title level={2} style={{ color: '#1890ff', margin: '0' }}>
                            📊 {poll.question}
                        </Title>
                        <Text type="secondary">Poll ID: {poll.id}</Text>
                    </div>

                    {poll.options && poll.options.length > 0 ? (
                        <div>
                            <Title level={4} style={{ marginBottom: '16px', color: '#333' }}>
                                Choose your answer:
                            </Title>
                            
                            <Radio.Group 
                                value={selectedOption}
                                onChange={this.handleOptionChange}
                                style={{ width: '100%' }}
                            >
                                <Space direction="vertical" style={{ width: '100%' }} size="large">
                                    {poll.options.map(option => (
                                        <Radio 
                                            key={option.id} 
                                            value={option.id}
                                            style={{ 
                                                fontSize: '18px',
                                                padding: '12px 16px',
                                                borderRadius: '8px',
                                                border: '1px solid #d9d9d9',
                                                display: 'block',
                                                backgroundColor: selectedOption === option.id ? '#e6f7ff' : '#fafafa'
                                            }}
                                        >
                                            {option.value}
                                        </Radio>
                                    ))}
                                </Space>
                            </Radio.Group>
                            
                            <div style={{ marginTop: '32px', textAlign: 'center' }}>
                                <Button 
                                    type="primary"
                                    size="large"
                                    onClick={this.handleVote}
                                    disabled={!selectedOption}
                                    loading={isVoting}
                                    style={{ minWidth: '150px', height: '48px' }}
                                >
                                    🗳️ Cast Your Vote
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Alert
                            message="No Options Available"
                            description="This poll doesn't have any voting options."
                            type="warning"
                            showIcon
                        />
                    )}
                </Card>

                {/* Poll Info */}
                <Card style={{ 
                    marginTop: '16px',
                    backgroundColor: '#f6ffed',
                    border: '1px solid #b7eb8f'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <Text strong style={{ color: '#52c41a' }}>
                            💡 This is a detailed view of poll #{poll.id}
                        </Text>
                        <br />
                        <Text type="secondary">
                            You can vote on this poll and your response will be saved to the database.
                        </Text>
                    </div>
                </Card>
            </div>
        );
    }
}

export default PollDetailWithRouter;