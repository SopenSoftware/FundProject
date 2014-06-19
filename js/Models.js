Ext.ns('Tine.FundProject','Tine.FundProject.Model');

Tine.FundProject.Model.PromotionAreaArray = 
[
	{name: 'id'},
	{name: 'key'},
	{name: 'name'},
	{name: 'is_default'}
];

Tine.FundProject.Model.PromotionArea = Tine.Tinebase.data.Record.create(Tine.FundProject.Model.PromotionAreaArray, {
	appName: 'FundProject',
	modelName: 'PromotionArea',
	idProperty: 'id',
	titleProperty: 'name',
	recordName: 'Förderbereich',
	recordsName: 'Förderbereiche',
	containerProperty: null
});

Tine.FundProject.Model.PromotionArea.getDefaultData = function(){
	return {};
};

Tine.FundProject.Model.PromotionArea.getFilterModel = function() {
	var app = Tine.Tinebase.appMgr.get('FundProject');
	return [
	    {label: _('Quick search'),          field: 'query',       operators: ['contains']}
	];
};

Tine.FundProject.Model.ProjectRoleArray = 
[
	{name: 'id'},
	{name: 'key'},
	{name: 'name'},
	{name: 'is_default'}
];

Tine.FundProject.Model.ProjectRole = Tine.Tinebase.data.Record.create(Tine.FundProject.Model.ProjectRoleArray, {
	appName: 'FundProject',
	modelName: 'ProjectRole',
	idProperty: 'id',
	titleProperty: 'name',
	recordName: 'Projektrolle',
	recordsName: 'Projektrollen',
	containerProperty: null
});

Tine.FundProject.Model.ProjectRole.getDefaultData = function(){
	return {};
};

Tine.FundProject.Model.ProjectRole.getFilterModel = function() {
	var app = Tine.Tinebase.appMgr.get('FundProject');
	return [
	    {label: _('Quick search'),          field: 'query',       operators: ['contains']}
	];
};

Tine.FundProject.Model.FundsKindArray = 
[
	{name: 'id'},
	{name: 'key'},
	{name: 'name'},
	{name: 'is_default'}
];

Tine.FundProject.Model.FundsKind = Tine.Tinebase.data.Record.create(Tine.FundProject.Model.FundsKindArray, {
	appName: 'FundProject',
	modelName: 'FundsKind',
	idProperty: 'id',
	titleProperty: 'name',
	recordName: 'Mittelart',
	recordsName: 'Mittelarten',
	containerProperty: null
});

Tine.FundProject.Model.FundsKind.getDefaultData = function(){
	return {};
};

Tine.FundProject.Model.FundsKind.getFilterModel = function() {
	var app = Tine.Tinebase.appMgr.get('FundProject');
	return [
	    {label: _('Quick search'),          field: 'query',       operators: ['contains']}
	];
};

Tine.FundProject.Model.FundsCategoryArray = 
[
	{name: 'id'},
	{name: 'name'},
	{name: 'is_default'}
];

Tine.FundProject.Model.FundsCategory = Tine.Tinebase.data.Record.create(Tine.FundProject.Model.FundsCategoryArray, {
	appName: 'FundProject',
	modelName: 'FundsCategory',
	idProperty: 'id',
	titleProperty: 'name',
	recordName: 'Mittelkategorie',
	recordsName: 'Mittelkategorien',
	containerProperty: null
});

Tine.FundProject.Model.FundsCategory.getDefaultData = function(){
	return {};
};

Tine.FundProject.Model.FundsCategory.getFilterModel = function() {
	var app = Tine.Tinebase.appMgr.get('FundProject');
	return [
	    {label: _('Quick search'),          field: 'query',       operators: ['contains']}
	];
};

Tine.FundProject.Model.DepartmentArray = 
[
	{name: 'id'},
	{name: 'name'},
	{name: 'is_default'}
];

Tine.FundProject.Model.Department = Tine.Tinebase.data.Record.create(Tine.FundProject.Model.DepartmentArray, {
	appName: 'FundProject',
	modelName: 'Department',
	idProperty: 'id',
	titleProperty: 'name',
	recordName: 'Referat',
	recordsName: 'Referate',
	containerProperty: null
});

Tine.FundProject.Model.Department.getDefaultData = function(){
	return {};
};

Tine.FundProject.Model.Department.getFilterModel = function() {
	var app = Tine.Tinebase.appMgr.get('FundProject');
	return [
	    {label: _('Quick search'),          field: 'query',       operators: ['contains']}
	];
};

Tine.FundProject.Model.ProjectArray = 
[
	{name: 'id'},
	{name: 'project_id'},
	{name: 'department_id'},
	{name: 'leading_department_id'},
	{name: 'correspondent_user_id'},
	{name: 'approval_user_id'},
	{name: 'promotion_area_id'},
	{name: 'project_nr'},
	{name: 'short_name'},
	{name: 'name'},
	{name: 'description'},
	{name: 'state'},
	{name: 'agenda_topic'},
	{name: 'approval_buha'},
	{name: 'claim_entry_date'},
	{name: 'buha_finish_date'},
	{name: 'project_finish_date'},
	{name: 'pr_contact_date'},
	{name: 'pr_opening_date'},
	{name: 'pr_other_date'},
	{name: 'decision_committee'},
	{name: 'payment_svn_rate'},
	{name: 'query_date'},
	{name: 'monthly_list'},
	{name: 'aquisition_state'},
	
	{name: 'amount'},
	{name: 'proposal_amount'},
	{name: 'payout_amount'},
	{name: 'confirmed_amount'},
	{name: 'rest_amount'},
	 {name: 'creation_time',      type: 'date', dateFormat: Date.patterns.ISO8601Long},
	   {name: 'created_by',         type: 'int'                  },
	   {name: 'last_modified_time', type: 'date', dateFormat: Date.patterns.ISO8601Long},
	   {name: 'last_modified_by',   type: 'int'                  },
	   {name: 'is_deleted',         type: 'boolean'              },
	   {name: 'deleted_time',       type: 'date', dateFormat: Date.patterns.ISO8601Long},
	   {name: 'deleted_by',         type: 'int'                  },
	   {name: 'tags'},
	   {name: 'notes'}
];

Tine.FundProject.Model.Project = Tine.Tinebase.data.Record.create(Tine.FundProject.Model.ProjectArray, {
	appName: 'FundProject',
	modelName: 'Project',
	idProperty: 'id',
	titleProperty: 'name',
	recordName: 'Projekt',
	recordsName: 'Projekte',
	containerProperty: null
});

Tine.FundProject.Model.Project.getDefaultData = function(){
	return {};
};

Tine.FundProject.Model.Project.getFilterModel = function() {
	var app = Tine.Tinebase.appMgr.get('FundProject');
	return [
	    {label: _('Quick search'),          field: 'query',       operators: ['contains']},
	    {label: app.i18n._('Projekt-Nr'),  field: 'project_nr', operators: ['contains'], operators: ['equals','startswith','endswith','greater','less']}
	];
};

Tine.FundProject.Model.ProjectContactArray = 
[
	{name: 'id'},
	{name: 'project_id'},
	{name: 'project_role_id'},
	{name: 'contact_id'},
	{name: 'company'},
	{name: 'plz'},
	{name: 'location'}
];

Tine.FundProject.Model.ProjectContact = Tine.Tinebase.data.Record.create(Tine.FundProject.Model.ProjectContactArray, {
	appName: 'FundProject',
	modelName: 'ProjectContact',
	idProperty: 'id',
	titleProperty: 'name',
	recordName: 'Projektkontakt',
	recordsName: 'Projektkontakte',
	containerProperty: null
});

Tine.FundProject.Model.ProjectContact.getDefaultData = function(){
	return {};
};

Tine.FundProject.Model.ProjectContact.getFilterModel = function() {
	var app = Tine.Tinebase.appMgr.get('FundProjectContact');
	return [
	    {label: _('Quick search'),          field: 'query',       operators: ['contains']}
	];
};

Tine.FundProject.Model.AppropriationArray = 
[
	{name: 'id'},
	{name: 'project_id'},
	{name: 'appropriation_nr'},
	{name: 'funds_category_id'},
	{name: 'funds_kind_id'},
	{name: 'order_id'},
	{name: 'name'},
	{name: 'debit_position_date'},
	{name: 'decision_date'},
	{name: 'decision_committee'},
	{name: 'state'},
	{name: 'amount'},
	{name: 'proposal_amount'},
	
	{name: 'payout_amount'},
	{name: 'confirmed_amount'},
	{name: 'rest_amount'},
	
	{name: 'approval_draft_date'},
	{name: 'comment'},
	{name: 'creation_time',      type: 'date', dateFormat: Date.patterns.ISO8601Long},
   {name: 'created_by'},
   {name: 'last_modified_time', type: 'date', dateFormat: Date.patterns.ISO8601Long},
   {name: 'last_modified_by'},
   {name: 'is_deleted',         type: 'boolean'              },
   {name: 'deleted_time',       type: 'date', dateFormat: Date.patterns.ISO8601Long},
   {name: 'deleted_by'}
];

Tine.FundProject.Model.Appropriation = Tine.Tinebase.data.Record.create(Tine.FundProject.Model.AppropriationArray, {
	appName: 'FundProject',
	modelName: 'Appropriation',
	idProperty: 'id',
	titleProperty: 'name',
	recordName: 'Fördermittel',
	recordsName: 'Fördermittel',
	containerProperty: null
});

Tine.FundProject.Model.Appropriation.getDefaultData = function(){
	return {};
};

Tine.FundProject.Model.Appropriation.getFilterModel = function() {
	var app = Tine.Tinebase.appMgr.get('FundProject');
	return [
	    {label: _('Quick search'),          field: 'query',       operators: ['contains']},
	    {label: app.i18n._('Projekt-Nr'),  field: 'project_nr', operators: ['contains'], operators: ['equals','startswith','endswith','greater','less']},
	    {label: app.i18n._('Mittel-Nr'),  field: 'appropriation_nr', operators: ['contains'], operators: ['equals','startswith','endswith','greater','less']}
        
	];
};

Tine.FundProject.Model.AppropriationChangeArray = 
[
	{name: 'id'},
	{name: 'appropriation_id'},
	{name: 'change_date'},
	{name: 'change_amount'},
	{name: 'change_claim_amount'},
	
	{name: 'is_state_change'},
	{name: 'is_amount_change'},
	{name: 'is_rebooking'},
	{name: 'rebooking_kind'},
	{name: 'comment'},
	{name: 'state'},
	{name: 'creation_time',      type: 'date', dateFormat: Date.patterns.ISO8601Long},
   {name: 'created_by'},
   {name: 'last_modified_time', type: 'date', dateFormat: Date.patterns.ISO8601Long},
   {name: 'last_modified_by'},
   {name: 'is_deleted',         type: 'boolean'              },
   {name: 'deleted_time',       type: 'date', dateFormat: Date.patterns.ISO8601Long},
   {name: 'deleted_by'},
];

Tine.FundProject.Model.AppropriationChange = Tine.Tinebase.data.Record.create(Tine.FundProject.Model.AppropriationChangeArray, {
	appName: 'FundProject',
	modelName: 'AppropriationChange',
	idProperty: 'id',
	titleProperty: 'name',
	recordName: 'Mitteländerung',
	recordsName: 'Mitteländerungen',
	containerProperty: null
});

Tine.FundProject.Model.AppropriationChange.getDefaultData = function(){
	return {};
};

Tine.FundProject.Model.AppropriationChange.getFilterModel = function() {
	var app = Tine.Tinebase.appMgr.get('FundProject');
	return [
	    {label: _('Quick search'),          field: 'query',       operators: ['contains']}
	];
};

Tine.FundProject.Model.AppropriationPayoutArray = 
[
	{name: 'id'},
	{name: 'appropriation_id'},
	{name: 'payout_query_date'},
	{name: 'approval_payout_date'},
	{name: 'payout_date'},
	{name: 'booking_payout_date'},
	{name: 'approval_payout_query'},
	{name: 'approval_user_id'},
	{name: 'amount'},
	{name: 'payout_status'},
	{name: 'payout_type'},
	{name: 'booking_text'}
];

Tine.FundProject.Model.AppropriationPayout = Tine.Tinebase.data.Record.create(Tine.FundProject.Model.AppropriationPayoutArray, {
	appName: 'FundProject',
	modelName: 'AppropriationPayout',
	idProperty: 'id',
	titleProperty: 'name',
	recordName: 'Mittelauszahlung',
	recordsName: 'Mittelauszahlungen',
	containerProperty: null
});

Tine.FundProject.Model.AppropriationPayout.getDefaultData = function(){
	return {};
};

Tine.FundProject.Model.AppropriationPayout.getFilterModel = function() {
	var app = Tine.Tinebase.appMgr.get('FundProject');
	return [
	    {label: _('Quick search'),          field: 'query',       operators: ['contains']},
	    {label: app.i18n._('Projekt-Nr'),  field: 'project_nr', operators: ['contains'], operators: ['equals','startswith','endswith','greater','less']},
	    {label: app.i18n._('Mittel-Nr'),  field: 'appropriation_nr', operators: ['contains'], operators: ['equals','startswith','endswith','greater','less']},
        
	    {label: app.i18n._('Status'),  field: 'payout_status',  valueType: 'combo', valueField:'id', displayField:'name', 
        	store:[['QUERY', 'Anfrage'],['PAYMENT','Zahlung']]},
	 {label: app.i18n._('Typ'),  field: 'payout_type',  valueType: 'combo', valueField:'id', displayField:'name', 
    	store:[['PAYOUT', 'Auszahlung'],['PAYIN','Einzahlung']]},
     {label: _('Datum Ausz.anf.'),         field: 'payout_query_date', valueType: 'date'},
     {label: _('Freigabe Ausz.'),         field: 'approval_payout_date', valueType: 'date'},
     {label: _('Freigabe Anf. Ausz.'),   field: 'approval_payout_query',  valueType: 'bool'}
	];
};