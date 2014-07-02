<?php

/**
 * class to hold AppropriationChange data
 *
 * @package     FundProject
 */
class FundProject_Model_AppropriationChange extends Tinebase_Record_Abstract
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
   		'receipt_id'                  => array(Zend_Filter_Input::ALLOW_EMPTY => false),
   		'change_date'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'change_amount'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'change_claim_amount'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'is_state_change'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'is_amount_change'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'is_rebooking'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'rebooking_kind'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'comment'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'state' 				=> array(Zend_Filter_Input::ALLOW_EMPTY => true),
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
}