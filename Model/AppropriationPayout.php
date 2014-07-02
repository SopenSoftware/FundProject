<?php

/**
 * class to hold AppropriationPayout data
 *
 * @package     FundProject
 */
class FundProject_Model_AppropriationPayout extends Tinebase_Record_Abstract
{
	/**
	 * key in $_validators/$_properties array for the filed which
	 * represents the identifier
	 *
	 * @var string
	 */
	protected $_identifier = 'id';

	/**
	 * application the record belongs to
	 *
	 * @var string
	 */
	protected $_application = 'FundProject';

	/**
	 * list of zend validator
	 *
	 * this validators get used when validating user generated content with Zend_Input_Filter
	 *
	 * @var array
	 *
	 */
	protected $_validators = array(
        'id'                    => array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => NULL),
        'appropriation_id'                  => array(Zend_Filter_Input::ALLOW_EMPTY => false),
   		'payout_query_date'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'approval_payout_date'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'payout_date'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'booking_payout_date'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'approval_payout_query'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'approval_user_id'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'amount'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'payout_status'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'payout_type'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'booking_text'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true)
	);
	protected $_dateFields = array(
	);
	
	public function setFromArray(array $_data)
	{
		if(empty($_data['payout_query_date']) || $_data['payout_query_date']=="" ){
			$_data['payout_query_date'] = null;
		}		
		if(empty($_data['payout_date']) || $_data['payout_date']=="" ){
			$_data['payout_date'] = null;
		}		
		if(empty($_data['approval_payout_date']) || $_data['approval_payout_date']=="" ){
			$_data['approval_payout_date'] = null;
		}		
		if(empty($_data['booking_payout_date']) || $_data['booking_payout_date']=="" ){
			$_data['booking_payout_date'] = null;
		}			
		
		parent::setFromArray($_data);
	}

	protected function _setFromJson(array &$_data)
	{
		if(empty($_data['payout_query_date']) || $_data['payout_query_date']=="" ){
			$_data['payout_query_date'] = null;
		}		
		if(empty($_data['payout_date']) || $_data['payout_date']=="" ){
			$_data['payout_date'] = null;
		}		
		if(empty($_data['approval_payout_date']) || $_data['approval_payout_date']=="" ){
			$_data['approval_payout_date'] = null;
		}		
		if(empty($_data['booking_payout_date']) || $_data['booking_payout_date']=="" ){
			$_data['booking_payout_date'] = null;
		}			
	}
}