import React from 'react';
import ReactDOM from 'react-dom';

// pass content and actions and onDismiss. content can just be text. actions is a fragment with button(s)

const Modal = ({ title, content, actions, onDismiss, children }) => {

	return ReactDOM.createPortal(
		<React.Fragment>		
			<div className="modal fade show" style={{display: 'block'}}>
			    <div className="modal-dialog modal-dialog-centered">
			        <div className="modal-content bg-dark text-light small">
			            <div className="modal-header">
			                <h5 className="modal-title">{title}</h5>
			                <button type="button" className="close" onClick={onDismiss} />
			            </div>
			            <div className="modal-body">
			                { content ? content : children }
			            </div>
			            <div className="modal-footer">
			            		{actions}
			            </div>
			        </div>
			    </div>
			</div>	
			<div className="modal-backdrop fade show" style={{ display: 'block' }}>
			</div>
		</React.Fragment>

	,
		document.querySelector('#modal')
	);

};

export default Modal;