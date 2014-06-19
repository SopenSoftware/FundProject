<?php

/**
 * class to hold Appropriation data
 *
 * @package     FundProject
 */
class FundProject_Model_Appropriation extends Tinebase_Record_Abstract
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
        'project_id'                  => array(Zend_Filter_Input::ALLOW_EMPTY => false),
   		'appropriation_nr'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'funds_category_id'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'funds_kind_id'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'order_id'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
       	'name'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'debit_position_date'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'decision_date'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'decision_committee'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'state'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'amount'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'proposal_amount'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'approval_draft_date'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'comment'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		
		'payout_amount'      => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'confirmed_amount'    => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'rest_amount'            => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        
		
		'created_by'            => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'creation_time'         => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'last_modified_by'      => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'last_modified_time'    => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'is_deleted'            => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'deleted_time'          => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'deleted_by'            => array(Zend_Filter_Input::ALLOW_EMPTY => true)
	);
	protected $_dateFields = array(
	 // modlog
     	'creation_time',
        'last_modified_time',
        'deleted_time',
	);
	
public function setFromArray(array $_data)
	{
		if(empty($_data['debit_position_date']) || $_data['debit_position_date']=="" ){
			$_data['debit_position_date'] = null;
		}				
		if(empty($_data['decision_date']) || $_data['decision_date']=="" ){
			$_data['decision_date'] = null;
		}		
		if(empty($_data['approval_draft_date']) || $_data['approval_draft_date']=="" ){
			$_data['approval_draft_date'] = null;
		}			
		
		parent::setFromArray($_data);
	}

	protected function _setFromJson(array &$_data)
	{
		if(empty($_data['debit_position_date']) || $_data['debit_position_date']=="" ){
			$_data['debit_position_date'] = null;
		}				
		if(empty($_data['decision_date']) || $_data['decision_date']=="" ){
			$_data['decision_date'] = null;
		}		
		if(empty($_data['approval_draft_date']) || $_data['approval_draft_date']=="" ){
			$_data['approval_draft_date'] = null;
		}		
	}
	
	public function addPayout($amount){
		$this->__set('payout_amount', (float)$this->__get('payout_amount') + (float) $amount);
	}
	
	public function addConfirm($amount){
		$this->__set('confirmed_amount', (float)$this->__get('confirmed_amount') + (float) $amount);
	}
	
	public function updateRest(){
		$payoutAmount = (float) $this->__get('payout_amount');
		$confirmedAmount = (float) $this->__get('confirmed_amount');
		
		$this->__set('rest_amount', $confirmedAmount - $payoutAmount);
	}
}