<?php
class FundProject_Controller_Project extends Tinebase_Controller_Record_Abstract
{
	const REASON_NO_PROJECT_DEBITOR = 'noProjectDebitor';
	const REASON_NO_APPROVAL = 'noApproval';
	
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
		$this->_backend = new FundProject_Backend_Project();
		$this->_modelName = 'FundProject_Model_Project';
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
	

	public function getEmptyProject(){
		$emptyObj = new FundProject_Model_Project(null,true);
		return $emptyObj;
	}
	
	
	public function getByNr($projectNumber){
		return $this->_backend->getByProperty($projectNumber, 'project_nr');	
	}
	
    /**
     * get attender Projects
     *
     * @param string $_sort
     * @param string $_dir
     * @return Tinebase_Record_RecordSet of subtype FundProject_Model_AttenderProject
     * 
     * @todo    use getAll from generic controller
     */
    public function getAllProjects($_sort = 'name', $_dir = 'ASC')
    {
        $result = $this->_backend->getAll($_sort, $_dir);
        return $result;    
    }
    
    public function canAddAppropriation($projectId){
    	$project = $this->get($projectId);
    	$check1 = false;
    	
    	try{
    		FundProject_Controller_ProjectContact::getInstance()->getProjectDebitorContact($projectId, 'DEBITOR');
			$check1 = true;
    	}catch(Exception $e){
    		$reason1 = self::REASON_NO_PROJECT_DEBITOR;
    		$message1 = 'Das Projekt hat keinen Projekt-Debitor';
    	}
    	
    	return array(
    		'canAdd' => $check1,
    		'noAddMessages' => array(
    			$message1
    		)
    	);
    }
    
	protected function _inspectCreate(Tinebase_Record_Interface $_record)
	{
		$_record->setTimezone(Tinebase_Core::get(Tinebase_Core::USERTIMEZONE));
		if(!$_record->__get('project_nr')){
			$_record->__set('project_nr', Tinebase_NumberBase_Controller::getInstance()->getNextNumber('fp_project_nr'));
		}
		
		$_record->updateRest();
	}
	
	protected function _inspectUpdate(Tinebase_Record_Interface $_record)
	{
		$_record->updateRest();
	}
}
?>