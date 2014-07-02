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
class FundProject_Import_AppropriationPayoutCsv extends Tinebase_Import_Csv_Abstract
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

    
    /**
     * add some more values (container id)
     *
     * @return array
     */
    protected function _addData($recordData)
    {
    	$result = array();

    	$stateMap = array(
			'Auszahlung' => 'PAYOUT',
			'Einzahlung' => 'PAYIN',
			'Anfrage' => 'QUERY',
			'' => 'NOVALUE'
		);
		
		$appro = FundProject_Controller_Appropriation::getInstance()->getByNr($recordData['appropriation_id']);
		$result['appropriation_id'] = $appro->getId();
		
		$result['payout_status'] = $stateMap[$recordData['payout_status']];
    	
    	if($recordData['payout_date']){
			$result['payout_date'] = new Zend_Date($recordData['payout_date']);
		}else{
			unset($recordData['payout_date']);
		}
		 
		if($recordData['booking_payout_date']){
			$result['booking_payout_date'] = new Zend_Date($recordData['booking_payout_date']);
		}else{
			unset($recordData['booking_payout_date']);
		}
		
    	if($recordData['approval_payout_date']){
			$result['approval_payout_date'] = new Zend_Date($recordData['approval_payout_date']);
		}else{
			unset($recordData['approval_payout_date']);
		}
		
		$result['amount'] = (float) str_replace(',','.',$recordData['amount']);
		
		return $result;
    }
    
	protected function _importRecord($_recordData, &$_result)
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
    }
    
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