<?php
class FundProject_Model_AppropriationPayoutFilter extends Tinebase_Model_Filter_FilterGroup// implements Tinebase_Model_Filter_AclFilter
{
    /**
     * @var string application of this filter group
     */
    protected $_applicationName = 'FundProject';
    
    protected $_className = 'FundProject_Model_AppropriationPayoutFilter';
    
    /**
     * @var array filter model fieldName => definition
     */
    protected $_filterModel = array(
     	'id' => array('filter' => 'Tinebase_Model_Filter_Id'),
   		'query'          => array('filter' => 'Tinebase_Model_Filter_Query', 'options' => array('fields' => array('booking_text'))),
    	'appropriation_id' => array('filter' => 'Tinebase_Model_Filter_ForeignId', 
            'options' => array(
                'filtergroup'       => 'FundProject_Model_AppropriationFilter', 
                'controller'        => 'FundProject_Controller_Appropriation'
            )
        ),
        'project_nr' => array('filter' => 'FundProject_Model_AppropriationProjectForeignFilter'),
        'project_id' => array('filter' => 'FundProject_Model_AppropriationProjectForeignIdFilter'),
        'appropriation_nr' => array('filter' => 'FundProject_Model_AppropriationForeignFilter'),
        
        'payout_query_date' => array('filter' => 'Tinebase_Model_Filter_Date'),
        'approval_payout_date' => array('filter' => 'Tinebase_Model_Filter_Date'),
        'approval_payout_query' => array('filter' => 'Tinebase_Model_Filter_Bool'),
        
        'payout_status' => array('filter' => 'Tinebase_Model_Filter_Text'),
        'payout_type' => array('filter' => 'Tinebase_Model_Filter_Text')
    );
}
?>