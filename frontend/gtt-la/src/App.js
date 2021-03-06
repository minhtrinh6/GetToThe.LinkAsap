// import logo from './logo.svg';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import React, { Component } from 'react';
import update from 'immutability-helper';
import {compose, withPropsOnChange, withState, withHandlers} from 'recompose';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Container, Button, Row, Col, Card, CardBody, CardHeader, 
  CardTitle, InputGroup, InputGroupAddon, InputGroupText, Input, ListGroup, 
  ListGroupItem, Badge, ListGroupItemHeading, ListGroupItemText, ButtonGroup,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Collapse,
  Form, FormGroup, Label, CustomInput
} 
from 'reactstrap';

import StatePersist from "./StatePersist.js";
import fetch from 'isomorphic-fetch';

import io from 'socket.io-client';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight, faWindowClose } from '@fortawesome/free-solid-svg-icons';

import {Pie} from 'react-chartjs-2';

library.add(faAngleDoubleRight);
library.add(faWindowClose);


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
      <svg id="gtt.la" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" height="56px">
      	<title>Artboard 1</title>
      	<g id="letters">
      		<path id="g" d="M345.2,367.9c15.3-27.9,35.1-48.6,80.1-48.6a26.1,26.1,0,0,1,0,52.2c-27,0-36.9,13.5-43.2,27.9,20.7,25.2,32.4,58.5,32.4,97.2,0,91.8-61.2,151.2-165.6,151.2-38.7,0-72-8.1-97.2-22.5-9.9,8.1-16.2,18-16.2,32.4,0,18.9,12.6,37.8,66.6,37.8h92.7c87.3,0,157.5,37.8,157.5,122.4,0,93.6-84.6,129.6-193.5,129.6-92.7,0-191.7-27-191.7-126,0-41.4,26.1-73.8,68.4-90.9-33.3-10.8-55.8-37.8-55.8-72.9,0-27,14.4-48.6,36-63-21.6-27-32.4-59.4-32.4-98.1,0-91.8,61.2-151.2,165.6-151.2C285.8,345.4,320,353.5,345.2,367.9ZM294.8,749.5H201.2c-52.2,9-75.6,36-75.6,72,0,54.9,63,75.6,134.1,75.6s134.1-20.7,134.1-79.2C393.8,768.4,353.3,749.5,294.8,749.5ZM356,496.6c0-59.4-37.8-99-107.1-99s-107.1,39.6-107.1,99,37.8,99,107.1,99S356,556,356,496.6Z"/>
      		<path id="t1" d="M554,263.5c0-15.3,13.5-28.8,28.8-28.8a29,29,0,0,1,28.8,28.8V358h58.5a27,27,0,0,1,0,54H611.6V660.4c0,38.7,21.6,59.4,52.2,59.4,15.3,0,27.9,11.7,27.9,27s-12.6,27-27.9,27c-71.1,0-109.8-47.7-109.8-113.4V412H518.9a27,27,0,0,1,0-54H554Z"/>
      		<path id="t2" d="M805.1,263.5c0-15.3,13.5-28.8,28.8-28.8a29,29,0,0,1,28.8,28.8V358h58.5a27,27,0,0,1,0,54H862.7V660.4c0,38.7,21.6,59.4,52.2,59.4,15.3,0,27.9,11.7,27.9,27s-12.6,27-27.9,27c-71.1,0-109.8-47.7-109.8-113.4V412H770a27,27,0,0,1,0-54h35.1Z"/>
      		<path id="dot" d="M1004.8,731.5c0-29.7,16.2-43.2,42.3-43.2s42.3,13.5,42.3,43.2-16.2,42.3-42.3,42.3S1004.8,761.2,1004.8,731.5Z"/>
      		<path id="l" d="M1235.2,154.6V668.5c0,36,11.7,51.3,36,51.3a27,27,0,0,1,0,54c-60.3,0-93.6-36-93.6-105.3V154.6c0-15.3,13.5-28.8,28.8-28.8A29,29,0,0,1,1235.2,154.6Z"/>
      		<path id="a" d="M1420.6,445.3c-9,9.9-15.3,12.6-23.4,12.6a26.1,26.1,0,0,1-26.1-26.1,27.9,27.9,0,0,1,4.5-15.3c25.2-39.6,73.8-71.1,149.4-71.1,104.4,0,162,61.2,162,153V745.9a27.9,27.9,0,0,1-55.8,0V713.5c-22.5,42.3-74.7,64.8-128.7,64.8-95.4,0-155.7-45.9-155.7-128.7,0-79.2,60.3-126.9,157.5-126.9h126.9V498.4c0-61.2-40.5-99-106.2-99C1477.3,399.4,1448.5,413.8,1420.6,445.3Zm210.6,165.6V573.1H1504.3c-58.5,0-99,24.3-99,76.5,0,46.8,32.4,76.5,102.6,76.5C1570.9,726.1,1631.2,687.4,1631.2,610.9Z"/>
      	</g>
      	<path id="spaceship" d="M1271.2,719.8c-24.3,0-36-15.3-36-51.3V154.6a29,29,0,0,0-28.8-28.8h-.3a29,29,0,0,0-28.8,28.8V668.5c0,36-11.7,51.3-36,51.3a27,27,0,0,0,0,54c27.5,0,49.3-7.5,65-22.2,15.7,14.7,37.5,22.2,64.9,22.2a27,27,0,0,0,0-54Z"/>
      </svg>
    `;

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
    if (this.isURL(this.props.text) === false) {
      alert("Invalid URL"); // TODO: Make use of better alert system
      return;
    }
    this.props.handleSubmitText();
  }
  
  // https://stackoverflow.com/a/14582229/2900949
  isURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
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
          <Button className="btn-sm" color="primary" style={{'boxShadow': 'none'}} title="1.26996 * 10^25 😲">Enhance it!</Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
    );
  }
}

class AppBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "home",
      stat_id: undefined,
      stat: {},
      initUpdate: true
    }
  }
  
  change_current = (page) => {
    this.setState({current: page});
  }
  
  view_stat = (e) => {
    this.change_current("stat")
    var link_id = e.target.id
    this.setState({stat_id: link_id})
    this.props.ws.emit('subscribe-stat', link_id)
    // console.log(link_id)
  }
  
  // https://stackoverflow.com/a/16348977/2900949
  stringToColour = (str) => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }
  
  componentDidMount() {
    this.props.ws.on('update-stat', (data) => {
      console.log(data);
      var temp = {
        datasets: [{
            data: Object.values(data),
            backgroundColor: Object.keys(data).map(x => this.stringToColour(x))
        }],
    
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: Object.keys(data)
        };
        console.log(temp)
      this.setState({stat: temp})
    })
  }
  
  componentDidUpdate() {
    if (this.state.initUpdate === true && this.props.save.length > 0) {
      this.setState({initUpdate: false})
      this.change_current("links")
    }
  }
  render() {
    return (
      <Card className="text-center shadow-lg bg-light rounded">
        <CardBody>
          <AppBodyTitle current={this.state.current} change_current={this.change_current}/>
          <AppBodyRender current={this.state.current} 
            change_current={this.change_current} save={this.props.save}
            view_stat={this.view_stat} stat={this.state.stat}/>
        </CardBody>
      </Card>
    )

  }
}

const AppBodyTitle = 
  compose(
    withState('isToggle', 'setToggle', false),
    withState('isOpen', 'setOpen', false),
    withPropsOnChange(
      ['current'],
      (props) => ({
        props: props,
    })),
    withHandlers({
      toggle: ({ setToggle }) => () => setToggle(n => !n),
      click: ({ props }) => (e) => props.change_current(e.target.id.replace('btn-', '')),
      open: ({ setOpen }) => () => setOpen(n => !n)
    })
  ) (({props, isToggle, toggle, click, isOpen, open}) => (
      <CardTitle>
          <ButtonGroup className="shadow" style={{ marginBottom: '1rem' }}>
            <Button id="btn-home" color="primary" style={{'boxShadow': 'none'}} onClick={click} 
              active={props.current === "home"}  >Home</Button>
              
            <Button id="btn-links" color="primary" style={{'boxShadow': 'none'}} onClick={click}
              active={props.current === "links"}>Generated Links</Button>
              
            <ButtonDropdown  isOpen={isToggle} toggle={toggle}>
              <DropdownToggle color="success" style={{'boxShadow': 'none'}}
                active={props.current.includes("account") || isOpen} caret>
                Account
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem id="btn-account-login" onClick={open}>Log in</DropdownItem>
                <DropdownItem id="btn-account-signup" onClick={click}>Sign up</DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </ButtonGroup>
          <Collapse isOpen={isOpen}>
            <AppTitleLogIn close={open} signup={click}/>
          </Collapse>
      </CardTitle>
      )
  )

const AppTitleLogIn = (props) => {
  return (
    <Card>
      <CardBody>
      <span className="row justify-content-center">
      <Button onClick={props.close} className="mb-1">
        <FontAwesomeIcon icon="window-close" />
        &nbsp; Close
      </Button>
      <Form className="ml-2 mb-1">
        <FormGroup className="ml-1 mr-1">
          <Label for="exampleEmail" hidden>Email</Label>
          <Input type="email" name="email" id="exampleEmail" placeholder="Email" />
        </FormGroup>

        <FormGroup className="ml-1 mr-1">
          <Label for="examplePassword" hidden>Password</Label>
          <Input type="password" name="password" id="examplePassword" placeholder="Password" />
        </FormGroup>
        
        <CustomInput type="checkbox" id="exampleCustomCheckbox" className="mb-1" label="Remember me" />
        <Button color="primary" className="ml-1 mr-1" disabled>Log in</Button>
        <Button id="btn-account-signup" color="success" className="ml-1 mr-1" onClick={(e) => {props.close(e); props.signup(e);}}>Sign up</Button>
      </Form>
      </span>
      
      </CardBody>
    </Card>
  )
}

const AppBodyRender = (props) => {
    switch (props.current) {
      case "links":
        return (<AppBodyWithList save={props.save} view_stat={props.view_stat}/>)
      case "account-signup":
        return (<AppBodySignUp save={props.save}/>)
      case "stat":
        return (<AppBodyStat stat={props.stat}/>)
      default:
        return (<AppBodyWithoutList />)
    }
}

const AppBodySignUp = (props) => {
  return (
    <Card className="mx-auto">
      <CardHeader><b>Sign up for a new account</b></CardHeader> 
      <CardBody>
      <Form>
        <FormGroup row>
          <Label for="exampleEmail" sm={2}>Email</Label>
          <Col sm={10}>
            <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="examplePassword" sm={2}>Password</Label>
          <Col sm={10}>
            <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
          </Col>
        </FormGroup>
      </Form>
      </CardBody>
    </Card>  
     
  )
}

const AppBodyWithList = 
// compose(
//   withPropsOnChange(
//     ['current'],
//     (props) => ({
//       props: props,
//   })),
//   withHandlers({
//     viewstat: ({ props }) => (e) => {e.preventDefault(); props.view_stat(e.target.id); return true;}
//   })) (({props, viewstat}) => 
  (props) => {
  return (
    <ListGroup>
      <ReactCSSTransitionGroup transitionName="Appbody-list" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
      {props.save.map(item => (
        <ListGroupItem key={item.gLink}>
          <ListGroupItemHeading>
            <a className="float-left" href={"https://gtt.la/" + item.gLink} target="_blank">https://gtt.la/{item.gLink}</a>
            <Badge className="float-right" color="info">{item.view} clicks</Badge>
            <Badge className="float-right" id={item.id} onClick={props.view_stat} style={{"marginRight":"5px"}} color="info" href="#">statistics</Badge>
          </ListGroupItemHeading>
          <br/><ListGroupItemText className="float-left">
            <FontAwesomeIcon icon="angle-double-right" />
            {item.to}
          </ListGroupItemText><br/>
        </ListGroupItem>
      ))}
      </ReactCSSTransitionGroup>
    </ListGroup>
  )
}

const AppBodyWithoutList = () => {
  return (
    <div>
    <CardTitle>Welcome to GetToThe.LinkAsap</CardTitle>
    <CardBody>
      Enhance given URL. The enhanced links are in the format of adjective + animal + verb.<br/>
Utilizing AWS S3, CloudFront, and Lambda to ensures fast and realiable service.
    </CardBody>
    </div>
  )
}
// {props.data !== undefined && (<Pie data={props.data} />)}
const AppBodyStat = (props) => {
    // return (
    //   <Card className="mx-auto">
    //     <CardTitle>Viewing stat</CardTitle>
    //     {props.data !== undefined && console.log(props.data)}
        
    //   </Card>
    // )
    console.log(props.stat)
    if (props.stat !== undefined) {
      console.log('dataaaaaa')
      return (<Pie data={props.stat} />)
    } else {
      return (<Card className="mx-auto"></Card>)
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
