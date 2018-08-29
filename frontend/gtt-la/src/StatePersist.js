import React from 'react';
import store from 'store';
import moreTypes from './moretypes.js'
store.addPlugin(moreTypes);

class StatePersist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hydradted: true,
      saved: true
    }
  }
  
  componentDidMount() {
    this.hydrateState();
    window.addEventListener(
      "pagehide",
      this.saveState
    );
  }
  
  componentWillUnmount() {
    this.saveState();
      window.removeEventListener(
        "pagehide",
        this.saveState
      );
  }
  
  hydrateState = () => {
    var parent = this.props.parent;
    store.each((value, key) => {
      parent.setState({[key]: value});

      if ('hydrateCallback' in this.props && this.props.hydrateCallback !== undefined)
        if (key in this.props.hydrateCallback) {
          this.props.hydrateCallback[key](value);
        }
    });
  }
  
  saveState = () => {
    Object.entries(this.props.parent.state).forEach(([key, value]) => {
      if (key === 'ws') {
        return;
      }
      store.set([key], value)
    });
  }
  
  render() {
    return null;
  }
}

export default StatePersist