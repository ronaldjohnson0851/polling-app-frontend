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

    component



}