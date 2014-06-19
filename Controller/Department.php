<?php
class FundProject_Controller_Department extends Tinebase_Controller_Record_Abstract
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
		$this->_backend = new FundProject_Backend_Department();
		$this->_modelName = 'FundProject_Model_Department';
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

	public function getEmptyDepartment(){
		$emptyObj = new FundProject_Model_Department(null,true);
		return $emptyObj;
	}
	
	public function getByName($name){
		return $this->_backend->getByProperty($name, 'name');
	}
	
    /**
     * get attender Departments
     *
     * @param string $_sort
     * @param string $_dir
     * @return Tinebase_Record_RecordSet of subtype FundProject_Model_AttenderDepartment
     * 
     * @todo    use getAll from generic controller
     */
    public function getAllDepartments($_sort = 'name', $_dir = 'ASC')
    {
        $result = $this->_backend->getAll($_sort, $_dir);
        return $result;    
    }
}
?>