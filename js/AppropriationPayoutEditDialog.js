Ext.namespace('Tine.FundProject');

Tine.FundProject.AppropriationPayoutEditDialog = Ext.extend(Tine.widgets.dialog.EditDialog, {
	
	/**
	 * @private
	 */
	windowNamePrefix: 'AppropriationPayoutEditWindow_',
	appName: 'FundProject',
	recordClass: Tine.FundProject.Model.AppropriationPayout,
	recordProxy: Tine.FundProject.appropriationPayoutBackend,
	loadRecord: false,
	evalGrants: false,
	
	initComponent: function(){
		//this.on('load',this.onLoadAppropriationPayout, this);
		//this.on('afterrender',this.onAfterRender,this);
		//this.initDependentGrids();
		Tine.FundProject.AppropriationPayoutEditDialog.superclass.initComponent.call(this);
	},
	initActions: function(){
		
		// get actions from Api and bind handlers to api instance
		// this is for using actions together with grid (no code duplication necessary anymore)
		Tine.FundProject.Api.AppropriationPayout.getActions(this);
		this.tbar = new Ext.Toolbar();
        this.tbar.add(
        		this.action_releasePayout,
        		this.action_execPayout
        );
        this.supr().initActions.call(this);
	},
	getFormItems: function() {
		var fields = Tine.FundProject.AppropriationPayoutFormFields.get();
		var formFields = 
		[[
		  fields.appropriation_id, fields.approval_payout_query, fields.amount
		],[
		   fields.payout_status, fields.payout_type
		],[
		  fields.payout_query_date, fields.approval_payout_date, fields.payout_date, fields.booking_payout_date
		],[ 
		   fields.booking_text
		]];
		return Tine.FundProject.AppropriationPayoutForm.getColumnForm(formFields);
	}
});

/**
 * FundProject Edit Popup
 */
Tine.FundProject.AppropriationPayoutEditDialog.openWindow = function (config) {
    var id = (config.record && config.record.id) ? config.record.id : 0;
    var window = Tine.WindowFactory.getWindow({
        width: 620,
        height: 350,
        name: Tine.FundProject.AppropriationPayoutEditDialog.prototype.windowNamePrefix + id,
        contentPanelConstructor: 'Tine.FundProject.AppropriationPayoutEditDialog',
        contentPanelConstructorConfig: config
    });
    return window;
};

Ext.ns('Tine.FundProject.AppropriationPayoutForm');

Tine.FundProject.AppropriationPayoutForm.getColumnForm = function(formFields){
	return {
        xtype: 'panel',
        border: false,
        frame:true,
        items:[{xtype:'columnform',items:
           formFields                               	
        }]
    };
};

Ext.ns('Tine.FundProject.AppropriationPayoutFormFields');

Tine.FundProject.AppropriationPayoutFormFields.get = function(){
	return{
		// hidden fields
		id: 
		{xtype: 'hidden',id:'id',name:'id'},
	appropriation_id:
		Tine.FundProject.Custom.getRecordPicker('Appropriation','appropriation_change_appropriation_id',{
			disabledClass: 'x-item-disabled-view',
			width: 300,
			fieldLabel: 'Mittel',
		    name:'appropriation_id',
		    disabled: true,
		    onAddEditable: true,
		    onEditEditable: true,
		    blurOnSelect: true,
		    allowBlank:true
		}),
		payout_query_date:
	 	{
        	xtype: 'datefield',
            fieldLabel: 'Datum Anfrage', 
            disabledClass: 'x-item-disabled-view',
            id:'payout_query_date',
            name:'payout_query_date',
            disabled: true,
            width: 100
        },
        approval_payout_date:
	 	{
        	xtype: 'datefield',
            fieldLabel: 'Datum Freigabe', 
            disabledClass: 'x-item-disabled-view',
            id:'approval_payout_date',
            name:'approval_payout_date',
            disabled: true,
            width: 100
        },
        payout_date:
	 	{
        	xtype: 'datefield',
            fieldLabel: 'Datum Auszahlung', 
            disabledClass: 'x-item-disabled-view',
            id:'payout_date',
            name:'payout_date',
            disabled: true,
            width: 100
        },
        booking_payout_date:
	 	{
        	xtype: 'datefield',
            fieldLabel: 'Datum Buchung', 
            disabledClass: 'x-item-disabled-view',
            id:'booking_payout_date',
            name:'booking_payout_date',
            disabled: false,
            width: 100
        },
        approval_payout_query:
	 	{
        	xtype: 'checkbox',
			disabledClass: 'x-item-disabled-view',
			id: 'approval_payout_query',
			name: 'approval_payout_query',
			hideLabel:true,
			infoField:true,
			 disabled: false,
		    boxLabel: 'Freigabe Auszahlungsanf.',
		    width:150
        },
        approval_user_id:
        	new Tine.Addressbook.SearchCombo({
                allowBlank: false,
                columnWidth: 1,
                disabled: true,
                useAccountRecord: true,
                internalContactsOnly: true,
                nameField: 'n_fileas',
                fieldLabel: 'Benutzer Freigabe',
                name: 'approval_user_id'
            }),
        amount:
	 	{
        	xtype: 'sopencurrencyfield',
	    	fieldLabel: 'Betrag', 
		    id:'amount',
		    name:'amount',
		   // disabled:true,
	    	disabledClass: 'x-item-disabled-view',
	    	blurOnSelect: true,
	    	disabled: false,
	 	    width:180
        },
        payout_status:
	 	{
        	fieldLabel: 'Status',
		    disabledClass: 'x-item-disabled-view',
		    id:'appropriation_state',
		    name:'payout_status',
		    width: 150,
		    xtype:'combo',
		    store:[['QUERY','Anfrage'],['PAYMENT','Zahlung']],
		    value: 'QUERY',
			mode: 'local',
			disabled:false,
			displayField: 'name',
		    valueField: 'id',
		    triggerAction: 'all'
        },
        payout_type:
	 	{
        	fieldLabel: 'Typ',
		    disabledClass: 'x-item-disabled-view',
		    id:'appropriation_payout_type',
		    name:'payout_type',
		    width: 150,
		    xtype:'combo',
		    store:[['PAYOUT','Auszahlung'],['PAYIN','Einzahlung']],
		    value: 'PAYOUT',
			mode: 'local',
			disabled:true,
			displayField: 'name',
		    valueField: 'id',
		    triggerAction: 'all'
        },
        booking_text:
	 	{
        	xtype: 'textarea',
		    fieldLabel: 'Buchungstext',
		    id:'booking_text',
		    name:'booking_text',
		    disabledClass: 'x-item-disabled-view',
		    disabled:false,
		    value:null,
		    width: 600,
		    height: 120
        }
	};
};