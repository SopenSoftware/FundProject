Ext.namespace('Tine.FundProject');
Ext.namespace('Tine.FundProject.renderer');

Tine.FundProject.renderer.contactRenderer =  function(_recordData) {
	if(!_recordData){
		return null;
	}
	var _record = new Tine.Addressbook.Model.Contact(_recordData,_recordData.id);
	if(typeof(_record) === 'object' && !Ext.isEmpty(_record)){
		try{
			return _record.getTitle();
		}catch(e){
			return "";
		}
	}
};

Tine.FundProject.renderer.projectRenderer =  function(_recordData) {
	if(!_recordData){
		return null;
	}
	var _record = new Tine.FundProject.Model.Project(_recordData,_recordData.id);
	if(typeof(_record) === 'object' && !Ext.isEmpty(_record)){
		try{
			return _record.getTitle();
		}catch(e){
			return "";
		}
	}
};

Tine.FundProject.renderer.projectNrRenderer =  function(_recordData) {
	if(!_recordData){
		return null;
	}
	var _record = new Tine.FundProject.Model.Project(_recordData,_recordData.id);
	if(typeof(_record) === 'object' && !Ext.isEmpty(_record)){
		try{
			return _record.get('project_nr');
		}catch(e){
			return "";
		}
	}
};

Tine.FundProject.renderer.promotionAreaRenderer =  function(_recordData) {
	if(!_recordData){
		return null;
	}
	//console.log(_recordData);
	var _record = new Tine.FundProject.Model.PromotionArea(_recordData,_recordData.id);
	//console.log(_record);
	if(typeof(_record) === 'object' && !Ext.isEmpty(_record)){
		try{
			return _record.get('key') + ' ' +_record.get('name');
		}catch(e){
			return "";
		}
	}
};

Tine.FundProject.renderer.departmentRenderer =  function(_recordData) {
	if(!_recordData){
		return null;
	}
	var _record = new Tine.FundProject.Model.Department(_recordData,_recordData.id);
	if(typeof(_record) === 'object' && !Ext.isEmpty(_record)){
		try{
			return _record.get('name');
		}catch(e){
			return "";
		}
	}
};

Tine.FundProject.renderer.appropriationRenderer =  function(_recordData) {
	if(!_recordData){
		return null;
	}
	var _record = new Tine.FundProject.Model.Appropriation(_recordData,_recordData.id);
	if(typeof(_record) === 'object' && !Ext.isEmpty(_record)){
		try{
			return _record.get('appropriation_nr');
		}catch(e){
			return "";
		}
	}
};

Tine.FundProject.renderer.projectRoleRenderer =  function(_recordData) {
	if(!_recordData){
		return null;
	}
	var _record = new Tine.FundProject.Model.ProjectRole(_recordData,_recordData.id);
	if(typeof(_record) === 'object' && !Ext.isEmpty(_record)){
		try{
			return _record.get('name');
		}catch(e){
			return "";
		}
	}
};

Tine.FundProject.renderer.fundsKindRenderer =  function(_recordData) {
	if(!_recordData){
		return null;
	}
	var _record = new Tine.FundProject.Model.FundsKind(_recordData,_recordData.id);
	if(typeof(_record) === 'object' && !Ext.isEmpty(_record)){
		try{
			return _record.get('name');
		}catch(e){
			return "";
		}
	}
};

Tine.FundProject.renderer.fundsCategoryRenderer =  function(_recordData) {
	if(!_recordData){
		return null;
	}
	var _record = new Tine.FundProject.Model.FundsCategory(_recordData,_recordData.id);
	if(typeof(_record) === 'object' && !Ext.isEmpty(_record)){
		try{
			return _record.get('name');
		}catch(e){
			return "";
		}
	}
};


Tine.FundProject.renderer.projectStateRenderer =  function(v) {
	switch(v){
	case 'PROJECT':
		return 'Projekt';
	case 'PROJECTFINISHED':
		return 'Projekt erledigt';
	case 'CLAIM':
		return 'Antrag';
	case 'CLAIMFINISHED':
		return 'Antrag erledigt';		
	case 'QUERY':
		return 'Anfrage';		
	case 'QUERYFINISHED':
		return 'Anfrage erledigt';	
	}
};

Tine.FundProject.renderer.rebookingStateRenderer =  function(v) {
	switch(v){
	case 'CANCELLATION':
		return 'Storno';
	case 'APPROVALREVOCATION':
		return 'Bewilligungslöschung';
	case 'REALLOCATION':
		return 'Umwidmung';
	default:
		return '';
	}
};

Tine.FundProject.renderer.aquisitionStateRenderer =  function(v) {
	switch(v){
	case 'AQUIRED':
		return 'Erwerb';
	case 'PARTLYAQUIRED':
		return 'Teilerwerb';		
	case 'BENEFIT':
		return 'Zuschuß';		
	}
};

Tine.FundProject.renderer.decisionCommitteeRenderer =  function(v) {
	switch(v){
	case 'EXECUTIVE':
		return 'Geschäftsführer';
	case 'MANAGEMENT':
		return 'Vorstand';		
	case 'ADVISER':
		return 'Stiftungsrat';
	case 'CIRCULATION':
		return 'Umlaufverfahren (Vorstand)';
	}
};

Tine.FundProject.renderer.appropriationStateRenderer =  function(v) {
	switch(v){
	case 'SUBMITTED':
		return 'beantragt';
	case 'ALLOTED':
		return 'bewilligt';		
	case 'REJECTED':
		return 'abgelehnt';		
	}
};

Tine.FundProject.renderer.payoutStateRenderer =  function(v) {
	switch(v){
	case 'QUERY':
		return 'Anfrage';
	case 'PAYMENT':
		return 'Zahlung';	
	}
};

Tine.FundProject.renderer.payoutTypeRenderer =  function(v) {
	switch(v){
	case 'PAYOUT':
		return 'Auszahlung';		
	case 'PAYIN':
		return 'Einzahlung';		
	}
};

Tine.FundProject.renderer.isDefault = function(v){
	switch(v){
	case '0':
		return '';
	case '1':
		return 'Ja';
	}
};

Tine.FundProject.renderer.booleanRenderer = function(v){
	switch(v){
	case '0':
		return 'Nein';
	case '1':
		return 'Ja';
	}
};

Tine.FundProject.renderer.percentage = function(v){
	return v + ' %';
};

