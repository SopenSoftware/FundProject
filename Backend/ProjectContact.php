<?php
class FundProject_Backend_ProjectContact extends Tinebase_Backend_Sql_Abstract
{
    /**
     * Table name without prefix
     *
     * @var string
     */
    protected $_tableName = 'fp_project_contact';
    
    /**
     * Model name
     *
     * @var string
     */
    protected $_modelName = 'FundProject_Model_ProjectContact';

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

		$record->__set('company', '');
		$record->__set('plz', '');
		$record->__set('location', '');
		
		
		if($record->__get('project_id')){
			$this->appendForeignRecordToRecord($record, 'project_id', 'project_id', 'id', new FundProject_Backend_Project());
		}
		if($record->__get('project_role_id')){
			$this->appendForeignRecordToRecord($record, 'project_role_id', 'project_role_id', 'id', new FundProject_Backend_ProjectRole());
		}
		if($record->__get('contact_id')){
			$contact = $record->getForeignRecord('contact_id', Addressbook_Controller_Contact::getInstance());
			$address = $contact->getLetterAddress();
			$record->__set('company', $contact->__get('org_name').' '.$contact->__get('company2'));
			$record->__set('plz', $address->getPostalCode());
			$record->__set('location', $address->getLocation());
			
			$this->appendForeignRecordToRecord($record, 'contact_id', 'contact_id', 'id', Addressbook_Backend_Factory::factory(Addressbook_Backend_Factory::SQL));
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