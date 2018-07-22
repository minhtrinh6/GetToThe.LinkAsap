// import logo from './logo.svg';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import React, { Component } from 'react';
import update from 'immutability-helper';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Container, Button, Row, Col, Card, CardBody,
  CardTitle, InputGroup, InputGroupAddon, InputGroupText, Input, ListGroup, 
  ListGroupItem, Badge, ListGroupItemHeading, ListGroupItemText} 
from 'reactstrap';

import StatePersist from "./StatePersist.js";
import fetch from 'isomorphic-fetch';

import io from 'socket.io-client';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

library.add(faAngleDoubleRight);


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      save: new Map(),
      ws: io('l.gtt.la', {path: '/ws/', transports: ['websocket', 'polling', 'flashsocket']})
    };
    
    this.hydrateCallback = {
      save: (value) => Array.from(value.values()).forEach((item) => this.state.ws.emit('subscribe', item.id))
    };
  }

    handleInputText = (newText) => {
      // this.setState({save: new Map()});
      this.setState({text: newText});
  }
  
  handleSubmitText = () => {
    fetch('https://b7yg46eoyd.execute-api.us-east-1.amazonaws.com/dev/hello', {
      method: 'POST',
      body: this.state.text
    })
    .then((resp) => resp.json())
    .then((resp) => {
      var datum = {
        id: resp.url.toLowerCase(),
        gLink: resp.url, 
        to: this.state.text, 
        view: 0,
      };
      
      this.state.ws.emit('subscribe', datum.id);
      this.setState(prevState => ({
        text: '',
        save: prevState.save.set(datum.id, datum)
      }));
    })
    .catch((error) => {
      console.error(error);
    });
    
  }
    
  componentDidMount() {
    this.state.ws.on('update', (data) => {
      var count = (data.count == null) ? 0 : data.count;
      this.setState({
        save: update(this.state.save, {[data.link]: {view: {$set: count}}})
      });
    });
  }
  
  render() {

    return (
    <Container>
    <StatePersist parent={this} hydrateCallback={this.hydrateCallback}/>
      <Row className="App-top-buffer App-row-bottom-margin">
        <Col>
          <AppHead handleInputText={this.handleInputText} handleSubmitText={this.handleSubmitText} text={this.state.text}/>
        </Col>
      </Row>
      <Row className="App-row-bottom-margin">
        <Col>
          <AppBody save={Array.from(this.state.save.values()).reverse()} ws={this.state.ws}/>
        </Col>
      </Row>
      <Row className="App-row-bottom-margin">
        <Col>
          <AppFoot />
        </Col>
      </Row>
    </Container>
    );
  }
}

class AppHead extends React.Component {
  handleChange = (e) => {
    this.props.handleInputText(e.target.value);
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.handleSubmitText();
  }

  render() {
    return (
    <form onSubmit={this.handleSubmit}>
      <InputGroup className="input-group-lg shadow rounded" onSubmit={this.handleSubmit}>
        <InputGroupAddon addonType="prepend">
          <InputGroupText className="bg-light border"><FontAwesomeIcon icon="angle-double-right" /></InputGroupText>
        </InputGroupAddon>
        <Input className="form-control bg-light py-2 border-left-0 border" placeholder="put long url here" style={{'boxShadow': 'none'}} onChange={this.handleChange} value={this.props.text}/>
        <InputGroupAddon addonType="append">
          <Button className="btn-sm" color="primary" style={{'boxShadow': 'none'}}>Shorten it</Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
    );
  }
}

class AppBody extends Component {
  render() {
    if (this.props.save.length !== 0) {
      return (
      <Card className="text-center shadow-lg bg-light rounded">
        <CardBody>
          <CardTitle>Generated Links</CardTitle>
          <ListGroup>
            <ReactCSSTransitionGroup transitionName="Appbody-list" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
            {this.props.save.map(item => (
              <ListGroupItem key={item.gLink}>
                <ListGroupItemHeading>
                  <a className="float-left" href={"https://gtt.la/" + item.gLink} target="_blank">&nbsp;https://gtt.la/{item.gLink}</a>
                  <Badge className="float-right" color="primary">{item.view} clicks</Badge>
                </ListGroupItemHeading>
                <br/><ListGroupItemText className="float-left">
                  <FontAwesomeIcon icon="angle-double-right" />
                  {item.to}
                </ListGroupItemText><br/>
              </ListGroupItem>
            ))}
            </ReactCSSTransitionGroup>
          </ListGroup>
        </CardBody>
      </Card>
      )}
    else {
      return (
        <Card className="text-center shadow-lg bg-light rounded">
          <CardBody>
            <CardTitle>Welcome to GetToThe.LinkAsap</CardTitle>
          </CardBody>
        </Card>
        )}
  }
}

class AppFoot extends Component {
  render() {
    return (
      <div>
        <center>Made by <a href="https://trihoang.net" target="_blank" rel="noopener noreferrer">Tri Hoang</a></center>
      </div>
    );
  }
}
export default App;
