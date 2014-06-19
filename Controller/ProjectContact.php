<?php
class FundProject_Controller_ProjectContact extends Tinebase_Controller_Record_Abstract
{
	/**
	 * config of courses
	 *
	 * @var Zend_Config
	 */
	protected $_config = NULL;

	/**
	 * the constructor
	 *
	 * don't use the constructor. use the singleton
	 */
	private function __construct() {
		$this->_applicationName = 'FundProject';
		$this->_backend = new FundProject_Backend_ProjectContact();
		$this->_modelName = 'FundProject_Model_ProjectContact';
		$this->_currentAccount = Tinebase_Core::getUser();
		$this->_purgeRecords = FALSE;
		$this->_doContainerACLChecks = FALSE;
		$this->_config = isset(Tinebase_Core::getConfig()->FundProject) ? Tinebase_Core::getConfig()->FundProject : new Zend_Config(array());
	}

	private static $_instance = NULL;

	/**
	 * the singleton pattern
	 *
	 * @return SoFundProject_Controller_SoEvent
	 */
	public static function getInstance()
	{
		if (self::$_instance === NULL) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}

	public function getEmptyProjectContact(){
		$emptyObj = new FundProject_Model_ProjectContact(null,true);
		return $emptyObj;
	}
	
	
	public function getProjectDebitorContact($projectId, $debitorKey){
		$projectRole = FundProject_Controller_ProjectRole::getInstance()->getByKey($debitorKey);
		
		return $this->_backend->getByPropertySet(
			array(
				'project_id' => $projectId,
				'project_role_id' => $projectRole->getId()
			)
		);
	}
	
    /**
     * get attender ProjectContacts
     *
     * @param string $_sort
     * @param string $_dir
     * @return Tinebase_Record_RecordSet of subtype FundProject_Model_AttenderProjectContact
     * 
     * @todo    use getAll from generic controller
     */
    public function getAllProjectContacts($_sort = 'name', $_dir = 'ASC')
    {
        $result = $this->_backend->getAll($_sort, $_dir);
        return $result;    
    }
}
?>