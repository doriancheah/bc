import React from 'react';

class NoContent extends React.Component {
	render() {
		return (
      <div className="content">
        <div className="no-contract">Smart contracts not found on selected network.</div>
      </div>			
		);
	}
}

export default NoContent;