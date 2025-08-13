import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import PollList from './components/poll/PollList';
import NewPoll from './components/poll/NewPoll';
import PollDetail from './components/poll/PollDetail';

const { Content } = Layout;

class App extends Component {
  render() {
    return (
      <Router>
        <Layout className="app-container">
          <Content className="app-content">
            <div className="container">
              <Routes>
                <Route path="/" element={<PollList />} />
                <Route path="/poll/new" element={<NewPoll />} />
                <Route path="/poll/:pollId" element={<PollDetail />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Router>
    );
  }
}

export default App;