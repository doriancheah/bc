import React from 'react';

class NoContent extends React.Component {
	constructor(props) {
		super(props);
		this.messageRef = React.createRef();
		this.timeoutId = null;
	}

	componentDidMount() {
		this.timeoutId = setTimeout(() => {
			this.messageRef.current.innerHTML = 'Smart contracts not found on selected network. Please select a valid network using Metamask.';
		}, 5000)
	}

	componentWillUnmount() {
		clearTimeout(this.timeoutId);
	}

	render() {
		return (
      <div className="content">
        <div className="no-contract" ref={this.messageRef}>Loading...</div>
      </div>			
		);
	}
	
}

export default NoContent;