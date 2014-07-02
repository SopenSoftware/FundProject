<?php
class FundProject_Controller_Appropriation extends Tinebase_Controller_Record_Abstract
{
	/**
	 * config of courses
	 *
	 * @var Zend_Config
	 */
	protected $_config = NULL;
	
	protected $_ommitAfterUpdate = false;

	/**
	 * the constructor
	 *
	 * don't use the constructor. use the singleton
	 */
	private function __construct() {
		$this->_applicationName = 'FundProject';
		$this->_backend = new FundProject_Backend_Appropriation();
		$this->_modelName = 'FundProject_Model_Appropriation';
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

	public function getEmptyAppropriation(){
		$emptyObj = new FundProject_Model_Appropriation(null,true);
		return $emptyObj;
	}
	
 	public function appropriationCanBeConfirmed($appropriationId){
 		$appropriation = $this->get($appropriationId);
    	$project = $appropriation->getForeignRecord('project_id', FundProject_Controller_Project::getInstance());
    	$check1 = (boolean) $project->__get('approval_buha');
    	
    	if(!$check1){
    		$reason1 = FundProject_Controller_Project::REASON_NO_APPROVAL;
    		$message1 = 'Noch keine Freigabe durch Buha erteilt.';
    	}
    	
    	return array(
    		'canAdd' => $check1,
    		'noAddMessages' => array(
    			$message1
    		)
    	);
    }
	
	public function requestAppropriationChange($appropriationId, $data, $changeSet){
		
		$db = Tinebase_Core::getDb();
		$tm = Tinebase_TransactionManager::getInstance();
		$tId = $tm->startTransaction($db);
		
		try{
			if(!is_array($data)){
				$data = Zend_Json::decode($data);
			}
			
			switch($changeSet){
	
				case 'Confirmation':
	
					$this->confirmAppropriation($appropriationId, $data);
					break;
					
				case 'RequestPayout':
					
					$this->requestPayout($appropriationId, $data);
					break;
					
				case 'Payout':
					
					$this->payout($appropriationId, $data, 'PAYOUT');
					break;
					
				case 'Payin':
					
					$this->payout($appropriationId, $data, 'PAYIN');
					break;
					
				case 'Reallocation':
					$this->reallocate($appropriationId, $data);
					break;
					
				case 'Liquidation':
					$this->liquidate($appropriationId, $data);
					break;
					
				case 'Reverse':
					$this->reverse($appropriationId, $data);
					
					break;
			}
			
			// make db changes final
			$tm->commitTransaction($tId);
		
		}catch(Exception $e){
			
			$tm->rollback($tId);
			throw $e;
		}
	}
	
	protected function reallocate($appropriationId, $data){
		
		$this->rebook($appropriationId, $data, 'REALLOCATION');
		
		$projectId = $data['project_id'];
		$newAppropriationId = $data['appropriation_id'];
		
		$this->confirmAppropriation($newAppropriationId, $data, true, 'REALLOCATION');
		
	}
	
	protected function liquidate($appropriationId, $data){
		$this->rebook($appropriationId, $data, 'APPROVALREVOCATION');
	}
	
	protected function reverse($appropriationId, $data){
		$this->rebook($appropriationId, $data, 'CANCELLATION');
	}
	
	protected function rebook($appropriationId, $data, $rebookingType){
		$this->_ommitAfterUpdate = true;
		$appropriation = $this->get($appropriationId);
		$orderId = $appropriation->getForeignId('order_id');
		$amount = (float)$data['confirmed_amount'];
		
		$appropriation->addConfirm((-1)*$amount);
		
		$project = $appropriation->getForeignRecord('project_id', FundProject_Controller_Project::getInstance());
	
		$project->addConfirm((-1)*$amount);
		
		FundProject_Controller_Project::getInstance()->update($project);
		
		$result = $this->createUpdateOrder($appropriation, $order, $amount, Billing_Model_Receipt::TYPE_INVOICE);
		$receiptId = $result['receipts']['invoice']['data']['id'];
		
		$isAmountChange = false;
		$isStateChange = false;
		
		if(array_key_exists('state', $data)){
			$currentState = $appropriation->__get('state');
			$newState = $data['state'];
			if($currentState !== $newState){
				$isStateChange = true;
			}
			$currentAmount = $appropriation->__get('confirmed_amount');;
			$newAmount = $data['confirmed_amount'];
			if($currentAmount !== $newAmount){
				$isAmountChange = true;
			}
			
			$appropriation->__set('state', $newState);
		}
		$this->createRebookingChange($appropriation, (-1)*$amount, $rebookingType, $receiptId, $isStateChange, $isAmountChange);
		
		$this->update($appropriation);
		
		/*
		 		<value>CANCELLATION</value>
				<value>APPROVALREVOCATION</value>
				<value>REALLOCATION</value>
		 */
	}
	
	protected function createRebookingChange( $appropriation, $amount, $rebookingType, $receiptId, $isStateChange=false, $isAmountChange=false ){
		
		/*if((float)$appropriation->__get('confirmed_amount') <= 0){
			
		}*/
		
		$appropriationChangeController = FundProject_Controller_AppropriationChange::getInstance();
		$appropriationChange = $appropriationChangeController->getEmptyAppropriationChange();
		$appropriationChange->__set('appropriation_id',$appropriation->getId());
		$appropriationChange->__set('change_date', new Zend_Date());
		$appropriationChange->__set('change_amount', $amount);
		$appropriationChange->__set('is_state_change', $isStateChange);
		$appropriationChange->__set('is_amount_change', $isAmountChange);
		
		$appropriationChange->__set('is_rebooking', true);
		$appropriationChange->__set('rebooking_kind', $rebookingType);
		
		$appropriationChange->__set('state',$appropriation->__get('state'));
		$appropriationChange->__set('receipt_id', $receiptId);
		
		$appropriationChange = $appropriationChangeController->create($appropriationChange);
		
	}
	
	public function confirmAppropriation($appropriationId, $data, $isRebooking=false,$rebookingType=null){
		$this->_ommitAfterUpdate = true;
		$newOrder = false;
		
		$appropriation = $this->get($appropriationId);
		
		$orderId = $appropriation->getForeignIdBreakNull('order_id');
		
		if(is_null($orderId)){
			$newOrder = true;
		}
		
		$oldData = $appropriation->toArray();
		
		$appropriation->__set('debit_position_date', new Zend_Date());
		
		$amount = (float)$data['confirmed_amount'];
		
		$appropriation->addConfirm($amount);
		$appropriation->__set('state', 'ALLOTED');
		
		$newData = $appropriation->toArray();
		
		
		$appropriationChange = $this->trackChange($oldData, $newData, $isRebooking, $rebookingType);
		
		if($newOrder){
			
			$result = $this->createUpdateOrder($appropriation);
			$receiptId = $result['receipts']['invoice']['data']['id'];
			/*if($appropriationChange){
				$appropriationChange->__set('receipt_id', $receiptId);
			}*/
			$orderId = $result['receipts']['invoice']['data']['order_id'];
			$appropriation->__set('order_id', $orderId);
			
		}else{
			if(is_null($orderId)){
				throw new Exception('Order id is null');
			}
			$order = Billing_Controller_Order::getInstance()->get($orderId);
			
			$result = $this->createUpdateOrder($appropriation, $order, $amount);
			$receiptId = $result['receipts']['invoice']['data']['id'];
			/*if($appropriationChange){
				$appropriationChange->__set('receipt_id', $receiptId);
			}*/
			
		}
		
		$this->update($appropriation);
		
		$project = $appropriation->getForeignRecord('project_id', FundProject_Controller_Project::getInstance());
		
		$project->addConfirm($amount);
		
		FundProject_Controller_Project::getInstance()->update($project);
		
	}
	
	protected function createUpdateOrder($appropriation, $order=null, $amount=null, $receiptType=null){
		if(is_null($receiptType)){
			$receiptType = Billing_Model_Receipt::TYPE_CREDIT;
		}
		
		if(is_null($amount)){
			$amount = (float) $appropriation->__get('confirmed_amount');
		}
		
		if(is_null($order)){
			$projectId = $appropriation->getForeignId('project_id');
			$debitorProjectContact = FundProject_Controller_ProjectContact::getInstance()->getProjectDebitorContact($projectId, 'DEBITOR');
			$debitorContact = $debitorProjectContact->getForeignRecord('contact_id', Addressbook_Controller_Contact::getInstance());
			
			$debitor = Billing_Controller_Debitor::getInstance()->getByContactOrCreate($debitorContact->getId());
			if(!$debitor instanceof Billing_Model_Debitor){
				throw new Exception('No instance Billing_Model_Debitor');
			}
		
			// create order based on order template
			$order = Billing_Controller_Order::getInstance()->createOrderForDebitor($debitor->getId());
		}
		if(!$order instanceof Billing_Model_Order){
			throw new Exception('No instance Billing_Model_Order');
		}

		$orderTemplateId = Tinebase_Core::getPreference('FundProject')->getValue(FundProject_Preference::ORDER_TEMPLATE);
		$op = Billing_Controller_OrderTemplatePosition::getInstance()->getByOrderTemplateId($orderTemplateId);
		$count = 0;
		
		$pos = $op[0];
		$posArray = array(
			'amount' => $pos->__get('amount'),
			'name' => $pos->__get('name'),
			'article_id' => $pos->getForeignId('article_id'),
			'price_group_id' => $pos->getForeignId('price_group_id'),
			'unit_id' => $pos->getForeignId('unit_id'),
			'vat_id' => $pos->getForeignId('vat_id'),
			'price_netto' => $amount,
			'price_brutto' => 0,
			'weight' => $pos->__get('weight'),
			'factor' => 1
		);
		

		$orderPosition = Billing_Controller_OrderPosition::getInstance()->getEmptyOrderPosition(null,true);
		$orderPosition->setFromArray(
			$posArray
		);
		$orderPosition->__set('order_id', $order->getId());
		$orderPosition->__set('position_nr', ++$count);
		Billing_Controller_OrderPosition::getInstance()->calculate($orderPosition);
		$orderPosition = Billing_Controller_OrderPosition::getInstance()->create($orderPosition);

/*		$paymentMethodId =
		Billing_Controller_PaymentMethod::getInstance()
		->getPaymentMethodFromRecordOrDefault($membership, 'fee_payment_method')
		->getId();*/
				
		$params = array(
			'process' => array(
				'billing' => array(
					'active' => true,
					'data' => array(
						'receipt_type' => $receiptType,
						'order_positions' => array(
							$orderPosition
						)
					)
				)
			)
		);

		return Billing_Controller_Order::getInstance()->processOrder($order->getId(), $params);
			
		
	}
	
	protected function payout($appropriationId, $data, $payoutType){
		
		$appropriation = $this->get($appropriationId);
		$project = $appropriation->getForeignRecord('project_id', FundProject_Controller_Project::getInstance());
		
		$appropriationPayoutController = FundProject_Controller_AppropriationPayout::getInstance();
		$appropriationPayout = $appropriationPayoutController->getEmptyAppropriationPayout();
		$appropriationPayout->__set('appropriation_id',$appropriationId);
		
		
		// payout_amount
		// approval_payout_query
		// payout_status
		
		$appropriationPayout->__set('amount', (float)$data['payout_amount']);
		$appropriationPayout->__set('approval_payout_query', true);
		$appropriationPayout->__set('payout_status', 'PAYMENT');
		$appropriationPayout->__set('payout_type', $payoutType);
		
		
		$appropriationPayout->__set('payout_query_date', new Zend_Date());
		$appropriationPayout->__set('approval_payout_date', new Zend_Date());
		if(array_key_exists($data['booking_payout_date']) && $data['booking_payout_date']){
			$appropriationPayout->__set('booking_payout_date', new Zend_Date($data['booking_payout_date']));
			
		}
		
		$appropriationPayout = $appropriationPayoutController->create($appropriationPayout);
	}
	
	protected function requestPayout($appropriationId, $data){
		
		$appropriation = $this->get($appropriationId);
		$project = $appropriation->getForeignRecord('project_id', FundProject_Controller_Project::getInstance());
		
		$appropriationPayoutController = FundProject_Controller_AppropriationPayout::getInstance();
		$appropriationPayout = $appropriationPayoutController->getEmptyAppropriationPayout();
		$appropriationPayout->__set('appropriation_id',$appropriationId);
		
		
		// payout_amount
		// approval_payout_query
		// payout_status
		
		$appropriationPayout->__set('amount', (float)$data['payout_amount']);
		$appropriationPayout->__set('approval_payout_query', $data['approval_payout_query']);
		$appropriationPayout->__set('payout_status', 'QUERY');
		$appropriationPayout->__set('payout_type', 'PAYOUT');
		$appropriationPayout->__set('payout_query_date', new Zend_Date());
		
		$appropriationPayout = $appropriationPayoutController->create($appropriationPayout);
		
		// -> update only by type PAYMENT!!
		// -> request does not have influence on appropriation and project sums
		
		/*$amount = (float)$data['payout_amount'];
		$appropriation->addPayout($amount);
		$project->addPayout($amount);
		
		$this->update($appropriation);
		FundProject_Controller_Project::getInstance()->update($project);*/
		
	}
	
	public function trackChange($oldData, $newData, $isRebooking=false, $rebookingKind=null){
		
		$change = false;
		$isStateChange = false;
		$isAmountChange = false;
		$changeAmount = 0;
		$changeClaimAmount = 0;
		
		if($oldData['state'] != $newData['state']){
			$change = true;
			$isStateChange = true;	
		}
		
		if($oldData['confirmed_amount'] != $newData['confirmed_amount']){
			$change = true;
			$isAmountChange = true;	
			$changeAmount = (float)$newData['confirmed_amount'] - (float)($oldData['confirmed_amount']);
		}
		
		if($oldData['amount'] != $newData['amount']){
			$change = true;
			$isAmountChange = true;	
			$changeClaimAmount = (float)$newData['amount'] - (float)($oldData['amount']);
		}
		
		if($isRebooking){
			$change = true;
		}
		
		$appropriationChange = null;
		if($change){
			$appropriationChangeController = FundProject_Controller_AppropriationChange::getInstance();
			$appropriationChange = $appropriationChangeController->getEmptyAppropriationChange();
			$appropriationChange->__set('appropriation_id',$oldData['id']);
			$appropriationChange->__set('change_date', new Zend_Date());
			$appropriationChange->__set('change_amount', $changeAmount);
			$appropriationChange->__set('change_claim_amount', $changeClaimAmount);
			
			$appropriationChange->__set('is_state_change', $isStateChange);
			$appropriationChange->__set('is_amount_change', $isAmountChange);
			
			if($isRebooking && $rebookingKind){
				$appropriationChange->__set('is_rebooking', $isRebooking);
				$appropriationChange->__set('rebooking_kind', $rebookingKind);
			}
			$appropriationChange->__set('state',$newData['state']);
			
			$appropriationChange = $appropriationChangeController->create($appropriationChange);
			
		}
		return $appropriationChange;
		
	}
	
	
	public function getByNr($number){
		return $this->_backend->getByProperty($number, 'appropriation_nr');	
	}
    /**
     * get attender Appropriations
     *
     * @param string $_sort
     * @param string $_dir
     * @return Tinebase_Record_RecordSet of subtype FundProject_Model_AttenderAppropriation
     * 
     * @todo    use getAll from generic controller
     */
    public function getAllAppropriations($_sort = 'name', $_dir = 'ASC')
    {
        $result = $this->_backend->getAll($_sort, $_dir);
        return $result;    
    }
    
    
    
	protected function _inspectCreate(Tinebase_Record_Interface $_record)
	{
		$_record->setTimezone(Tinebase_Core::get(Tinebase_Core::USERTIMEZONE));
		if(!$_record->__get('appropriation_nr')){
			$_record->__set('appropriation_nr', Tinebase_NumberBase_Controller::getInstance()->getNextNumber('fp_appropriation_nr'));
		}
		$_record->updateRest();
	}
	
	protected function _afterCreate(Tinebase_Record_Interface $_record)
	{
		$phantomFirstRecord = new FundProject_Model_Appropriation(null,true);
		$phantomFirstRecord->setFromArray(
			array(
				'id' => $_record->getId(),
				'state' => null,
				'amount' => 0,
				'payout_amount' => 0,
				'rest_amount' => 0,
				'confirmed_amount' => 0
				
			)
		);
		$changeArray = $_record->toArray();
		//if($_record->__get('state') !== 'ALLOTED'){
			$changeArray['state'] = 'SUBMITTED';
		//}
		
		$this->trackChange($phantomFirstRecord->toArray(),$changeArray);
	}
	
	protected function _inspectUpdate(Tinebase_Record_Interface $_record)
	{
		$_record->updateRest();
	}
	
	protected function _afterUpdate(Tinebase_Record_Interface $oldRecord, Tinebase_Record_Interface $newRecord)
	{
		if(!$this->_ommitAfterUpdate){
			$this->trackChange($oldRecord->toArray(),$newRecord->toArray());
		}
	}
}
?>