<?php
class FundProject_Controller_AppropriationPayout extends Tinebase_Controller_Record_Abstract
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
		$this->_backend = new FundProject_Backend_AppropriationPayout();
		$this->_modelName = 'FundProject_Model_AppropriationPayout';
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

	public function getEmptyAppropriationPayout(){
		$emptyObj = new FundProject_Model_AppropriationPayout(null,true);
		return $emptyObj;
	}
	
	
	public function requestAppropriationPayoutChange($ids, $requestType){
		
		if(!is_array($ids)){
			$ids = Zend_Json::decode($ids);
		}
		if(count($ids)>0 || $requestType=='EXECDUE'){
			$db = Tinebase_Core::getDb();
			$tm = Tinebase_TransactionManager::getInstance();
			$tId = $tm->startTransaction($db);
			
			try{
				switch($requestType){
					case 'RELEASE':
						$this->releasePayout($ids);
					break;
					
					case 'EXEC':
						$this->execPayout($ids);
						break;
						
					case 'EXECDUE':
						$this->execDuePayout();
						break;
				}
				
				$tm->commitTransaction($tId);
			}catch(Exception $e){
				$tm->rollBack($tId);
				throw $e;
			}
		}
		
	
	}
	
	protected function releasePayout($ids){
		foreach($ids as $payoutId){
			$payout = $this->get($payoutId);
			$payout->__set('approval_payout_date',new Zend_Date());
			$payout->__set('payout_status','PAYMENT');
			$this->update($payout);
		}
	}
	
	protected function execPayout($ids){
		$payouts = array();
		
		foreach($ids as $payoutId){
			$payout = $this->get($payoutId);
			// do not process payouts matching the following conditions
			if(	($payout->__get('payout_type')=='PAYIN') ||
				($payout->__get('payout_status')=='QUERY') ||
				($payout->__get('payout_date')) ||
				(!$payout->__get('approval_payout_date'))
			){
				continue;
			}
			
			$payouts[] = $payout;
		}
		
		$this->generateDTA($payouts);
	}
	
	protected function execDuePayout(){
		$filters = array();
		
		$filters[] = array(
    			'field' => 'payout_type',
    			'operator' => 'equals',
    			'value' => 'PAYOUT'
		);
		
		$filters[] = array(
    			'field' => 'payout_status',
    			'operator' => 'equals',
    			'value' => 'PAYMENT'
		);
		
		$filters[] = array(
    			'field' => 'approval_payout_date',
    			'operator' => 'notnull'
		);
		
		$filters[] = array(
    			'field' => 'payout_date',
    			'operator' => 'isnull'
		);

		$filter = new FundProject_Model_AppropriationPayoutFilter($filters, 'AND');
			
		$payoutIds =  $this->search(
			$filter,
			new Tinebase_Model_Pagination(array('sort' => 'approval_payout_date', 'dir' => 'ASC')),
			null, // no relations, standard param
			true 	// get ids only!
		);
		
		$this->execPayout($payoutIds);
		
	}
	
	public function generateDTA($payouts){
    		require_once 'Payment/DTA.php';

    		$tempFilePath = CSopen::instance()->getCustomerPath().'/customize/data/documents/temp/';
			
			// TODO: where to get bankacount?
			// -> temporary: from config file
			// -> must be extended in ERP
			$mandators = \Tinebase_Config::getInstance()->getConfig('mandators', NULL, TRUE)->value;
			$mandator = $mandators[1]['bankdata'];
			$hash = md5(serialize($mandator).microtime());
			
			$dtaFile = new DTA(DTA_CREDIT);
			$dtaFile->setAccountFileSender(
				array(
				        "name"           => $mandator['account_holder'],
				        "bank_code"      => $mandator['bank_code'],
				        "account_number" => $mandator['account_number']
				)
			);
			
			foreach($payouts as $payout){
				
				$appropriation = $payout->getForeignRecord('appropriation_id', FundProject_Controller_Appropriation::getInstance());
				$project = $appropriation->getForeignRecord('project_id', FundProject_Controller_Project::getInstance());
				$projectId = $project->getId();
				$projectDebitorContact = FundProject_Controller_ProjectContact::getInstance()->getProjectDebitorContact($projectId, 'DEBITOR');
				$debitorContact = $projectDebitorContact->getForeignRecord('contact_id', Addressbook_Controller_Contact::getInstance());
				
				$val = $payout->__get('amount');
				
				
				$dtaFile->addExchange(
					array(
				        "name"          	=> $debitorContact->__get('bank_account_name'),
			        	"bank_code"      	=> $debitorContact->__get('bank_code'),
			        	"account_number" 	=> $debitorContact->__get('bank_account_number')
					),
					(string)$val,                 	// Amount of money.
					array(                  		// Description of the transaction ("Verwendungszweck").
				        "Auszahlung Fördermittel - Projekt ". $project->__get('short_name'),
				        $appropriation->__get('name')
					)
				);
				
				$payout->__set('payout_date',new Zend_Date());
				$this->update($payout);
			}
			
			$dtaFile->saveFile($tempFilePath.'DTAUS0'.$hash);
			$meta = $dtaFile->getMetaData();
				
			$date	= strftime("%d.%m.%y", $meta["date"]);
			$execDate	=strftime("%d.%m.%y", $meta["exec_date"]);
			$count	=$meta["count"];
			$sumEUR	= $meta["sum_amounts"];
			$sumKto	=$meta["sum_accounts"];
			$sumBankCodes	= $meta["sum_bankcodes"];

			$sender	=$mandator['account_holder'];
			$senderBank	= $mandator['bank'];
			$senderBankCode	= $mandator['bank_code'];
			$senderAccount	=$mandator['account_number'];
				
			$handoutContent = "Datenträger-Begleitzettel
	Erstellungsdatum: $date 
	Ausführungsdatum: $execDate
	Anzahl der Überweisungen: $count
	Summe der Beträge in EUR: $sumEUR
	Kontrollsumme Kontonummern: $sumKto
	Kontrollsumme Bankleitzahlen: $sumBankCodes
	Auftraggeber: $sender
	Beauftragtes Bankinstitut: $senderBank
	Bankleitzahl: $senderBankCode
	Kontonummer: $senderAccount";

			$zip = new ZipArchive();
			$filename = "$tempFilePath/DTAUS0-$ogNr.zip";
				
			if ($zip->open($filename, ZIPARCHIVE::CREATE)!==TRUE) {
				exit("cannot open <$filename>\n");
			}
				
			$zip->addFromString("begleitzettel.txt", $handoutContent);
			$zip->addFile($tempFilePath.'DTAUS0'.$hash, 'DTAUS0');
			$zip->close();

			header("Content-type: application/zip;\n");
			header("Content-Transfer-Encoding: binary");
			$len = filesize($filename);
			header("Content-Length: $len;\n");
			$outname="DTAUS0-$ogNr.zip";
			header("Content-Disposition: attachment; filename=\"$outname\";\n\n");
				
			readfile($filename);
				
			unlink($filename);
			
			// TEST : rollback transaction in order to execute it multiple
			
	}
	
    /**
     * get attender AppropriationPayouts
     *
     * @param string $_sort
     * @param string $_dir
     * @return Tinebase_Record_RecordSet of subtype FundProject_Model_AttenderAppropriationPayout
     * 
     * @todo    use getAll from generic controller
     */
    public function getAllAppropriationPayouts($_sort = 'name', $_dir = 'ASC')
    {
        $result = $this->_backend->getAll($_sort, $_dir);
        return $result;    
    }
    
	protected function _inspectCreate(Tinebase_Record_Interface $_record)
	{
		$amount = (float)$_record['amount'];
		if($_record->__get('payout_type')=='PAYOUT'){
			if($amount < 0){
				$_record->__set('amount', (-1)*$amount);
			}
		}else{
			if($amount > 0){
				$_record->__set('amount', (-1)*$amount);
			}
		}
		/*if($_record->__get('approval_payout_query')){
			if(!$_record->__get('approval_payout_date')){
				$_record->__set('approval_payout_date', new Zend_Date());
			}
		}*/
	}
	
	protected function _inspectUpdate(Tinebase_Record_Interface $_record)
	{
		$amount = (float)$_record['amount'];
		if($_record->__get('payout_type')=='PAYOUT'){
			if($amount < 0){
				$_record->__set('amount', (-1)*$amount);
			}
		}else{
			if($amount > 0){
				$_record->__set('amount', (-1)*$amount);
			}
		}
		/*if($_record->__get('approval_payout_query')){
			if(!$_record->__get('approval_payout_date')){
				$_record->__set('approval_payout_date', new Zend_Date());
			}
		}*/
		/*if($_record->__get('payout_status')=='PAYMENT'){
			if(!$_record->__get('payout_date')){
				$_record->__set('payout_date', new Zend_Date());
			}
		}*/
	}
	
	private function updateDependent($_record, $amount){
		
		if(abs($amount)>0 && $_record->__get('payout_status') == 'PAYMENT'){
			$appropriation = $_record->getForeignRecord('appropriation_id', FundProject_Controller_Appropriation::getInstance());
			$project = $appropriation->getForeignRecord('project_id', FundProject_Controller_Project::getInstance());
			
			$appropriation->addPayout($amount);
			$project->addPayout($amount);
			
			FundProject_Controller_Appropriation::getInstance()->update($appropriation);
			FundProject_Controller_Project::getInstance()->update($project);
		}
	}
	
	protected function _afterCreate(Tinebase_Record_Interface $_record)
	{
		$this->updateDependent($_record, $_record->__get('amount'));
	}
	
	protected function _afterUpdate(Tinebase_Record_Interface $oldRecord, Tinebase_Record_Interface $newRecord)
	{
		if(!$this->_ommitAfterUpdate){
			$newAmount = (float)$newRecord->__get('amount');
			$oldAmount = (float)$oldRecord->__get('amount');
			
			$stateChange = (($oldRecord->__get('payout_status') == 'QUERY') && ($newRecord->__get('payout_status') == 'PAYMENT'));
			$amountChange = false;
			if($newAmount!=$oldAmount){
				$amountChange = true;
				$amount = $newAmount-$oldAmount;
			}
			
			if($stateChange){
				$this->updateDependent($newRecord, $newAmount);
			}elseif($amountChange){
				$this->updateDependent($newRecord, $amount);
			}
		
		}
	}
}
?>