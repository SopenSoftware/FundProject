<?php

/**
 * class to hold Project data
 *
 * @package     FundProject
 */
class FundProject_Model_Project extends Tinebase_Record_Abstract
{
	/**
	 * key in $_validators/$_properties array for the filed which
	 * represents the identifier
	 *
	 * @var string
	 */
	protected $_identifier = 'id';

	/**
	 * application the record belongs to
	 *
	 * @var string
	 */
	protected $_application = 'FundProject';

	/**
	 * list of zend validator
	 *
	 * this validators get used when validating user generated content with Zend_Input_Filter
	 *
	 * @var array
	 *
	 */
	//
	/*
	 * ?
	 *   Projektverbund-Nr
	 *   entscheid. Gremium -> decision_committee (derz. einfache Enum, lt. Modell)
	 *   -> Vererbung auf Fördermittel? ja
	 *   
	 *   Fehlt:
	 *   - Abstimmung Pressetermine
	 *   - Abstimmuing Programm
	 *   - Zusendung Presseberichte
	 *   - Pressemitteilungen
	 *   - Schild Status
	 *   - Schild Grafik
	 *   - Baustellen-Schild
	 *   - Fahne
	 *   - Abdruck Logo
	 *   - Grußwort
	 *   - Infomaterial
	 *   - Link auf NRW-Stiftung
	 *   - Fotos
	 *   - Link Fotos
	 *   - Bemerkung ÖA
	 *   
	 */
	protected $_validators = array(
        'id'                    => array(Zend_Filter_Input::ALLOW_EMPTY => true, Zend_Filter_Input::DEFAULT_VALUE => NULL),
        'project_id'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),		//Project
   		'department_id'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),	//Referat
		'leading_department_id'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),	//federf. Referat
   		'correspondent_user_id'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),	// Berichterstatter
   		'approval_user_id'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),	// Freigabe durch
		'promotion_area_id'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),  //Förderbereich
   		'project_nr'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),	// Projektnummer
		'short_name'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),	// Kurztitel
   		'name'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),	    // Titel
		'description'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),	//Beschreibung
   		'state'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),			// Projekt-Status
		'agenda_topic'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),	// Sitzung TOP
   		'approval_buha'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),  //Freigabe BUHA
		'claim_entry_date'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true), // Eingang Antrag
   		'buha_finish_date'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true), // rechn. Abschluss
		'project_finish_date'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),	//Projektabschluss
   		'pr_contact_date'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true), // Kontaktaufn. ÖA
		'pr_opening_date'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),	// Eröffnung ÖA
   		'pr_other_date'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true), // sonst. Termin ÖA
		'decision_committee'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true), //entsch. Gremium (enum)
   		'payment_svn_rate'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),  // Auszahlung vor SVN %
		'query_date'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),  // Eingang Antrag
   		'monthly_list'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),  // monatl. Liste
		
   		'aquisition_state'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),  // Status Erwerb
   		
		'amount'            => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'proposal_amount'         => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'payout_amount'      => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'confirmed_amount'    => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'rest_amount'            => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        	
	
		'created_by'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'creation_time'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
   		'last_modified_by'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'last_modified_time'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
   		'is_deleted'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
		'deleted_by'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
   		'deleted_time'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
	
		'tags'                  => array(Zend_Filter_Input::ALLOW_EMPTY => true),
        'notes'                 => array(Zend_Filter_Input::ALLOW_EMPTY => true)
	);
	protected $_dateFields = array(
	// modlog
     	'creation_time',
        'last_modified_time',
        'deleted_time'
	);
	
public function setFromArray(array $_data)
	{
		if(empty($_data['claim_entry_date']) || $_data['claim_entry_date']=="" ){
			$_data['claim_entry_date'] = null;
		}				
		if(empty($_data['buha_finish_date']) || $_data['buha_finish_date']=="" ){
			$_data['buha_finish_date'] = null;
		}		
		if(empty($_data['project_finish_date']) || $_data['project_finish_date']=="" ){
			$_data['project_finish_date'] = null;
		}			
		if(empty($_data['pr_contact_date']) || $_data['pr_contact_date']=="" ){
			$_data['pr_contact_date'] = null;
		}
		if(empty($_data['pr_opening_date']) || $_data['pr_opening_date']=="" ){
			$_data['pr_opening_date'] = null;
		}			
		if(empty($_data['pr_other_date']) || $_data['pr_other_date']=="" ){
			$_data['pr_other_date'] = null;
		}
		if(empty($_data['query_date']) || $_data['query_date']=="" ){
			$_data['query_date'] = null;
		}
		parent::setFromArray($_data);
	}

	protected function _setFromJson(array &$_data)
	{
			if(empty($_data['claim_entry_date']) || $_data['claim_entry_date']=="" ){
			$_data['claim_entry_date'] = null;
		}				
		if(empty($_data['buha_finish_date']) || $_data['buha_finish_date']=="" ){
			$_data['buha_finish_date'] = null;
		}		
		if(empty($_data['project_finish_date']) || $_data['project_finish_date']=="" ){
			$_data['project_finish_date'] = null;
		}			
		if(empty($_data['pr_contact_date']) || $_data['pr_contact_date']=="" ){
			$_data['pr_contact_date'] = null;
		}
		if(empty($_data['pr_opening_date']) || $_data['pr_opening_date']=="" ){
			$_data['pr_opening_date'] = null;
		}			
		if(empty($_data['pr_other_date']) || $_data['pr_other_date']=="" ){
			$_data['pr_other_date'] = null;
		}
		if(empty($_data['query_date']) || $_data['query_date']=="" ){
			$_data['query_date'] = null;
		}
	}
	
	public function addPayout($amount){
		$this->__set('payout_amount', (float)$this->__get('payout_amount') + (float) $amount);
	}
	
	public function addConfirm($amount){
		$this->__set('confirmed_amount', (float)$this->__get('confirmed_amount') + (float) $amount);
	}
	
	
	public function updateRest(){
		$payoutAmount = (float) $this->__get('payout_amount');
		$confirmedAmount = (float) $this->__get('confirmed_amount');
		
		$this->__set('rest_amount', $confirmedAmount - $payoutAmount);
	}
}