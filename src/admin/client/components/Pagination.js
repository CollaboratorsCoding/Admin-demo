import React from 'react';
import {Button} from 'antd';

class Pagination extends React.Component {
    handleChange = async (p) => {
    	this.props.setPage(p)
    }

    render() {
    	const {pageSize, totalItems, currentPage} = this.props;
    	const totalPages = Math.ceil(totalItems/pageSize);
    	const currentItems = pageSize * currentPage;
    	const c = currentItems - pageSize;
    	let rest = 0;
    	if(currentItems > totalItems) {
    		rest = currentItems-totalItems
    	}
    	const result = currentItems < totalItems?currentItems:currentItems-rest
    	const prevDisabled = currentPage === 1;
    	const nextDisabled = currentPage === totalPages;
    	return (
    		<ul className="pagination">
    			<li>
                
    				<Button disabled={prevDisabled} onClick={()=>{if(!prevDisabled)this.handleChange(-1)}} type="primary" shape="circle" icon="left" />
    			</li>
    			<li>
    				<span className="message-counter">{c} - {result} of {totalItems}</span>
    			</li>
    			<li>
    				<Button disabled={nextDisabled} onClick={()=> {if(!nextDisabled) this.handleChange(1)}} type="primary" shape="circle" icon="right" />
    			</li>
    		</ul>
    	);
    }
}

export default Pagination