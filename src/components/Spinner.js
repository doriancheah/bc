import React from 'react';

export default function ({ type }) {
	if(type === 'table') {
		return <tr><td className="spinner-border spinner-parent text-light text-center"></td></tr>;
	}
	//return (<div className="spinner-border spinner-parent text-light text-center"></div>);
	return (
		<div className="d-flex justify-content-center spinner-parent">
		  <div className="spinner-border spinner-child">
		    <span className="sr-only">Loading...</span>
		  </div>
		</div>		
	);
}