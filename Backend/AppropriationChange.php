<?php
class FundProject_Backend_AppropriationChange extends Tinebase_Backend_Sql_Abstract
{
    /**
     * Table name without prefix
     *
     * @var string
     */
    protected $_tableName = 'fp_appropriation_change';
    
    /**
     * Model name
     *
     * @var string
     */
    protected $_modelName = 'FundProject_Model_AppropriationChange';

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
    
    /**
     * Append contacts by foreign key (record embedding)
     * 
     * @param Tinebase_Record_Abstract $record
     * @return void
     */
    protected function appendDependentRecords($record){
      Tinebase_User::getInstance()->resolveUsers($record, 'created_by');
    	Tinebase_User::getInstance()->resolveUsers($record, 'last_modified_by');
    	if($record->__get('appropriation_id')){
			$this->appendForeignRecordToRecord($record, 'appropriation_id', 'appropriation_id', 'id', new FundProject_Backend_Appropriation());
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