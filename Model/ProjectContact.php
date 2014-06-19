<?php

/**
 * class to hold ProjectContact data
 *
 * @package     FundProject
 */
class FundProject_Model_ProjectContact extends Tinebase_Record_Abstract
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
   		'project_role_id'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'contact_id'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'company'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'plz'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'location'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true)
	);
	protected $_dateFields = array(
	);
}