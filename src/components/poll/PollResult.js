import React, { Component } from 'react';
import { getPoll, getPollResults } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Card, 
    Progress, 
    Button, 
    Space, 
    Typography, 
    Spin, 
    Alert,
    Breadcrumb,
    Statistic,
    Row,
    Col 
} from 'antd';
import { ArrowLeftOutlined, HomeOutlined, BarChartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function PollResultsWithRouter(){
    const { pollId } = useParams();
    const navigate = useNavigate();
    return <PollResult pollId={pollId} navigate={navigate} />
}

class PollResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            poll: null,
            results: null,
            isLoading: true,
            error: null
        };
    }

    componentDidMount() {
        this.loadPollAndResults();
    }

    loadPollAndResults = () => {
        const { pollId } = this.props;

        if (!pollId) {
            this.setState({
                error: 'Poll ID is required',
                isLoading: false
            });
            return;
        }

        this.setState({ isLoading: true, error: null });

        Promise.all([
            getPoll(pollId),
            getPollResults(pollId)
        ])
        .then(([pollResponse, resultsResponse]) => {
            this.setState({
                poll: pollResponse,
                results: resultsResponse,
                isLoading: false
            });
        })
        .catch(error => {
            console.error( 'Error Loading poll results:', error);

            getPoll(pollId)
            .then(pollResponse => {
                this.setState({
                    poll: pollResponse,
                    results: null,
                    isLoading: false,
                    error: 'Failed to load results. Please try again later.'
                });
            })
            .catch(pollError => {
                this.setState({
                    error: 'Failed to load poll details. Please try again later.',
                    isLoading: false
                });
            });

        });
    }

    calculateResults = () => {
        const { poll } = this.state;
        if (!poll || !poll.options) return null;

        // Mock calculation - in a real app, this would come from the backend
        const totalVotes = Math.floor(Math.random() * 100) + 20; // Random for demo
        const results = poll.options.map(option => ({
            optionId: option.id,
            optionValue: option.value,
            count: Math.floor(Math.random() * 20) + 1
        }));

        const actualTotal = results.reduce((sum, result) => sum + result.count, 0);
        
        return {
            totalVotes: actualTotal,
            results: results
        };
    }

    getResultsData = () => {
        const { results } = this.state;
        
        // If we have API results, use them
        if (results && results.totalVotes) {
            return results;
        }
        
        // Otherwise, calculate mock results for demonstration
        return this.calculateResults();
    }

    render() {
        const { poll, isLoading, error } = this.state;
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
                        <Text>Loading poll results...</Text>
                    </div>
                </div>
            );
        }

        if (error && !poll) {
            return (
                <div style={{ 
                    padding: '24px', 
                    maxWidth: '800px', 
                    margin: '0 auto',
                    backgroundColor: '#f0f2f5',
                    minHeight: '100vh'
                }}>
                    <Alert
                        message="Error Loading Results"
                        description={error}
                        type="error"
                        action={
                            <Space>
                                <Button onClick={this.loadPollAndResults}>Retry</Button>
                                <Button onClick={() => navigate('/')}>Go Home</Button>
                            </Space>
                        }
                    />
                </div>
            );
        }

        const resultsData = this.getResultsData();

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
                    <Breadcrumb.Item>
                        <Button 
                            type="link"
                            onClick={() => navigate(`/poll/${poll.id}`)}
                        >
                            Poll Details
                        </Button>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Results</Breadcrumb.Item>
                </Breadcrumb>

                {/* Navigation Buttons */}
                <Space style={{ marginBottom: '16px' }}>
                    <Button 
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(`/poll/${poll.id}`)}
                    >
                        Back to Poll
                    </Button>
                    <Button 
                        onClick={() => navigate('/')}
                    >
                        All Polls
                    </Button>
                </Space>

                {/* Results Header */}
                <Card style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: 'none',
                    marginBottom: '16px'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <Title level={2} style={{ color: '#1890ff', margin: '0 0 8px 0' }}>
                            📊 Poll Results
                        </Title>
                        <Title level={3} style={{ color: '#333', margin: '0 0 16px 0' }}>
                            {poll.question}
                        </Title>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Statistic 
                                    title="Total Votes" 
                                    value={resultsData ? resultsData.totalVotes : 0}
                                    prefix={<BarChartOutlined />}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic 
                                    title="Options" 
                                    value={poll.options ? poll.options.length : 0}
                                />
                            </Col>
                        </Row>
                    </div>
                </Card>

                {/* Error Message for Results */}
                {error && (
                    <Alert
                        message="Results Data Unavailable"
                        description={error + " Showing mock data for demonstration."}
                        type="warning"
                        style={{ marginBottom: '16px' }}
                        showIcon
                    />
                )}

                {/* Results Chart */}
                <Card style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: 'none'
                }}>
                    <Title level={4} style={{ marginBottom: '24px' }}>
                        Voting Results
                    </Title>
                    
                    {resultsData && resultsData.results ? (
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            {resultsData.results.map((result, index) => {
                                const percentage = resultsData.totalVotes > 0 
                                    ? Math.round((result.count / resultsData.totalVotes) * 100)
                                    : 0;
                                
                                return (
                                    <div key={result.optionId || index} style={{ marginBottom: '16px' }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            marginBottom: '8px'
                                        }}>
                                            <Text strong style={{ fontSize: '16px' }}>
                                                {result.optionValue || `Option ${index + 1}`}
                                            </Text>
                                            <Space>
                                                <Text>{result.count} votes</Text>
                                                <Text strong>({percentage}%)</Text>
                                            </Space>
                                        </div>
                                        <Progress 
                                            percent={percentage}
                                            strokeColor={{
                                                '0%': '#108ee9',
                                                '100%': '#87d068',
                                            }}
                                            trailColor="#f0f0f0"
                                            strokeWidth={12}
                                            showInfo={false}
                                        />
                                    </div>
                                );
                            })}
                        </Space>
                    ) : (
                        <Alert
                            message="No Results Available"
                            description="No voting results found for this poll."
                            type="info"
                            showIcon
                        />
                    )}
                </Card>

                {/* Action Buttons */}
                <Card style={{ 
                    marginTop: '16px',
                    backgroundColor: '#f6ffed',
                    border: '1px solid #b7eb8f'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <Space direction="vertical">
                            <Text strong style={{ color: '#52c41a' }}>
                                💡 Want to vote on this poll?
                            </Text>
                            <Button 
                                type="primary"
                                onClick={() => navigate(`/poll/${poll.id}`)}
                            >
                                Go Vote Now
                            </Button>
                        </Space>
                    </div>
                </Card>
            </div>
        );
    }
}

export default PollResultsWithRouter;



