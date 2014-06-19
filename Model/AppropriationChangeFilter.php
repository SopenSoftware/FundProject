<?php
class FundProject_Model_AppropriationChangeFilter extends Tinebase_Model_Filter_FilterGroup// implements Tinebase_Model_Filter_AclFilter
{
    /**
     * @var string application of this filter group
     */
    protected $_applicationName = 'FundProject';
    
    protected $_className = 'FundProject_Model_AppropriationChangeFilter';
    
    /**
     * @var array filter model fieldName => definition
     */
    protected $_filterModel = array(
     	'id' => array('filter' => 'Tinebase_Model_Filter_Id'),
    	 'appropriation_id' => array('filter' => 'Tinebase_Model_Filter_ForeignId', 
            'options' => array(
                'filtergroup'       => 'FundProject_Model_AppropriationFilter', 
                'controller'        => 'FundProject_Controller_Appropriation'
            )
        ),
   		'query'          => array('filter' => 'Tinebase_Model_Filter_Query', 'options' => array('fields' => array('name')))
    );
}
?>