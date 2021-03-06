<?php
class FundProject_Model_AppropriationForeignFilter extends Tinebase_Model_Filter_Abstract
{
    /**
     * @var array list of allowed operators
     */
    protected $_operators = array(
        'contains','equals', 'greater', 'less', 'startswith', 'endswith'
    );
    
    
    /**
     * appends sql to given select statement
     *
     * @param Zend_Db_Select                $_select
     * @param Tinebase_Backend_Sql_Abstract $_backend
     */
    public function appendFilterSql($_select, $_backend)
    {
        if($this->_value){
//        	$filterData = array(
//            	array('field' => 'member_nr',   'operator' => 'contains', 'value' => $this->_value)
//        	);
        	
	    	$filter = new FundProject_Model_AppropriationFilter(array(), 'AND');
	    	
	    	$pFilter = new FundProject_Model_AppropriationFilter(array(
	            array('field' => 'appropriation_nr',   'operator' => $this->_operator, 'value' => $this->_value),
	        ));
	        $projectIds = FundProject_Controller_Appropriation::getInstance()->search($pFilter, NULL, FALSE, TRUE);
	        
	        $filter->addFilter(new Tinebase_Model_Filter_Id('appropriation_id', 'in', $projectIds));
	       	Tinebase_Backend_Sql_Filter_FilterGroup::appendFilters($_select, $filter, $_backend);
    	}
    }
}