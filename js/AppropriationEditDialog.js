Ext.namespace('Tine.FundProject');

Tine.FundProject.AppropriationEditDialog = Ext.extend(Tine.widgets.dialog.EditDialog, {
	
	/**
	 * @private
	 */
	windowNamePrefix: 'AppropriationEditWindow_',
	appName: 'FundProject',
	recordClass: Tine.FundProject.Model.Appropriation,
	recordProxy: Tine.FundProject.appropriationBackend,
	loadRecord: true,
	evalGrants: false,
	projectRecord: null,
	
	initComponent: function(){
		//this.initActions();
		this.on('load',this.onLoadAppropriation, this);
		this.on('afterrender',this.onAfterRender,this);
		this.initDependentGrids();
		Tine.FundProject.AppropriationEditDialog.superclass.initComponent.call(this);
	},
	onLoadAppropriation: function(){
		if(!this.record.isNew()){
			// enable attendance grid if record has id
			this.appropriationPayoutGrid.enable();
			this.appropriationPayoutGrid.loadAppropriation(this.record);
			this.appropriationChangeGrid.enable();
			this.appropriationChangeGrid.loadAppropriation(this.record);
			
			if(this.record.get('state')!=='ALLOTED'){
				this.action_confirmAppropriation.enable();
			}
			if(this.record.get('state')!=='REJECTED'){
				this.action_cancelAppropriation.enable();
			}
			if(this.record.get('state')=='ALLOTED'){
				this.action_reallocateAppropriation.enable();
				this.action_liquidateAppropriation.enable();
				this.action_reverseAppropriation.enable();
				this.action_requestPayout.enable();
				this.action_payOut.enable();
				this.action_payIn.enable();
			}
		}

		if(this.projectRecord){
			Ext.getCmp('appropriation_project_id').setValue(this.projectRecord);
			Ext.getCmp('appropriation_project_id').disable();
   		}
	},
	onBeforeCloseChangeDialog: function(){
		this.initRecord();
		return true;
	},
	rejectAppropriation: function(){
		Ext.getCmp('appropriation_state').setValue('REJECTED');
		this.onApplyChanges();
	},
	initActions: function(){
		
		// get actions from Api and bind handlers to api instance
		// this is for using actions together with grid (no code duplication necessary anymore)
		Tine.FundProject.Api.Appropriation.getActions(this);
		this.tbar = new Ext.Toolbar();
        this.tbar.add(
        		this.action_confirmAppropriation,
        		this.action_cancelAppropriation, 
        		this.actions_rebooking, 
        		this.action_requestPayout,
        		this.action_payOut,
        		this.action_payIn
        );
        this.supr().initActions.call(this);
	},
	onAfterRender: function(){
		
	},
	getSelectedRecord: function(){
		return this.record;
	},
	initDependentGrids: function(){
		this.appropriationPayoutGrid = new Tine.FundProject.AppropriationPayoutGridPanel({
			inDialog:true,
			title:'Auszahlungen',
			layout:'border',
			disabled:true,
			frame: true,
			app: Tine.Tinebase.appMgr.get('FundProject')
		});
		this.appropriationChangeGrid = new Tine.FundProject.AppropriationChangeGridPanel({
			inDialog:true,
			title:'Mittel-Änderungen',
			layout:'border',
			disabled:true,
			frame: true,
			app: Tine.Tinebase.appMgr.get('FundProject')
		});
	},
	getFormItems: function() {
		var fields = Tine.FundProject.AppropriationFormFields.get();
		var tabPanel = new Ext.TabPanel({
	        region: 'center',
			activeTab: 0,
	        id: 'editMainTabPanel',
	        layoutOnTabChange:true,  
	        items:[
	               this.appropriationPayoutGrid,
	               this.appropriationChangeGrid
	        ]
		});
		  var mainPanel = new Ext.Panel({
		  		layout:'border',
				autoScroll:true,
				width:1078,
				height:600,
				defaults: {
		            border: false,
		            frame: false            
		        },
		        items: [
		            {
		            	xtype:'panel',
		            	region: 'north',
		            	height:220,
		            	layout:'border',
		            	items:[{
		   	            	xtype:'panel',
			            	region: 'center',
			            	height:220,
			            	layout:'fit',
			            	items:[
			            	       Tine.FundProject.AppropriationForm.getColumnForm(
									[[
										fields.project_id
									],[ 
										fields.appropriation_nr, fields.name, fields.id
									],[  
									   	fields.funds_category_id,fields.funds_kind_id
									],[  
									 	fields.state, fields.decision_committee, fields.amount, fields.proposal_amount
									],[  
										fields.payout_amount, fields.confirmed_amount, fields.rest_amount
									],[
									 	fields.debit_position_date, fields.decision_date,fields.approval_draft_date
									]]
								)]
		            	}]
		            },
		            tabPanel
		        ]
		  });
		  return [mainPanel];
	}
});

/**
 * FundProject Edit Popup
 */
Tine.FundProject.AppropriationEditDialog.openWindow = function (config) {
    var id = (config.record && config.record.id) ? config.record.id : 0;
    var window = Tine.WindowFactory.getWindow({
        width: 900,
        height: 700,
        name: Tine.FundProject.AppropriationEditDialog.prototype.windowNamePrefix + id,
        contentPanelConstructor: 'Tine.FundProject.AppropriationEditDialog',
        contentPanelConstructorConfig: config
    });
    return window;
};

Ext.ns('Tine.FundProject.AppropriationForm');

Tine.FundProject.AppropriationForm.getColumnForm = function(formFields){
	return {
        xtype: 'panel',
        border: false,
        frame:true,
        items:[{xtype:'columnform',items:
           formFields                               	
        }]
    };
};

Ext.ns('Tine.FundProject.AppropriationFormFields');

Tine.FundProject.AppropriationFormFields.get = function(){
	return{
		// hidden fields
		id: 
			{xtype: 'hidden',id:'id',name:'id', disabled:true, width:1},
		project_id:
			Tine.FundProject.Custom.getRecordPicker('Project','appropriation_project_id',{
				disabledClass: 'x-item-disabled-view',
				width: 300,
				fieldLabel: 'Projekt',
			    name:'project_id',
			    disabled: false,
			    onAddEditable: true,
			    onEditEditable: true,
			    blurOnSelect: true,
			    allowBlank:true
			}),
		appropriation_nr:
			{
			    fieldLabel: 'Mittel-Nr',
			    id:'appropriation_appropriation_nr',
			    emptyText:'<automatisch>',
			    name:'appropriation_nr',
			    disabledClass: 'x-item-disabled-view',
			    disabled:true,
			    value:null,
			    width: 100
			},
		funds_category_id:
			Tine.FundProject.Custom.getRecordPicker('FundsCategory','appropriation_funds_category_id',{
				disabledClass: 'x-item-disabled-view',
				width: 300,
				fieldLabel: 'Mittelkategorie',
			    name:'funds_category_id',
			    disabled: false,
			    onAddEditable: true,
			    onEditEditable: true,
			    blurOnSelect: true,
			    allowBlank:true
			}),
		funds_kind_id:
			Tine.FundProject.Custom.getRecordPicker('FundsKind','appropriation_funds_kind_id',{
				disabledClass: 'x-item-disabled-view',
				width: 300,
				fieldLabel: 'Mittelart',
			    name:'funds_kind_id',
			    disabled: false,
			    onAddEditable: true,
			    onEditEditable: true,
			    blurOnSelect: true,
			    allowBlank:true
			}),
		name:
			{
			    fieldLabel: 'Bezeichnung',
			    id:'appropriation_name',
			    name:'name',
			    disabledClass: 'x-item-disabled-view',
			    disabled:false,
			    value:null,
			    width: 600
			},
		state:
			{
			    fieldLabel: 'Status',
			    disabledClass: 'x-item-disabled-view',
			    id:'appropriation_state',
			    name:'state',
			    width: 150,
			    xtype:'combo',
			    store:[['SUBMITTED','beantragt'],['ALLOTED','bewilligt'],['REASSIGNED','umgewidmet'],['REJECTED','abgelehnt']],
			    value: 'SUBMITTED',
				mode: 'local',
				disabled:true,
				displayField: 'name',
			    valueField: 'id',
			    triggerAction: 'all'
			},
		decision_committee:
			{
			    fieldLabel: 'Entsch. Gremium',
			    disabledClass: 'x-item-disabled-view',
			    id:'appropriation_decision_committee',
			    name:'decision_committee',
			    width: 300,
			    xtype:'combo',
			    store:[['EXECUTIVE','Geschäftsführer'],['MANAGEMENT','Vorstand'],['ADVISER','Stiftungsrat'],['CIRCULATION','Umlaufverfahren (Vorstand)']],
			    value: 'EXECUTIVE',
				mode: 'local',
				displayField: 'name',
			    valueField: 'id',
			    triggerAction: 'all'
			},
		debit_position_date:
		 	{
	        	xtype: 'datefield',
	            fieldLabel: 'Dat. Sollst. Bew.', 
	            disabledClass: 'x-item-disabled-view',
	            id:'appropriation_debit_position_date',
	            name:'debit_position_date',
	            width: 100
	        },
	    decision_date:
		 	{
	        	xtype: 'datefield',
	            fieldLabel: 'Beschlussdatum', 
	            disabledClass: 'x-item-disabled-view',
	            id:'appropriation_decision_date',
	            name:'decision_date',
	            width: 100
	        },
	    approval_draft_date:
		 	{
	        	xtype: 'datefield',
	            fieldLabel: 'Eingang Antrag', 
	            disabledClass: 'x-item-disabled-view',
	            id:'appropriation_approval_draft_date',
	            name:'approval_draft_date',
	            width: 100
	        },
	    amount:
			{
		 		xtype: 'sopencurrencyfield',
		    	fieldLabel: 'Beantr. Betrag', 
			    id:'appropriation_amount',
			    name:'amount',
			   // disabled:true,
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		 	    width:180
		 	},
		proposal_amount:
			{
		 		xtype: 'sopencurrencyfield',
		    	fieldLabel: 'Vorschlagssumme', 
			    id:'appropriation_proposal_amount',
			    name:'proposal_amount',
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		 	    width:180
		 	},
	    confirmed_amount:
			{
		 		xtype: 'sopencurrencyfield',
		    	fieldLabel: 'Bew. Betrag', 
			    id:'appropriation_confirmed_amount',
			    name:'confirmed_amount',
		    	disabledClass: 'x-item-disabled-view',
		    	disabled:true,
		    	blurOnSelect: true,
		 	    width:180
		 	},
	    payout_amount:
			{
		 		xtype: 'sopencurrencyfield',
		    	fieldLabel: 'Ausgez. Betrag', 
			    id:'appropriation_payout_amount',
			    name:'payout_amount',
		    	disabledClass: 'x-item-disabled-view',
		    	disabled:true,
		    	blurOnSelect: true,
		 	    width:180
		 	},
		 rest_amount:
			{
		 		xtype: 'sopencurrencyfield',
		    	fieldLabel: 'Restbetrag', 
			    id:'appropriation_rest_amount',
			    name:'rest_amount',
			    disabled:true,
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		 	    width:180
		 	}
	};
};