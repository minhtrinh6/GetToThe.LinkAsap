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
      save: (value) => value.forEach((v, k, m) => this.state.ws.emit('subscribe', v.id))
    };
  }

    handleInputText = (newText) => {
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
    var logo = `
<svg id="Layer_1" data-name="gtt.la" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 300" height="56px">
	<title>gtt.la</title>
	<path class="lcap lGetG" d="M208.1,218.2a149,149,0,0,1-49.7,8.9c-24.4,0-44.6-6.2-60.4-21.3-14-13.5-22.6-35.1-22.6-60.3C75.6,97.3,108.8,62,163,62c18.7,0,33.4,4.1,40.3,7.4l-5,17.1c-8.7-3.9-19.5-7-35.8-7-39.3,0-65,24.5-65,65.1s24.7,65.2,62.4,65.2c13.7,0,23-1.9,27.8-4.3V157.3H154.8V140.5h53.3Z"/>
	<path class="lnom lGete" d="M252.3,171.2c.5,28.6,18.7,40.3,39.8,40.3,15.1,0,24.3-2.6,32.2-6l3.6,15.1c-7.5,3.4-20.2,7.2-38.7,7.2-35.7,0-57.1-23.5-57.1-58.5s20.7-62.7,54.5-62.7c37.9,0,48,33.4,48,54.8a89.9,89.9,0,0,1-.7,9.8Zm61.9-15.1c.2-13.5-5.5-34.4-29.3-34.4-21.3,0-30.7,19.7-32.4,34.4Z"/>
	<path class="lnom lGett" d="M386.2,75.9v33.4h30.2v16H386.2V188c0,14.4,4.1,22.6,15.8,22.6a47.7,47.7,0,0,0,12.3-1.5l.9,15.9c-4,1.6-10.5,2.8-18.7,2.8-9.8,0-17.7-3.1-22.8-8.8s-8.1-16.6-8.1-30.3V125.3h-18v-16h18V81.4Z"/>
	<path class="lcap lToT" d="M471.6,81.4H422.4V63.7H542.2V81.4H492.8v144H471.6Z"/>
	<path class="lnom lToo" d="M647.6,166.4c0,43-29.8,61.7-57.9,61.7-31.4,0-55.7-23.1-55.7-59.8,0-38.9,25.5-61.7,57.6-61.7S647.6,130.9,647.6,166.4Zm-92.2,1.2c0,25.4,14.6,44.6,35.3,44.6S626,193.3,626,167.1c0-19.7-9.9-44.6-34.8-44.6S555.4,145.5,555.4,167.6Z"/>
	<path class="lcap lTheT" d="M696,81.4H646.8V63.7H766.6V81.4H717.2v144H696Z"/>
	<path class="lnom lTheh" d="M782.2,55h21.1v72.5h.5a39.3,39.3,0,0,1,15.1-14.9,43.7,43.7,0,0,1,21.6-6c15.6,0,40.6,9.6,40.6,49.7v69.1H860V158.7c0-18.7-7-34.6-26.9-34.6-13.7,0-24.5,9.7-28.3,21.2-1.2,2.9-1.5,6-1.5,10.1v70H782.2Z"/>
	<path class="lnom Thee" d="M927.1,171.2c.5,28.6,18.8,40.3,39.9,40.3,15.1,0,24.2-2.6,32.2-6l3.6,15.1c-7.5,3.4-20.2,7.2-38.7,7.2-35.8,0-57.1-23.5-57.1-58.5s20.6-62.7,54.5-62.7c37.9,0,48,33.4,48,54.8a89.9,89.9,0,0,1-.7,9.8Zm62-15.1c.2-13.5-5.5-34.4-29.3-34.4-21.4,0-30.7,19.7-32.4,34.4Z"/>
	<path class="lcap lLinkL" d="M1036.3,63.7h20.9V207.9h69.1v17.5h-90Z"/>
	<path class="lnom lLinki" d="M1172.4,76.6c.3,7.2-5,13-13.4,13s-12.7-5.8-12.7-13a12.9,12.9,0,0,1,13.2-13.2C1167.4,63.4,1172.4,69.2,1172.4,76.6Zm-23.5,148.8V109.3H1170V225.4Z"/>
	<path class="lnom lLinkn" d="M1205.1,140.7c0-12-.3-21.8-1-31.4h18.7l1.2,19.2h.5c5.8-11.1,19.2-21.9,38.4-21.9,16.1,0,41,9.6,41,49.5v69.3h-21.1V158.5c0-18.7-6.9-34.4-26.9-34.4-13.9,0-24.7,9.9-28.3,21.7a31.7,31.7,0,0,0-1.4,9.8v69.8h-21.1Z"/>
	<path class="lnom lLinkk" d="M1359.1,162.6h.5c2.9-4.1,7-9.2,10.3-13.2l34.1-40.1h25.5L1384.6,157l51.1,68.4H1410l-40.1-55.6-10.8,12v43.6h-20.8V55h20.8Z"/>
	<path class="ldot" d="M1449.1,213c0-8.9,6-15.2,14.4-15.2s14.2,6.3,14.2,15.2-5.5,15.1-14.4,15.1S1449.1,221.6,1449.1,213Z"/>
	<path class="lcap lAsapA" d="M1530.7,174.6l-16.8,50.8h-21.6l55-161.7h25.2l55.2,161.7h-22.3l-17.3-50.8Zm53.1-16.4-15.9-46.5c-3.6-10.6-6-20.2-8.4-29.6h-.4c-2.4,9.6-5.1,19.5-8.2,29.3l-15.8,46.8Z"/>
	<path class="lnom lAsaps" d="M1646.4,203.8c6.3,4.1,17.3,8.4,27.9,8.4,15.3,0,22.5-7.6,22.5-17.2s-6-15.6-21.6-21.4c-20.9-7.4-30.7-19-30.7-32.9,0-18.7,15.1-34.1,40.1-34.1,11.7,0,22.1,3.4,28.5,7.2l-5.2,15.4a45.3,45.3,0,0,0-23.8-6.7c-12.5,0-19.4,7.2-19.4,15.8s6.9,13.9,22,19.7c20.2,7.7,30.5,17.8,30.5,35,0,20.4-15.8,34.8-43.4,34.8-12.7,0-24.5-3.1-32.7-7.9Z"/>
	<path class="lnom lAsapa" d="M1808.7,225.4l-1.7-14.6h-.7c-6.5,9.1-19,17.3-35.6,17.3-23.5,0-35.5-16.6-35.5-33.4,0-28.1,25-43.4,69.9-43.2v-2.4c0-9.6-2.7-26.9-26.4-26.9a58.1,58.1,0,0,0-30.3,8.7l-4.8-14c9.6-6.2,23.5-10.3,38.2-10.3,35.5,0,44.1,24.3,44.1,47.6v43.4c0,10.1.5,19.9,2,27.8Zm-3.2-59.2c-23-.5-49.2,3.6-49.2,26.1,0,13.7,9.2,20.2,20,20.2,15.1,0,24.7-9.6,28-19.5a19.3,19.3,0,0,0,1.2-6.7Z"/>
	<path class="lnom lAsapp" d="M1860,147.2c0-14.9-.5-26.9-.9-37.9H1878l1,19.9h.5c8.6-14.2,22.3-22.6,41.2-22.6,28.1,0,49.2,23.8,49.2,59.1,0,41.7-25.4,62.4-52.8,62.4-15.3,0-28.8-6.7-35.7-18.3h-.5V273H1860Zm20.9,31a45.1,45.1,0,0,0,1,8.6,32.5,32.5,0,0,0,31.6,24.7c22.4,0,35.3-18.2,35.3-44.9,0-23.2-12.2-43.2-34.5-43.2-14.4,0-27.9,10.4-32,26.2a35.1,35.1,0,0,0-1.4,8.6Z"/>
</svg>
    `

    return (
    <Container>
    <StatePersist parent={this} hydrateCallback={this.hydrateCallback}/>
      <Row>
        <Col className="App-top-buffer">
          <span className="logo" dangerouslySetInnerHTML={{ __html: logo }} />
        </Col>
      </Row>
      <Row className="App-row-bottom-margin">
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
          <Button className="btn-sm" color="primary" style={{'boxShadow': 'none'}} title="1.26996 * 10^25 😲">Shorten it!</Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
    );
  }
}

class AppBody extends Component {
  render() {
    if (this.props.save.length !== 0)
      return (<AppBodyWithList save={this.props.save}/>)
    else
      return (<AppBodyWithoutList />)
  }
}

const AppBodyWithList = (props) => {
  return (
    <Card className="text-center shadow-lg bg-light rounded">
      <CardBody>
        <CardTitle>Generated Links</CardTitle>
        <ListGroup>
          <ReactCSSTransitionGroup transitionName="Appbody-list" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
          {props.save.map(item => (
            <ListGroupItem key={item.gLink}>
              <ListGroupItemHeading>
                <a className="float-left" href={"https://gtt.la/" + item.gLink} target="_blank">https://gtt.la/{item.gLink}</a>
                <Badge className="float-right" color="info">{item.view} clicks</Badge>
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
  )
}

const AppBodyWithoutList = () => {
  return (
    <Card className="text-center shadow-lg bg-light rounded">
      <CardBody>
        <CardTitle>Welcome to GetToThe.LinkAsap</CardTitle>
      </CardBody>
    </Card>
  )
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
