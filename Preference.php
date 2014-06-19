<?php
/**
 * Tine 2.0
 *
 * @package     DocManager
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @copyright   Copyright (c) 2009 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id: Preference.php 14258 2010-05-07 14:46:00Z g.ciyiltepe@metaways.de $
 */


/**
 * backend for DocManager preferences
 *
 * @package     DocManager
 */
class FundProject_Preference extends Tinebase_Preference_Abstract
{
	/**************************** application preferences/settings *****************/

	/**
	 * default DocManager all newly created contacts are placed in
	 */
	const ORDER_TEMPLATE = 'ORDER_TEMPLATE';
	
	/**
	 * @var string application
	 */
	protected $_application = 'FundProject';

	/**************************** public functions *********************************/

	/**
	 * get all possible application prefs
	 *
	 * @return  array   all application prefs
	 */
	public function getAllApplicationPreferences()
	{
		$allPrefs = array(
		self::ORDER_TEMPLATE
		);

		return $allPrefs;
	}

	/**
	 * get translated right descriptions
	 *
	 * @return  array with translated descriptions for this applications preferences
	 */
	public function getTranslatedPreferences()
	{
		//$translate = Tinebase_Translation::getTranslation($this->_application);

		$prefDescriptions = array(
		self::ORDER_TEMPLATE  => array(
                'label'         => 'Auftragsvorlage Mittel-Bewilligung',
                'description'   => '',
		)
		);

		return $prefDescriptions;
	}

	/**
	 * get preference defaults if no default is found in the database
	 *
	 * @param string $_preferenceName
	 * @return Tinebase_Model_Preference
	 */
	public function getPreferenceDefaults($_preferenceName, $_accountId=NULL, $_accountType=Tinebase_Acl_Rights::ACCOUNT_TYPE_USER)
	{
		$preference = $this->_getDefaultBasePreference($_preferenceName);
		switch($_preferenceName) {
			case self::ORDER_TEMPLATE:
				break;
			default:
				throw new Tinebase_Exception_NotFound('Default preference with name ' . $_preferenceName . ' not found.');
		}

		return $preference;
	}

	/**
	 * get special options
	 *
	 * @param string $_value
	 * @return array
	 */
	protected function _getSpecialOptions($_value)
	{
		$result = array();
		switch($_value) {
			case self::ORDER_TEMPLATE:
				$templates = Billing_Controller_OrderTemplate::getInstance()->getAll();
				foreach ($templates as $template) {
					$result[] = array($template->getId(), $template->__get('name'));
				}
				break;
			default:
				$result = parent::_getSpecialOptions($_value);
		}

		return $result;
	}
}
