<?php
/**
 * Tine 2.0
 *
 * @package     Addressbook
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2007-2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id: Csv.php 12800 2010-02-12 16:08:17Z p.schuele@metaways.de $
 *
 *

 /**
 * csv import class for the addressbook
 *
 * @package     Addressbook
 * @subpackage  Import
 *
 */
class FundProject_Import_ProjectCsv extends Tinebase_Import_Csv_Abstract
{
	/**
	 * the constructor
	 *
	 * @param Tinebase_Model_ImportExportDefinition $_definition
	 * @param mixed $_controller
	 * @param array $_options additional options
	 */
	public function __construct(Tinebase_Model_ImportExportDefinition $_definition, $_controller = NULL, $_options = array())
	{
		parent::__construct($_definition, $_controller, $_options);
	}

	protected function recordExists($recordData){
		$contactId = $recordData['id'];
		try{
			$contact = FundProject_Controller_Project::getInstance()->get($contactId);
			return true;
		}catch(Exception $e){
			return false;
		}
	}

	/**
	 * add some more values (container id)
	 *
	 * @return array
	 */
	protected function _addData($recordData)
	{
		$result = array();
		 
		$stateMap = array(
			1 => 'PROJECT',
			2 => 'CLAIM',
			3 => 'CLAIMFINISHED',
			4 => 'QUERY',
			5 => 'QUERYFINISHED'
		);

		$decisionCommitteeMap = array(
			'Stiftungsvorstand' => 'EXECUTIVE',
			'Geschäftsführung' => 'MANAGEMENT',
			'Stiftungsrat' => 'ADVISER',
			'Umlauf Vorstand' => 'CIRCULATION',
			'VS' => 'VS',
			'' => 'NOVALUE'
		);
		
		$promMap = array(
			'H1',
			'H2',
			'H3',
			'H4',
			'H5',
			'H6',
			'H7',
			'H8',
			'H9',
			'HuK 1',
			'HuK 2',
			'HuK 3',
			'HuK 4',
			'HuK 5',
			'HuK 6',
			'N1',
			'N2',
			'N3',
			'N4',
			'N5',
			'NaS 1',
			'NaS 2',
			'NaS 3',
			'NaS 4',
			'NaS 5',
			'NaS 6'
		);
		
		$result['id'] = $recordData['project_nr'];
		
		try{
		if(($recordData['project_link_nr'] != $recordData['project_nr']) && ($recordData['project_link_nr'] != 0)){
			$relatedProject = FundProject_Controller_Project::getInstance()->getByNr($recordData['project_link_nr']);
			$result['project_id'] = $relatedProject->getId();
		}
		}catch(Exception $e){
			// silent -> linked projects get imported in a second step
		}

		$result['state'] = $stateMap[$recordData['state']];

		$department =  FundProject_Controller_Department::getInstance()->getByName(str_replace('-','',$recordData['department_id']));
		$leadDepartment =  FundProject_Controller_Department::getInstance()->getByName(str_replace('-','',$recordData['leading_department_id']));
		$promKey = 'N.A.';
		foreach($promMap as $key){
			if(strpos((string)$recordData['promotion_area_id'],$key)!==false){
				$promKey = $key;
				break;
			}
		}
		
		
		$promotionArea = FundProject_Controller_PromotionArea::getInstance()->getByKey($promKey);
		
		$result['department_id'] = $department->getId();
		$result['leading_department_id'] = $leadDepartment->getId();
		$result['promotion_area_id'] = $promotionArea->getId();
		 
		if($recordData['query_date']){
			$result['query_date'] = new Zend_Date($recordData['query_date']);
		}else{
			unset($recordData['query_date']);
		}
		 
		if($recordData['claim_entry_date']){
			$result['claim_entry_date'] = new Zend_Date($recordData['claim_entry_date']);
		}else{
			unset($recordData['claim_entry_date']);
		}
		 
		if($recordData['buha_finish_date']){
			$result['buha_finish_date'] = new Zend_Date($recordData['buha_finish_date']);
		}else{
			unset($recordData['buha_finish_date']);
		}
		 
		if($recordData['project_finish_date']){
			$result['project_finish_date'] = new Zend_Date($recordData['project_finish_date']);
		}else{
			unset($recordData['project_finish_date']);
		}
		
		$result['decision_committee'] = $decisionCommitteeMap[$recordData['decision_committee']];
		 
		return $result;
	}

	
 protected function afterImportRecord($record, $recordData){
    	
    	if(array_key_exists('ZUSATZ_10', $recordData) && $recordData['ZUSATZ_10']){
    		
    		try{
	    		$role = FundProject_Controller_ProjectRole::getInstance()->getByKey('DEBITOR');
	    		$contact = Addressbook_Controller_Contact::getInstance()->get($recordData['ZUSATZ_10']);
	    		$projectId = $record->getId();
	    		
	    		$pContact = new FundProject_Model_ProjectContact(null, true);
	    		$pContact->setFromArray(
	    			array(
	    				'project_id' => $projectId,
	    				'contact_id' => $contact->getId(),
	    				'project_role_id' => $role->getId()
	    			)
	    		);
	    		
	    		FundProject_Controller_ProjectContact::getInstance()->create($pContact);
    		}catch(Exception $e){
    			// silent failure
    		}
    	}
    	
 		if(array_key_exists('ZUSATZ_43', $recordData) && $recordData['ZUSATZ_43']){
 			try{
	    		$role = FundProject_Controller_ProjectRole::getInstance()->getByKey('LOC');
	    		$contact = Addressbook_Controller_Contact::getInstance()->get($recordData['ZUSATZ_43']);
	    		$projectId = $record->getId();
	    		
	    		$pContact = new FundProject_Model_ProjectContact(null, true);
	    		$pContact->setFromArray(
	    			array(
	    				'project_id' => $projectId,
	    				'contact_id' => $contact->getId(),
	    				'project_role_id' => $role->getId()
	    			)
	    		);
	    		
	    		FundProject_Controller_ProjectContact::getInstance()->create($pContact);
    		}catch(Exception $e){
    			// silent failure
    		}
    	}
    	
 		if(array_key_exists('OA_43', $recordData) && $recordData['OA_43']){
 			try{
	    		$role = FundProject_Controller_ProjectRole::getInstance()->getByKey('OA');
	    		$contact = Addressbook_Controller_Contact::getInstance()->get($recordData['OA_43']);
	    		$projectId = $record->getId();
	    		
	    		$pContact = new FundProject_Model_ProjectContact(null, true);
	    		$pContact->setFromArray(
	    			array(
	    				'project_id' => $projectId,
	    				'contact_id' => $contact->getId(),
	    				'project_role_id' => $role->getId()
	    			)
	    		);
	    		
	    		FundProject_Controller_ProjectContact::getInstance()->create($pContact);
    		}catch(Exception $e){
    			// silent failure
    		}
    	}
    }
    
  	protected function _importRecord($_recordData, &$_result)
    {
    	
        //if (Tinebase_Core::isLogLevel(Zend_Log::DEBUG)) Tinebase_Core::getLogger()->debug(__METHOD__ . '::' . __LINE__ . ' ' . print_r($_recordData, true));
        if(!$this->recordExists($_recordData)){
        	$record = new $this->_modelName($_recordData, TRUE);
        }else{
        	$record = $this->_controller->get($_recordData['id']);
        	$origRecordData = $record->toArray();
        	$_recordData = array_merge($origRecordData, $_recordData);
        	
    		$record->setFromArray($_recordData);
        }
        if ($record->isValid()) {
            if (! $this->_options['dryrun']) {
                
                if(!$this->recordExists($_recordData)){
	                $record = call_user_func(array($this->_controller, $this->_createMethod), $record);
	                
	                // do after import stuff
	                call_user_func(array($this,'afterImportRecord'),$record,$_recordData);
				}else{
					 $record = call_user_func(array($this->_controller, 'update'), $record);
				
				}
            } else {
                $_result['results']->addRecord($record);
            }
            
            $_result['totalcount']++;
            
        } else {
        	$_result['failcount']++;
            //if (Tinebase_Core::isLogLevel(Zend_Log::DEBUG)) Tinebase_Core::getLogger()->debug(__METHOD__ . '::' . __LINE__ . ' ' . print_r($record->toArray(), true));
            $fp = fopen('/var/www/vhosts/sopenapp.de/httpdocs/stage/web/nrw/conf/logs/import_error.log','a+');
			$a = $record->getValidationErrors();
            fwrite($fp, print_r($record->toArray(),true).print_r($a,true));
            fclose($fp);
        	
        	throw new Tinebase_Exception_Record_Validation('Imported record is invalid.');
        }
    }
	
	/*protected function _importRecord($_recordData, &$_result)
	{
		$record = new $this->_modelName($_recordData, TRUE);

		if ($record->isValid()) {
			if (! $this->_options['dryrun']) {

				$record = call_user_func(array($this->_controller, $this->_createMethod), $record);
			} else {
				$_result['results']->addRecord($record);
			}

			$_result['totalcount']++;

		} else {
			if (Tinebase_Core::isLogLevel(Zend_Log::DEBUG)) Tinebase_Core::getLogger()->debug(__METHOD__ . '::' . __LINE__ . ' ' . print_r($record->toArray(), true));
			throw new Tinebase_Exception_Record_Validation('Imported record is invalid.');
		}
	}*/

	/**
	 * do conversions
	 * -> sanitize account_id
	 *
	 * @param array $_data
	 * @return array
	 */
	protected function _doConversions($_data)
	{
		$result = parent::_doConversions($_data);

		return $result;
	}
}