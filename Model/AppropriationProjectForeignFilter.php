<?php
class FundProject_Model_AppropriationProjectForeignFilter extends Tinebase_Model_Filter_Abstract
{
    /**
     * @var array list of allowed operators
     */
    protected $_operators = array(
        'equals'
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
	    	$pFilter = new FundProject_Model_ProjectFilter(array(
	            array('field' => 'project_nr',   'operator' => $this->_operator, 'value' => $this->_value),
	        ));
	        
	    	
	    	$projectIds = FundProject_Controller_Project::getInstance()->search($pFilter, NULL, FALSE, TRUE);
	        
	    	$filter = new FundProject_Model_AppropriationFilter(array(), 'AND');
	    	
	        $filter->addFilter(new Tinebase_Model_Filter_Id('project_id', 'in', $projectIds));
	        
	        
	        $filter = new FundProject_Model_AppropriationFilter(array(), 'AND');
	    	$filter->addFilter(new Tinebase_Model_Filter_Id('project_id', 'in', $projectIds));
	    	$appropriationIds = FundProject_Controller_Appropriation::getInstance()->search($filter, NULL, FALSE, TRUE);
	        
	    	$filter->removeFilter('project_id');
	    	
	        $filter->addFilter(new Tinebase_Model_Filter_Id('appropriation_id', 'in', $appropriationIds));
	        
	       	Tinebase_Backend_Sql_Filter_FilterGroup::appendFilters($_select, $filter, $_backend);
    	}
    }
}