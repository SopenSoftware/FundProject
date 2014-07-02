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
class FundProject_Import_AppropriationCsv extends Tinebase_Import_Csv_Abstract
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
			$contact = FundProject_Controller_Appropriation::getInstance()->get($contactId);
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
			'bewilligt' => 'ALLOTED',
			'beantragt' => 'SUBMITTED',
			'abgelehnt' => 'REJECTED',
			'umgewidmet' => 'REASSIGNED'
		);
		
		$decisionCommitteeMap = array(
			'Stiftungsvorstand' => 'EXECUTIVE',
			'Geschäftsführung' => 'MANAGEMENT',
			'Stiftungsrat' => 'ADVISER',
			'Umlauf Vorstand' => 'CIRCULATION',
			'VS' => 'VS',
			'' => 'NOVALUE'
		);
		
		$project = FundProject_Controller_Project::getInstance()->getByNr($recordData['project_id']);
		$result['project_id'] = $project->getId();
		
		$fCatName = '...keine Auswahl...';
		if($recordData['funds_category_id']){
			$fCatName = $recordData['funds_category_id'];
		}
		$fundsCategory = FundProject_Controller_FundsCategory::getInstance()->getByName($fCatName);
		
		$fKindName = '...keine Auswahl...';
		if($recordData['funds_kind_id']){
			$fKindName = $recordData['funds_kind_id'];
		}
		$fundsKind = FundProject_Controller_FundsKind::getInstance()->getByName($fKindName);
		
		$result['funds_category_id'] = $fundsCategory->getId();
		$result['funds_kind_id'] = $fundsKind->getId();
		
		$result['state'] = $stateMap[$recordData['state']];
    	$result['decision_committee'] = $decisionCommitteeMap[$recordData['decision_committee']];
    	
    	if($recordData['decision_date']){
			$result['decision_date'] = new Zend_Date($recordData['decision_date']);
		}else{
			unset($recordData['decision_date']);
		}
		 
		if($recordData['debit_position_date']){
			$result['debit_position_date'] = new Zend_Date($recordData['debit_position_date']);
		}else{
			unset($recordData['debit_position_date']);
		}
		$result['amount'] = (float) str_replace(',','.',$recordData['amount']);
		$result['proposal_amount'] = (float) str_replace(',','.',$recordData['proposal_amount']);
		return $result;
    }
    
	protected function afterImportRecord($record, $recordData){
		if($recordData['UMGEWIDMET'] != 'T'){
        				$type = 'Confirmation';
        				$amount = (float)$recordData['amount'];
        				if((float)$recordData['amount']<0){
        					$type = 'Liquidation';
        					$amount *= (-1);
        				}
        				$this->_controller->requestAppropriationChange($record->getId(), array('confirmed_amount'=> $amount), $type);
        			}else{
        				$this->_controller->confirmAppropriation($record->getId(), array('confirmed_amount'=> $recordData['amount']), true, 'REALLOCATION');
        			}
    	
    }
    
  	protected function _importRecord($_recordData, &$_result)
    {
    	
    	
    	if($_recordData['state']!='REJECTED'){
    		
    	//if($_recordData['state']!='SUBMITTED'){
    		return true;
    	}
    	
    	
        //if (Tinebase_Core::isLogLevel(Zend_Log::DEBUG)) Tinebase_Core::getLogger()->debug(__METHOD__ . '::' . __LINE__ . ' ' . print_r($_recordData, true));
        if(!$this->recordExists($_recordData)){
        	$record = new $this->_modelName($_recordData, TRUE);
        		    	
        }else{
        	$record = $this->_controller->get($_recordData['id']);
	     
        	switch($_recordData['state']){
        		
        		case 'SUBMITTED':
        			return true;
        			//break;
        			
        		case 'REJECTED':
        			$this->_controller->requestAppropriationChange($record->getId(), array('confirmed_amount'=> $_recordData['amount'], 'state'=>'REJECTED'), 'Liquidation');
					break;
        			
        		case 'ALLOTED':
        			if($_recordData['UMGEWIDMET'] != 'T'){
        				$type = 'Confirmation';
        				$amount = (float)$_recordData['amount'];
        				if((float)$_recordData['amount']<0){
        					$type = 'Liquidation';
        					$amount *= (-1);
        				}
        				$this->_controller->requestAppropriationChange($record->getId(), array('confirmed_amount'=> $amount), $type);
        			}else{
        				$this->_controller->confirmAppropriation($record->getId(), array('confirmed_amount'=> $_recordData['amount']), true, 'REALLOCATION');
        			}
					break;
        			
        		case 'REASSIGNED':
        			$this->_controller->confirmAppropriation($record->getId(), array('confirmed_amount'=> $_recordData['amount']), true, 'REALLOCATION');
        			break;
        	}
        	
        	//$record = call_user_func(array($this->_controller, 'update'), $record);
        	$_result['results']->addRecord($record);
        	$_result['totalcount']++;
        	return true;
        	
    		
        }
        if ($record->isValid()) {
            if (! $this->_options['dryrun']) {
                
                if(!$this->recordExists($_recordData)){
	                $record = call_user_func(array($this->_controller, $this->_createMethod), $record);
	                
                	if($_recordData['state']=='ALLOTED'){
                		call_user_func(array($this,'afterImportRecord'),$record,$_recordData);
			    	}
	                
	                // do after import stuff
	                
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