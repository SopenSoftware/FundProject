<?php
class FundProject_Backend_Appropriation extends Tinebase_Backend_Sql_Abstract
{
    /**
     * Table name without prefix
     *
     * @var string
     */
    protected $_tableName = 'fp_appropriation';
    
    /**
     * Model name
     *
     * @var string
     */
    protected $_modelName = 'FundProject_Model_Appropriation';

    /**
     * if modlog is active, we add 'is_deleted = 0' to select object in _getSelect()
     *
     * @var boolean
     */
    protected $_modlogActive = false;
    
	public function search(Tinebase_Model_Filter_FilterGroup $_filter = NULL, Tinebase_Model_Pagination $_pagination = NULL, $_onlyIds = FALSE){
		// no ids searchable
		// check if needed anywhere and modify if so
		$recordSet = parent::search($_filter,$_pagination,$_onlyIds);
		if( ($recordSet instanceof Tinebase_Record_RecordSet) && ($recordSet->count()>0)){
			$it = $recordSet->getIterator();
			foreach($it as $key => $record){
				$this->appendDependentRecords($record);
			}
		}
		return $recordSet;
	}
    
   public function getAll($_orderBy = 'id', $_orderDirection = 'ASC', $deepNesting = false, $foreignEmbedding = true) 
    {
    	$recordSet = parent::getAll($_orderBy,$_orderDirection);
		if( ($recordSet instanceof Tinebase_Record_RecordSet) && ($recordSet->count()>0)){
			$it = $recordSet->getIterator();
			foreach($it as $key => $record){
				$this->appendDependentRecords($record, $deepNesting, $foreignEmbedding);
			}
		}
		return $recordSet;
    }

	/**
	 * Append contacts by foreign key (record embedding)
	 *
	 * @param Tinebase_Record_Abstract $record
	 * @return void
	 */
	protected function appendDependentRecords($record, $deepNesting = false, $foreignEmbedding = true){
//		if($foreignEmbedding){
//			if($record->__get('project_id')){
//				$this->appendForeignRecordToRecord($record, 'project_id', 'project_id', 'id', new FundProject_Backend_Project());
//			}
//		}
		Tinebase_User::getInstance()->resolveUsers($record, 'created_by');
    	Tinebase_User::getInstance()->resolveUsers($record, 'last_modified_by');
		if($record->__get('project_id')){
			$this->appendForeignRecordToRecord($record, 'project_id', 'project_id', 'id', new FundProject_Backend_Project());
		}
		if($record->__get('funds_category_id')){
			$this->appendForeignRecordToRecord($record, 'funds_category_id', 'funds_category_id', 'id', new FundProject_Backend_FundsCategory());
		}
		if($record->__get('funds_kind_id')){
			$this->appendForeignRecordToRecord($record, 'funds_kind_id', 'funds_kind_id', 'id', new FundProject_Backend_FundsKind());
		}
		if($record->__get('order_id')){
    		$this->appendForeignRecordToRecord($record, 'order_id', 'order_id', 'id', new Billing_Backend_Order());
       }
	}
    /**
     * Get FundProject record by id (with embedded dependent contacts)
     * 
     * @param int $id
     */
    public function get($id, $_getDeleted = FALSE){
    	$record = parent::get($id, $_getDeleted);
    	$this->appendDependentRecords($record);
    	return $record;
    }    
}
?>