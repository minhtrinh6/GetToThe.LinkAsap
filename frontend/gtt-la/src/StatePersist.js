import React from 'react';
import store from 'store';

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
      if (value.type === "Map") {
        value = new Map(value.data);
      } else {
        value = value.data
      }
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
      var type = value.constructor.name
      if (value instanceof Map) {
        value = Array.from(value.entries());
      }
      var datum = {type: type, data: value};
      store.set([key], datum);
    });
  }
  
  render() {
    return null;
  }
}

export default StatePersist