import React from 'react';
import ReactDOM from 'react-dom';

// pass content and actions and onDismiss. content can just be text. actions is a fragment with button(s)

const Modal = props => {
	return ReactDOM.createPortal(
		<div onClick={props.onDismiss} className="dimmer modals visible active">
			<div onClick={(e) => e.stopPropagation()} className="standard modal visible active">
			  <div className="header">{props.title}</div>
			  <div className="content">
			    {props.content}
			  </div>
			  <div className="actions">
			  	{props.actions}
			  </div>
			  
			</div>
		</div>,
		document.querySelector('#modal')
	);

};

export default Modal;