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
    var logo = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="320" height="40" viewBox="0 0 1920 1080">
  <metadata>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c140 79.160451, 2017/05/06-01:08:21        ">
   <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <rdf:Description rdf:about=""/>
   </rdf:RDF>
</x:xmpmeta>
                                                                                                    </metadata>
<image id="gtt.la" class="gttla" x="755" y="331" width="365" height="141" xlink:href="data:img/png;base64,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"/>
  <image id="l_letter" x="994" y="320" width="43" height="119" xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAB3CAQAAAAwGHHHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAPYQAAD2EAdWsr3QAAAAHdElNRQfiBxcTEhJ9m7+tAAADU0lEQVRo3rXavU8UQRjH8e/toYgKGPEFfItREaLGE4JoTCwsiP+JpS2NrSGxs7ex9R/QwsqK2xPBCIhiMGLEXCBBwQMJL2eBCrd7u/t79mWuuZmdfPJkZmdndmZBT+1Uxd+QY2BvyDVdC9sv1yxmwc4xp7M5rquxgs520SrWdC2sGiuULKx6H1Rt0aodNsWyzjZSEGu6oLMF9mbB6h1mYm+K9dZ4m0W0Y6zrbCtdliZQWcNDJhs2k2gX+ZQFW6Kqs6dpl1l0Vp9shi2s6ZGos2rLzlLW2Tx9Iuvu/I1muzmYBat3WNHCqi27xUgW7CQVnW3iqr0Jotke8iLr7s5EsYblnIVVW3aVcQurDtxRNnS2jfMiO1ybDWf1WaFUm02LdWuz6bALzGTBlrwFYew5jsRrgnDWvDrQ2BiTjcKqy7kZFnS2gZ64sYaxV2gS2aK/KJiNPRTSYTd5Y2HVJ+07VnX2AJfiN0Ew2ycv/01sghGWBlvhfRbsCJs6286ZJE0QxCZ4yISxsZZz6UVbZlZnc/EnmzC2k0MiOxx0oR6buMPqs+qsYGTVaKdZ1Nk98mTjBl/ys9fkXZli8CU/m0KH1WPVEbbBqIVVh8IYazrbYt2V0dh+clmwxm00PVotLfPBwqr3gcuWzp6kQ2RL4Zdr2ZjvjFFsouVcMKveB3N801lHjrYYVWE3G2tXJpqN/SoazupHACZW7bAplnR2n+0IQGV7aMiCTbHD4rBrjGXB/j0C0NjDXBBZoWV32ISvIEFsKqsDP6uOsEWms2iE/0cACnuWo2k2wT825Q6zs68trN5h3+UAyFMRT/JfqaQDXGa/WHvewuqrg2UL2yuzzRZWnRWQ174ALMkfX1S5qKLHDGiVF3UODE4wyGBtUYO8+72d7vKch0ywSSsddFHgDgXgsZc9ZWJhgIE6pb9rs478kAlPPlb99CI8VWqzDo2psJ5p0/IBTFjyjD+n3sZjjOTZDXP8G9Cx0g8v+yUV1vM65Wx//ZA4eZamDvNMpMDWuROepcBW/EXH5Ukn+Nftj7bMg8TRrtQrzPEkQaQvg3fOctxnxQxOMhS9gO3gEWUB2+IjT7kX9qT2bqHkucVteumkjWZaAFjnJwss8JXPzDDBOL+iIvwDv39qcAYe1pgAAAAASUVORK5CYII="/>
  <image id="spaceship" x="981" y="320" width="56" height="120" xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAB4CAQAAAAN1/n5AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAPYQAAD2EAdWsr3QAAAAHdElNRQfiBxcTEhJ9m7+tAAADt0lEQVRo3r3ay04UQRTG8f80oKIoXsYENRoUvESNiFGEuGBhYnwMVr7C7NzqTl7BtyBEVyaG6VEcIyKKwUQjhohBQVCC0i68Mc3M8FXVoU8voKvP9C+Vrqmuy+QSakUOOdr4IGbejvS71onLcmZsA/bImcVswWmmLcAcl9T6gQV4klYxM7YB1fpByQZU22hiVUO1yUywYAFupUvMjMEC7GJLtqDeZIzAXjFvmafZ1rDMigXYykkxM/79JxR06LazBjOu4RyvswVLJBbgYdpkEAtQH1qM2IBOLyYLUH2Cb5mxABu4KGbG//8NAU/Rki2oN5miDag+wVUeZwuOs2gBNnNOzCyuPfEHu2kQM+O1J/6gwwTGBlSf4DfGbEC1W3vCDwtwHx1i5kjlqS+ov+lLlaebD8aVp5sNzjKVLVhKF/iBx8iLmXG6wA90Ho2Ggh5DizBQncBMMWsBNtLtWz8/8CzNYmZxfZEP6P2l32zwJ6M2oPomfMY3C3AHp8XMuFqhO3hR/owRGNDLbC64yItswcf8tADbOCJmFqsXu4IB3bYf6DWByaKGM7y1AHP+Qws/8Di7xcyRWhfcwOAm4wqqb3ozUK3hJHMWYJM8tIhrX3IBz8ur28Xal1xAgybjBqq9zA+e2IDql77MsgW4y3V1OxTskfdojUDHDRGLGmqxwEsbUG2jMasW4CEOiJml+pdV0HPdyR8MmsD4gGobnea9BRjJNSxulKCBXqvbIaD3QpcvqG+cG4Fqk5lg3gLc5rZxHg5205gtaNhkbMFlytmCfzbOQ8G9dIqg8AQVMHARwR00GY26gGovM8ekDei8cR4GtrNfBqXYCDRuMpbgIxtQbzLizyHrgw1cEMExMY/GvxOG9U0sIXeT7eJ9Pqrgvxqun6nkdnJNvQ0LzmCazEGPvPYLOz3AtWQO4Lo8VkOeO9aNURKH40Qod8KJSxiqss1+kAKFdGGBAgfXpTYw5AgmDNNPnj2008cAdyiTkDCYvvUgCQll7jBAH+3sIU8/w85creN2JdfIdwC65KGga3yvPI3SBeaxWHkapQvMIzWwipSRVlCk+qBI75Q8I7V7EVXfzjCMz2nws89dHCK1iBLVX1UxiNQELtp4RhcYmbfSzL+Hmfc0S2lwye8+Utynr9oeVC/3zN4Nf49xbtWf5nVyi/FgZpVX3OVGvd9LVY6cOrjKFfroFJebV/jCLLO84w1TPGeMrxt9pPqNWzjLGY5xlMPkydNKEwDzLPCJSUZ5wMO1naI0cQLgF4GZfI8SHVGFAAAAAElFTkSuQmCC"/>
</svg>`

    return (
    <Container>
    <StatePersist parent={this} hydrateCallback={this.hydrateCallback}/>
      <Row className="App-top-buffer App-row-bottom-margin">
        <Col>
          <div dangerouslySetInnerHTML={{ __html: logo }} />
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
