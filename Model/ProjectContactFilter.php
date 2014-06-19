<?php
class FundProject_Model_ProjectContactFilter extends Tinebase_Model_Filter_FilterGroup// implements Tinebase_Model_Filter_AclFilter
{
    /**
     * @var string application of this filter group
     */
    protected $_applicationName = 'FundProject';
    
    protected $_className = 'FundProject_Model_ProjectContactFilter';
    
    /**
     * @var array filter model fieldName => definition
     */
    protected $_filterModel = array(
     	'id' => array('filter' => 'Tinebase_Model_Filter_Id'),
   		'query'          => array('filter' => 'Tinebase_Model_Filter_Query', 'options' => array('fields' => array('id'))),
        'project_id' => array('filter' => 'Tinebase_Model_Filter_ForeignId', 
            'options' => array(
                'filtergroup'       => 'FundProject_Model_ProjectFilter', 
                'controller'        => 'FundProject_Controller_Project'
            )
        )
    );
}
?>