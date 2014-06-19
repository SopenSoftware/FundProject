<?php
class FundProject_Model_ProjectFilter extends Tinebase_Model_Filter_FilterGroup// implements Tinebase_Model_Filter_AclFilter
{
    /**
     * @var string application of this filter group
     */
    protected $_applicationName = 'FundProject';
    
    protected $_className = 'FundProject_Model_ProjectFilter';
    
    /**
     * @var array filter model fieldName => definition
     */
    protected $_filterModel = array(
     	'id' => array('filter' => 'Tinebase_Model_Filter_Id'),
    	'project_nr' => array('filter' => 'Tinebase_Model_Filter_Text'),
   		'query'          => array('filter' => 'Tinebase_Model_Filter_Query', 'options' => array('fields' => array('project_nr','short_name','name'))),
    	'project_id' => array('filter' => 'Tinebase_Model_Filter_ForeignId', 
            'options' => array(
                'filtergroup'       => 'FundProject_Model_ProjectFilter', 
                'controller'        => 'FundProject_Controller_Project'
            )
        )
    );
}
?>