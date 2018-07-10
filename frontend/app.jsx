class LinkForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {url: "", ret: ""};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	render() {
		return (
			<div>
				<h3>GetToThe.LinkAsap</h3>
				<form onSubmit={this.handleSubmit}>
					<label htmlFor="a-link">
						Please enter a link:
					</label>
					<input
						id="a-link"
						onChange={this.handleChange}
						value={this.state.url}
						size="100"
					/>
					<button>
						Shortern URL
					</button>
				</form>
				<LinkShorterned url={this.state.ret} />
			</div>
		)
	}

	handleChange(e) {
		this.setState({url: e.target.value})
	}

	handleSubmit(e) {
		e.preventDefault();
		if (!this.state.url) {
			return;
		}

		// REQUEST TO API
		axios.post('https://b7yg46eoyd.execute-api.us-east-1.amazonaws.com/dev/hello', this.state.url)
			.then((response) => {
				var result = "https://gtt.la/" + response.data.url
				this.setState({ret: result})
			})
	}
}

class LinkShorterned extends React.Component {
	render() {
		return(
			<h1>
				<a href={this.props.url} target='_blank'>
					{this.props.url}
				</a>
			</h1>
		)

	}
}

ReactDOM.render(<LinkForm />, document.getElementById('root'))
