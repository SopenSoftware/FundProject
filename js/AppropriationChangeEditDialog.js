Ext.namespace('Tine.FundProject');

Tine.FundProject.AppropriationChangeEditDialog = Ext.extend(Tine.widgets.dialog.EditDialog, {
	
	/**
	 * @private
	 */
	windowNamePrefix: 'AppropriationChangeEditWindow_',
	appName: 'FundProject',
	recordClass: Tine.FundProject.Model.AppropriationChange,
	recordProxy: Tine.FundProject.appropriationChangeBackend,
	loadRecord: false,
	evalGrants: false,
	
	initComponent: function(){
		//this.on('load',this.onLoadAppropriationChange, this);
		//this.on('afterrender',this.onAfterRender,this);
		Tine.FundProject.AppropriationChangeEditDialog.superclass.initComponent.call(this);
	},
	getFormItems: function() {
		var fields = Tine.FundProject.AppropriationChangeFormFields.get();
		var formFields = 
		[[
		  fields.appropriation_id, fields.change_date
		],[ 
			fields.is_state_change, fields.is_amount_change, fields.is_rebooking
		],[  
		   	fields.change_amount,fields.change_claim_amount, fields.rebooking_kind, fields.state
		],[  
		 	fields.comment
		]];
		return Tine.FundProject.AppropriationChangeForm.getColumnForm(formFields);
	}
});

/**
 * FundProject Edit Popup
 */
Tine.FundProject.AppropriationChangeEditDialog.openWindow = function (config) {
    var id = (config.record && config.record.id) ? config.record.id : 0;
    var window = Tine.WindowFactory.getWindow({
        width: 620,
        height: 400,
        name: Tine.FundProject.AppropriationChangeEditDialog.prototype.windowNamePrefix + id,
        contentPanelConstructor: 'Tine.FundProject.AppropriationChangeEditDialog',
        contentPanelConstructorConfig: config
    });
    return window;
};

Ext.ns('Tine.FundProject.AppropriationChangeForm');

Tine.FundProject.AppropriationChangeForm.getColumnForm = function(formFields){
	return {
        xtype: 'panel',
        border: false,
        frame:true,
        items:[{xtype:'columnform',items:
           formFields                               	
        }]
    };
};

Ext.ns('Tine.FundProject.AppropriationChangeFormFields');

Tine.FundProject.AppropriationChangeFormFields.get = function(){
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
		change_date:
		 	{
	        	xtype: 'datefield',
	            fieldLabel: 'Datum Änderung', 
	            disabledClass: 'x-item-disabled-view',
	            id:'change_date',
	            name:'change_date',
	            disabled: true,
	            width: 100
	        },
		change_amount:
		{
	 		xtype: 'sopencurrencyfield',
	    	fieldLabel: 'Änderung Betrag', 
		    id:'appropriation_change_amount',
		    name:'change_amount',
		   // disabled:true,
	    	disabledClass: 'x-item-disabled-view',
	    	blurOnSelect: true,
	    	disabled: true,
	 	    width:180
	 	},
		change_claim_amount:
		{
	 		xtype: 'sopencurrencyfield',
	    	fieldLabel: 'Änderung beantr. Summe', 
		    id:'appropriation_change_claim_amount',
		    name:'change_claim_amount',
		    disabled:true,
	    	disabledClass: 'x-item-disabled-view',
	    	blurOnSelect: true,
	 	    width:180
	 	},
	 	
	
		is_state_change:
		{
			xtype: 'checkbox',
			disabledClass: 'x-item-disabled-view',
			id: 'is_state_change',
			name: 'is_state_change',
			hideLabel:true,
			infoField:true,
			 disabled: true,
		    boxLabel: 'Statusänderung',
		    width:150
		},
		is_amount_change:
		{
			xtype: 'checkbox',
			disabledClass: 'x-item-disabled-view',
			id: 'is_amount_change',
			name: 'is_amount_change',
			hideLabel:true,
			infoField:true,
			 disabled: true,
		    boxLabel: 'Betragsänderung',
		    width:150
		},
		is_rebooking:
		{
			xtype: 'checkbox',
			disabledClass: 'x-item-disabled-view',
			id: 'is_rebooking',
			name: 'is_rebooking',
			hideLabel:true,
			infoField:true,
			 disabled: true,
		    boxLabel: 'Umbuchung',
		    width:150
		},
		rebooking_kind:
		{
		    fieldLabel: 'Art Umbuchung',
		    disabledClass: 'x-item-disabled-view',
		    id:'rebooking_kind',
		    name:'rebooking_kind',
		    width: 150,
		    xtype:'combo',
		    store:[['','...keine Auswahl...'],['CANCELLATION','Storno'],['APPROVALREVOCATION','Bewilligungslöschung'],['REALLOCATION','Umwidmung']],
		    value: '',
			mode: 'local',
			disabled:true,
			displayField: 'name',
		    valueField: 'id',
		    triggerAction: 'all'
		},
		comment:
		{
			xtype: 'textarea',
		    fieldLabel: 'Beschreibung',
		    id:'comment',
		    name:'comment',
		    disabledClass: 'x-item-disabled-view',
		    disabled:false,
		    value:null,
		    width: 600,
		    height: 120
		},
		state:
		{
		    fieldLabel: 'Status',
		    disabledClass: 'x-item-disabled-view',
		    id:'appropriation_state',
		    name:'state',
		    width: 150,
		    xtype:'combo',
		    store:[['SUBMITTED','beantragt'],['ALLOTED','bewilligt'],['REJECTED','abgelehnt']],
		    value: 'SUBMITTED',
			mode: 'local',
			disabled:true,
			displayField: 'name',
		    valueField: 'id',
		    triggerAction: 'all'
		}
	};
};