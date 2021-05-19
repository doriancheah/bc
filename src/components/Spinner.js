import React from 'react';

export default function ({ type }) {
	if(type === 'table') {
		return <tr><td className="spinner-border text-light text-center"></td></tr>;
	}
	return <div className="spinner-border text-light text-center"></div>;
}