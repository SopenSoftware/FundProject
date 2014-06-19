<?php
/**
 *
 *
 * @author hhartl
 *
 */

/**
 * Migration of Brevetation app
 */

class FundProject_Setup_Update_Release1 extends Setup_Update_Abstract{
	/**
	 * Add column is_default to price_group
	 */
	public function update_0(){
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>decision_committee</name>
                    <type>enum</type>
					<value>EXECUTIVE</value>
					<value>MANAGEMENT</value>
					<value>ADVISER</value>
					<value>CIRCULATION</value>
					<value>VS</value>
					<value>NOVALUE</value>
					<default>EXECUTIVE</default>
					<notnull>true</notnull>
                </field>');
		$this->_backend->alterCol('fp_project', $declaration);
		$this->setApplicationVersion('FundProject', '1.1');
	}
	
	public function update_1(){
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>decision_committee</name>
                    <type>enum</type>
					<value>EXECUTIVE</value>
					<value>MANAGEMENT</value>
					<value>ADVISER</value>
					<value>CIRCULATION</value>
					<value>VS</value>
					<value>NOVALUE</value>
					<default>EXECUTIVE</default>
					<notnull>true</notnull>
                </field>');
		$this->_backend->alterCol('fp_appropriation', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>state</name>
                    <type>enum</type>
					<value>SUBMITTED</value>
					<value>ALLOTED</value>
					<value>REJECTED</value>
					<value>REASSIGNED</value>
					<default>SUBMITTED</default>
                    <notnull>true</notnull>
                </field>');
		$this->_backend->alterCol('fp_appropriation', $declaration);
		
		$this->setApplicationVersion('FundProject', '1.2');
	}
	
	public function update_2(){
				
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
                </field>');
		$this->_backend->alterCol('fp_appropriation', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>proposal_amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
                </field>');
		$this->_backend->alterCol('fp_appropriation', $declaration);
		
		$this->setApplicationVersion('FundProject', '1.3');
	}
	
	public function update_3(){
				
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>payout_status</name>
                    <type>enum</type>
					<value>QUERY</value>
					<value>PAYOUT</value>
					<value>PAYIN</value>
					<value>NOVALUE</value>
					<default>PAYOUT</default>
                    <notnull>true</notnull>
                </field>');
		$this->_backend->addCol('fp_appropriation_payout', $declaration);
		
		$this->setApplicationVersion('FundProject', '1.31');
	}
	
	public function update_31(){
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>state</name>
                    <type>enum</type>
					<value>SUBMITTED</value>
					<value>ALLOTED</value>
					<value>REJECTED</value>
					<value>REASSIGNED</value>
					<default>SUBMITTED</default>
                    <notnull>true</notnull>
                </field>');
		$this->_backend->addCol('fp_appropriation_change', $declaration);
		
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>created_by</name>
                    <type>text</type>
                    <length>40</length>
                </field>');
		$this->_backend->addCol('fp_appropriation_change', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>creation_time</name>
                    <type>datetime</type>
                </field>');
		$this->_backend->addCol('fp_appropriation_change', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>last_modified_by</name>
                    <type>text</type>
                    <length>40</length>
                </field>');
		$this->_backend->addCol('fp_appropriation_change', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				 <field>
                    <name>last_modified_time</name>
                    <type>datetime</type>
                </field>');
		$this->_backend->addCol('fp_appropriation_change', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>is_deleted</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>');
		$this->_backend->addCol('fp_appropriation_change', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>deleted_by</name>
                    <type>text</type>
                    <length>40</length>
                </field>');
		$this->_backend->addCol('fp_appropriation_change', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>deleted_time</name>
                    <type>datetime</type>
                </field>');
		$this->_backend->addCol('fp_appropriation_change', $declaration);
		
		
        		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>created_by</name>
                    <type>text</type>
                    <length>40</length>
                </field>');
		$this->_backend->addCol('fp_appropriation', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>creation_time</name>
                    <type>datetime</type>
                </field>');
		$this->_backend->addCol('fp_appropriation', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>last_modified_by</name>
                    <type>text</type>
                    <length>40</length>
                </field>');
		$this->_backend->addCol('fp_appropriation', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				 <field>
                    <name>last_modified_time</name>
                    <type>datetime</type>
                </field>');
		$this->_backend->addCol('fp_appropriation', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>is_deleted</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>');
		$this->_backend->addCol('fp_appropriation', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>deleted_by</name>
                    <type>text</type>
                    <length>40</length>
                </field>');
		$this->_backend->addCol('fp_appropriation', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>deleted_time</name>
                    <type>datetime</type>
                </field>');
		$this->_backend->addCol('fp_appropriation', $declaration);
	
		
		$this->setApplicationVersion('FundProject', '1.32');
	}
	
	public function update_32(){
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>order_id</name>
                    <type>integer</type>
                    <notnull>false</notnull>
					<default>null</default>
                </field>');
		$this->_backend->addCol('fp_appropriation', $declaration);
		
		$this->setApplicationVersion('FundProject', '1.33');
	}
	
	public function update_33(){
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
                </field>');
		$this->_backend->addCol('fp_project', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>proposal_amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
                </field>');
		$this->_backend->addCol('fp_project', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>payout_amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
                </field>');
		$this->_backend->addCol('fp_project', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>confirmed_amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
                </field>');
		$this->_backend->addCol('fp_project', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>rest_amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
                </field>');
		$this->_backend->addCol('fp_project', $declaration);
		
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>confirmed_amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
                </field>');
		$this->_backend->addCol('fp_appropriation', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>payout_amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
                </field>');
		$this->_backend->addCol('fp_appropriation', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>rest_amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
                </field>');
		$this->_backend->addCol('fp_appropriation', $declaration);
		
		$this->setApplicationVersion('FundProject', '1.331');
	}
			
	public function update_331(){
		
		// split change_kind into 3 logical fields (bool)
		// 1) drop change_kind
		$this->_backend->dropCol('fp_appropriation_change', 'change_kind');
		
		// add the three values as single bool columns
		
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>is_state_change</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>');
		$this->_backend->addCol('fp_appropriation_change', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>is_amount_change</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>');
		$this->_backend->addCol('fp_appropriation_change', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>is_rebooking</name>
                    <type>boolean</type>
                    <default>false</default>
                </field>');
		$this->_backend->addCol('fp_appropriation_change', $declaration);
		
		$this->setApplicationVersion('FundProject', '1.332');
	}
	
	public function update_332(){
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
					<default>0</default>
                </field>');
		$this->_backend->alterCol('fp_project', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>proposal_amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
					<default>0</default>
                </field>');
		$this->_backend->alterCol('fp_project', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>payout_amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
					<default>0</default>
                </field>');
		$this->_backend->alterCol('fp_project', $declaration);
		
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>confirmed_amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
					<default>0</default>
                </field>');
		$this->_backend->alterCol('fp_project', $declaration);
		
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>rest_amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
					<default>0</default>
                </field>');
		$this->_backend->alterCol('fp_project', $declaration);
		
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
					<default>0</default>
                </field>');
		$this->_backend->alterCol('fp_appropriation', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>proposal_amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
					<default>0</default>
                </field>');
		$this->_backend->alterCol('fp_appropriation', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>payout_amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
					<default>0</default>
                </field>');
		$this->_backend->alterCol('fp_appropriation', $declaration);
		
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>confirmed_amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
					<default>0</default>
                </field>');
		$this->_backend->alterCol('fp_appropriation', $declaration);
		
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>rest_amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<notnull>false</notnull>
					<default>0</default>
                </field>');
		$this->_backend->alterCol('fp_appropriation', $declaration);
		
		
		$this->setApplicationVersion('FundProject', '1.333');
	}
	
	public function update_333(){
		$declaration = new Setup_Backend_Schema_Field_Xml('
				<field>
                    <name>rebooking_kind</name>
                    <type>enum</type>
					<value>NOVALUE</value>
					<value>CANCELLATION</value>
					<value>APPROVALREVOCATION</value>
					<value>REALLOCATION</value>
					<default>NOVALUE</default>
                    <notnull>true</notnull>
                </field>');
		$this->_backend->alterCol('fp_appropriation_change', $declaration);
		
		$this->setApplicationVersion('FundProject', '1.334');
	}
	
	public function update_334(){
		$declaration = new Setup_Backend_Schema_Field_Xml('
			<field>
				<name>key</name>
				<type>text</type>
				<length>16</length>
				<default>null</default>
				<notnull>false</notnull>
			</field>');
		$this->_backend->addCol('fp_project_role', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>invoice_receipt_id</name>
                    <type>integer</type>
                    <notnull>false</notnull>
					<default>null</default>
                </field>');
		$this->_backend->addCol('fp_appropriation_change', $declaration);
		
		$this->setApplicationVersion('FundProject', '1.335');
	}	
				
	public function update_335(){
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>change_claim_amount</name>
                    <type>float</type>
					<unsigned>false</unsigned>
					<default>0</default>
					<notnull>true</notnull>
                </field>	
		');
		$this->_backend->addCol('fp_appropriation_change', $declaration);
		
		$this->setApplicationVersion('FundProject', '1.336');
	}	
	
	public function update_336(){
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>payout_status</name>
                    <type>enum</type>
					<value>QUERY</value>
					<value>PAYMENT</value>
					<default>QUERY</default>
                    <notnull>true</notnull>
                </field>	
		');
		$this->_backend->alterCol('fp_appropriation_payout', $declaration);
		
		$declaration = new Setup_Backend_Schema_Field_Xml('
			<field>
                    <name>payout_type</name>
                    <type>enum</type>
					<value>PAYOUT</value>
					<value>PAYIN</value>
					<default>PAYOUT</default>
                    <notnull>true</notnull>
                </field>
		');
		$this->_backend->addCol('fp_appropriation_payout', $declaration);
		
		$this->setApplicationVersion('FundProject', '1.337');
	}	
	
				
}			
			
?>