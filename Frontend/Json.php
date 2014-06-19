<?php
class FundProject_Frontend_Json extends Tinebase_Frontend_Json_Abstract{
    protected $_projectController = NULL;
	protected $_appropriationController = NULL;
	protected $_appropriationChangeController = NULL;
    protected $_appropriationPayoutController = NULL;
    
	protected $_config = NULL;
    protected $_userTimezone = null;
    protected $_serverTimezone = null;
    
    /**
     * the constructor
     *
     */
    public function __construct()
    {
        $this->_applicationName = 'FundProject';
        $this->_projectController = FundProject_Controller_Project::getInstance();
        $this->_appropriationController = FundProject_Controller_Appropriation::getInstance();
        $this->_appropriationChangeController = FundProject_Controller_AppropriationChange::getInstance();
        $this->_appropriationPayoutController = FundProject_Controller_AppropriationPayout::getInstance();
        $this->_promotionAreaController = FundProject_Controller_PromotionArea::getInstance();
        $this->_departmentController = FundProject_Controller_Department::getInstance();
        $this->_projectRoleController = FundProject_Controller_ProjectRole::getInstance();
        $this->_projectContactController = FundProject_Controller_ProjectContact::getInstance();
        $this->_fundsKindController = FundProject_Controller_FundsKind::getInstance();
        $this->_fundsCategoryController = FundProject_Controller_FundsCategory::getInstance();
    }
    
    public function requestAppropriationChange($appropriationId, $data, $changeSet){
    	try{
    		$this->_appropriationController->requestAppropriationChange($appropriationId, $data, $changeSet);
    		
    		return array(
    			'success' => true,
    			'result' => array()
    		);
    	}catch(Exception $e){
    		echo $e->__toString();
    		return array(
    			'success' => false,
    			'result' => array(),
    			'errorInfo' => $e->__toString()
    		);
    	}
    	
    }
    
	public function requestAppropriationPayoutChange($ids, $requestChangeType){
    	try{
    		$this->_appropriationPayoutController->requestAppropriationPayoutChange($ids, $requestChangeType);
    		
    		return array(
    			'success' => true,
    			'result' => array()
    		);
    	}catch(Exception $e){
    		echo $e->__toString();
    		return array(
    			'success' => false,
    			'result' => array(),
    			'errorInfo' => $e->__toString()
    		);
    	}
    	
    }
	    
    public function getProject($id){
    	if(!$id ) {
            $obj = $this->_projectController->getEmptyProject();
        } else {
            $obj = $this->_projectController->get($id);
        }
       
        $objData = $obj->toArray();
        return $objData;
    }
    
    public function searchProjects($filter,$paging){
    	$result = $this->_search($filter,$paging,$this->_projectController,'FundProject_Model_ProjectFilter');
    	return $result;
    }
    
    public function deleteProjects($ids){
    	 return $this->_delete($ids, $this->_projectController);
    }

    public function saveProject($recordData){
    	$obj = new FundProject_Model_Project();
        $obj->setFromJsonInUsersTimezone($recordData);
        //$obj->setFromArray($recordData);
        
        if (!$obj->getId()) {
            $obj = $this->_projectController->create($obj);
        } else {
            $obj = $this->_projectController->update($obj);
        }
        $result =  $this->getProject($obj->getId());
        return $result;
    }
    
    public function projectCanAddAppropriation($projectId){
    	try{
    		$check = $this->_projectController->canAddAppropriation($projectId);
    		if($check['canAdd']){
    			return array(
    				'success' => true,
    				'result' => array(),
    				'check' => true
    			);
    		}else{
    			return array(
    				'success' => true,
    				'noAddMessages' => $check['noAddMessages'],
    				'check' => false
    			);
    		}
    	}catch(Exception $e){
    		return array(
    			'success' => false,
    			'result' => array()
    		);
    	}
    	
    }
    
 	public function appropriationCanBeConfirmed($appropriationId){
    	try{
    		$check = $this->_appropriationController->appropriationCanBeConfirmed($appropriationId);
    		
    		if($check['canAdd']){
    			return array(
    				'success' => true,
    				'result' => array(),
    				'check' => true
    			);
    		}else{
    			return array(
    				'success' => true,
    				'noAddMessages' => $check['noAddMessages'],
    				'check' => false
    			);
    		}
    	}catch(Exception $e){
    		return array(
    			'success' => false,
    			'result' => array(),
    			'errorInfo' => $e->__toString()
    		);
    	}
    	
    }
    
    public function getAppropriation($id){
    	if(!$id ) {
            $obj = $this->_appropriationController->getEmptyAppropriation();
        } else {
            $obj = $this->_appropriationController->get($id);
        }
        $objData = $obj->toArray();
        
        return $objData;
    }
    
    public function searchAppropriations($filter,$paging){
    	$result = $this->_search($filter,$paging,$this->_appropriationController,'FundProject_Model_AppropriationFilter');
    	return $result;
    }
    
    public function deleteAppropriations($ids){
    	 return $this->_delete($ids, $this->_appropriationController);
    }

    public function saveAppropriation($recordData){
    	$obj = new FundProject_Model_Appropriation();
         $obj->setFromJsonInUsersTimezone($recordData);
        
        if (!$obj->getId()) {
            $obj = $this->_appropriationController->create($obj);
        } else {
            $obj = $this->_appropriationController->update($obj);
        }
        
        $result =  $this->getAppropriation($obj->getId());
        return $result;
    }
    
    public function getAppropriationChange($id){
    	if(!$id ) {
            $obj = $this->_appropriationChangeController->getEmptyAppropriationChange();
        } else {
            $obj = $this->_appropriationChangeController->get($id);
        }
        $objData = $obj->toArray();
        
        return $objData;
    }
    
    public function searchAppropriationChanges($filter,$paging){
    	$result = $this->_search($filter,$paging,$this->_appropriationChangeController,'FundProject_Model_AppropriationChangeFilter');
    	return $result;
    }
    
    public function deleteAppropriationChanges($ids){
    	 return $this->_delete($ids, $this->_appropriationChangeController);
    }

    public function saveAppropriationChange($recordData){
    	$obj = new FundProject_Model_AppropriationChange();
        $obj->setFromArray($recordData);
        
        if (!$obj->getId()) {
            $obj = $this->_appropriationChangeController->create($obj);
        } else {
            $obj = $this->_appropriationChangeController->update($obj);
        }
        
        $result =  $this->getAppropriationChange($obj->getId());
        return $result;
    }
    
    public function getAppropriationPayout($id){
    	if(!$id ) {
            $obj = $this->_appropriationPayoutController->getEmptyAppropriationPayout();
        } else {
            $obj = $this->_appropriationPayoutController->get($id);
        }
        $objData = $obj->toArray();
        
        return $objData;
    }
    
    public function searchAppropriationPayouts($filter,$paging){
    	$result = $this->_search($filter,$paging,$this->_appropriationPayoutController,'FundProject_Model_AppropriationPayoutFilter');
    	return $result;
    }
    
    public function deleteAppropriationPayouts($ids){
    	 return $this->_delete($ids, $this->_appropriationPayoutController);
    }

    public function saveAppropriationPayout($recordData){
    	$obj = new FundProject_Model_AppropriationPayout();
        $obj->setFromArray($recordData);
        
        if (!$obj->getId()) {
            $obj = $this->_appropriationPayoutController->create($obj);
        } else {
            $obj = $this->_appropriationPayoutController->update($obj);
        }
        
        $result =  $this->getAppropriationPayout($obj->getId());
        return $result;
    }
    
    public function getPromotionArea($id){
    	if(!$id ) {
            $obj = $this->_promotionAreaController->getEmptyPromotionArea();
        } else {
            $obj = $this->_promotionAreaController->get($id);
        }
        $objData = $obj->toArray();
        
        return $objData;
    }
    
    public function searchPromotionAreas($filter,$paging){
    	$result = $this->_search($filter,$paging,$this->_promotionAreaController,'FundProject_Model_PromotionAreaFilter');
    	return $result;
    }
    
    public function deletePromotionAreas($ids){
    	 return $this->_delete($ids, $this->_promotionAreaController);
    }

    public function savePromotionArea($recordData){
    	$obj = new FundProject_Model_PromotionArea();
        $obj->setFromArray($recordData);
        
        if (!$obj->getId()) {
            $obj = $this->_promotionAreaController->create($obj);
        } else {
            $obj = $this->_promotionAreaController->update($obj);
        }
        
        $result =  $this->getPromotionArea($obj->getId());
        return $result;
    }
    
	public function getDepartment($id){
    	if(!$id ) {
            $obj = $this->_departmentController->getEmptyDepartment();
        } else {
            $obj = $this->_departmentController->get($id);
        }
        $objData = $obj->toArray();
        
        return $objData;
    }
    
    public function searchDepartments($filter,$paging){
    	$result = $this->_search($filter,$paging,$this->_departmentController,'FundProject_Model_DepartmentFilter');
    	return $result;
    }
    
    public function deleteDepartments($ids){
    	 return $this->_delete($ids, $this->_departmentController);
    }

    public function saveDepartment($recordData){
    	$obj = new FundProject_Model_Department();
        $obj->setFromArray($recordData);
        
        if (!$obj->getId()) {
            $obj = $this->_departmentController->create($obj);
        } else {
            $obj = $this->_departmentController->update($obj);
        }
        
        $result =  $this->getDepartment($obj->getId());
        return $result;
    }
    
	public function getProjectRole($id){
    	if(!$id ) {
            $obj = $this->_projectRoleController->getEmptyProjectRole();
        } else {
            $obj = $this->_projectRoleController->get($id);
        }
        $objData = $obj->toArray();
        
        return $objData;
    }
    
    public function searchProjectRoles($filter,$paging){
    	$result = $this->_search($filter,$paging,$this->_projectRoleController,'FundProject_Model_ProjectRoleFilter');
    	return $result;
    }
    
    public function deleteProjectRoles($ids){
    	 return $this->_delete($ids, $this->_projectRoleController);
    }

    public function saveProjectRole($recordData){
    	$obj = new FundProject_Model_ProjectRole();
        $obj->setFromJsonInUsersTimezone($recordData);
        
        if (!$obj->getId()) {
            $obj = $this->_projectRoleController->create($obj);
        } else {
            $obj = $this->_projectRoleController->update($obj);
        }
        
        $result =  $this->getProjectRole($obj->getId());
        return $result;
    }
    
    
	public function getProjectContact($id){
    	if(!$id ) {
            $obj = $this->_projectContactController->getEmptyProjectContact();
        } else {
            $obj = $this->_projectContactController->get($id);
        }
        $objData = $obj->toArray();
        
        return $objData;
    }
    
    public function searchProjectContacts($filter,$paging){
    	$result = $this->_search($filter,$paging,$this->_projectContactController,'FundProject_Model_ProjectContactFilter');
    	return $result;
    }
    
    public function deleteProjectContacts($ids){
    	 return $this->_delete($ids, $this->_projectContactController);
    }

    public function saveProjectContact($recordData){
    	$obj = new FundProject_Model_ProjectContact();
        $obj->setFromJsonInUsersTimezone($recordData);
        
        if (!$obj->getId()) {
            $obj = $this->_projectContactController->create($obj);
        } else {
            $obj = $this->_projectContactController->update($obj);
        }
        
        $result =  $this->getProjectContact($obj->getId());
        return $result;
    }
    
    
    
	public function getFundsKind($id){
    	if(!$id ) {
            $obj = $this->_fundsKindController->getEmptyFundsKind();
        } else {
            $obj = $this->_fundsKindController->get($id);
        }
        $objData = $obj->toArray();
        
        return $objData;
    }
    
    public function searchFundsKinds($filter,$paging){
    	$result = $this->_search($filter,$paging,$this->_fundsKindController,'FundProject_Model_FundsKindFilter');
    	return $result;
    }
    
    public function deleteFundsKinds($ids){
    	 return $this->_delete($ids, $this->_fundsKindController);
    }

    public function saveFundsKind($recordData){
    	$obj = new FundProject_Model_FundsKind();
        $obj->setFromArray($recordData);
        
        if (!$obj->getId()) {
            $obj = $this->_fundsKindController->create($obj);
        } else {
            $obj = $this->_fundsKindController->update($obj);
        }
        
        $result =  $this->getFundsKind($obj->getId());
        return $result;
    }
    
    public function getFundsCategory($id){
    	if(!$id ) {
            $obj = $this->_fundsCategoryController->getEmptyFundsCategory();
        } else {
            $obj = $this->_fundsCategoryController->get($id);
        }
        $objData = $obj->toArray();
        
        return $objData;
    }
    
    public function searchFundsCategorys($filter,$paging){
    	$result = $this->_search($filter,$paging,$this->_fundsCategoryController,'FundProject_Model_FundsCategoryFilter');
    	return $result;
    }
    
    public function deleteFundsCategorys($ids){
    	 return $this->_delete($ids, $this->_fundsCategoryController);
    }

    public function saveFundsCategory($recordData){
    	$obj = new FundProject_Model_FundsCategory();
        $obj->setFromArray($recordData);
        
        if (!$obj->getId()) {
            $obj = $this->_fundsCategoryController->create($obj);
        } else {
            $obj = $this->_fundsCategoryController->update($obj);
        }
        
        $result =  $this->getFundsCategory($obj->getId());
        return $result;
    }
    
    /**
     * Returns registry data of FundProject.
     * @see Tinebase_Application_Json_Abstract
     * 
     * @return mixed array 'variable name' => 'data'
     */
    public function getRegistryData()
    {
    	$registryData = array(
            'PromotionAreas' => $this->getPromotionAreas(),
    		'Departments' => $this->getDepartments(),
    		'ProjectRoles' => $this->getProjectRoles(),
    		'FundsKinds' => $this->getFundsKinds(),
    		'FundsCategorys' => $this->getFundsCategorys()
        );
        return $registryData;    
    }
    
    public function getPromotionAreas(){
    	return $this->getRegistryRecords($this->_promotionAreaController->getAllPromotionAreas());
    }
    
    public function getDepartments(){
    	return $this->getRegistryRecords($this->_departmentController->getAllDepartments());
    }
    
    public function getProjectRoles(){
    	return $this->getRegistryRecords($this->_projectRoleController->getAllProjectRoles());
    }
    
    public function getFundsKinds(){
    	return $this->getRegistryRecords($this->_fundsKindController->getAllFundsKinds());
    }
    
    public function getFundsCategorys(){
    	return $this->getRegistryRecords($this->_fundsCategoryController->getAllFundsCategorys());
    }
    
    /**
     * 
     * Get recordset for registry data
     * @param Tinebase_Record_RecordSet $rows
     */
    protected function getRegistryRecords(Tinebase_Record_RecordSet $rows){
    
    	$result = array(
            'results'     => array(),
            'totalcount'  => 0
        );
        
        if($rows) {
            $rows->translate();
            $result['results']      = $rows->toArray();
            $result['totalcount']   = count($result['results']);
        }
        return $result;
    }
}
?>