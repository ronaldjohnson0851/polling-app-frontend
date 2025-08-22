import React, { Component } from "react";
import { createPoll } from "../../services/api";
import { Form, Input, Button, Space, message, Typography, Card } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { TextArea } = Input;

// Wrapper component to use navigation hook
function NewPollWithNavigation() {
    const navigate = useNavigate();
    return <NewPoll navigate={navigate} />;
}

class NewPoll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            options: ['', ''],
            isSubmitting: false
        };
    }

    handleQuestionChange = (e) => {
        this.setState({ question: e.target.value });
    }

    handleOptionChange = (index, value) => {
        const newOptions = [...this.state.options];
        newOptions[index] = value;
        this.setState({ options: newOptions });
    }

    addOption = () => {
        if (this.state.options.length < 6) {
            this.setState({
                options: [...this.state.options, ''],
            });
        } else {
            message.warning('You can only add up to 6 options.');
        }
    }

    removeOption = (index) => {
        if (this.state.options.length > 2) {
            const newOptions = this.state.options.filter((_, i) => i !== index);
            this.setState({ options: newOptions });
        } else {
            message.warning('A poll must have at least 2 options.');
        }
    }

    handleSubmit = () => {
        const { question, options } = this.state;

        if (!question.trim()) {
            message.error('Poll question cannot be empty.');
            return;
        }

        const validOptions = options.filter(option => option.trim() !== '');
        if (validOptions.length < 2) {
            message.error('A poll must have at least 2 valid options.');
            return;
        }

        const pollData = {
            question: question.trim(),
            options: validOptions.map(value => ({ value: value.trim() }))
        };

        this.setState({ isSubmitting: true });

        createPoll(pollData)
            .then(response => {
                message.success('Poll created successfully! Redirecting to home page...');
                this.setState({
                    question: '',
                    options: ['', ''],
                    isSubmitting: false
                });

                // Navigate back to home page after successful creation
                setTimeout(() => {
                    this.props.navigate('/');
                }, 1500); // Small delay to show success message

                if (this.props.onPollCreated) {
                    this.props.onPollCreated();
                }
            })
            .catch(error => {
                console.error('Error creating poll:', error);
                message.error('Failed to create poll. Please try again.');
                this.setState({ isSubmitting: false });
            });
    }

    render() {
        const { question, options, isSubmitting } = this.state;

        return (
            <div className="slide-up" style={{ 
                padding: '24px', 
                maxWidth: '800px', 
                margin: '0 auto',
                minHeight: '100vh'
            }}>
                <Card>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
                        📝 Create New Poll
                    </Title>

                    <Form layout="vertical">
                        {/* Question Input */}
                        <Form.Item 
                            label="Poll Question" 
                            required
                            style={{ marginBottom: '24px' }}
                        >
                            <TextArea
                                value={question}
                                onChange={this.handleQuestionChange}
                                placeholder="Enter your poll question (e.g., What's your favorite programming language?)"
                                rows={3}
                                maxLength={140}
                                showCount
                                style={{ fontSize: '16px' }}
                            />
                        </Form.Item>

                        {/* Options */}
                        <Form.Item label="Poll Options" required>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {options.map((option, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Input
                                            value={option}
                                            onChange={(e) => this.handleOptionChange(index, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                            maxLength={40}
                                            style={{ flex: 1 }}
                                        />
                                        {options.length > 2 && (
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => this.removeOption(index)}
                                                style={{ flexShrink: 0 }}
                                            />
                                        )}
                                    </div>
                                ))}
                                
                                {options.length < 6 && (
                                    <Button
                                        type="dashed"
                                        onClick={this.addOption}
                                        icon={<PlusOutlined />}
                                        style={{ width: '100%', marginTop: '8px' }}
                                    >
                                        Add Option
                                    </Button>
                                )}
                            </Space>
                        </Form.Item>

                        {/* Submit Button */}
                        <Form.Item style={{ textAlign: 'center', marginTop: '32px' }}>
                            <Space size="large">
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={this.handleSubmit}
                                    loading={isSubmitting}
                                    style={{ minWidth: '140px', height: '48px' }}
                                >
                                    🗳️ Create Poll
                                </Button>
                                <Button
                                    size="large"
                                    onClick={() => this.props.navigate('/')}
                                    style={{ minWidth: '120px', height: '48px' }}
                                >
                                    🏠 Back to Home
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>

                    {/* Instructions */}
                    <div style={{ 
                        marginTop: '24px', 
                        padding: '16px', 
                        background: 'rgba(102, 126, 234, 0.1)',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        borderRadius: '16px'
                    }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#667eea' }}>💡 Tips:</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
                            <li>Keep your question clear and concise</li>
                            <li>Provide at least 2 options, maximum 6</li>
                            <li>Each option should be unique and meaningful</li>
                            <li>Your poll will be immediately available for voting</li>
                            <li>You'll be redirected to the home page after creation</li>
                        </ul>
                    </div>
                </Card>
            </div>
        );
    }
}

export default NewPollWithNavigation;