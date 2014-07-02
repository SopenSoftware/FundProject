Ext.namespace('Tine.FundProject');

Tine.FundProject.ProjectContactEditDialog = Ext.extend(Tine.widgets.dialog.EditDialog, {
	
	/**
	 * @private
	 */
	windowNamePrefix: 'ProjectContactEditWindow_',
	appName: 'FundProject',
	recordClass: Tine.FundProject.Model.ProjectContact,
	recordProxy: Tine.FundProject.projectContactBackend,
	loadRecord: false,
	evalGrants: false,
	projectRecord: null,
	contactRecord: null,
	initComponent: function(){
		this.on('load',this.onLoadProjectContact, this);
		this.on('afterrender',this.onAfterRender,this);
		Tine.FundProject.ProjectContactEditDialog.superclass.initComponent.call(this);
	},
	onLoadProjectContact: function(){
//		if(this.record.id !== 0){
//			// enable attendance grid if record has id
//			this.appropriationPayoutGrid.enable();
//			this.appropriationPayoutGrid.loadAppropriation(this.record);
//		}

		if(this.projectRecord){
			Ext.getCmp('project_contact_project_id').setValue(this.projectRecord);
			Ext.getCmp('project_contact_project_id').disable();
   		}
		if(this.contactRecord){
			Ext.getCmp('project_contact_contact_id').setValue(this.contactRecord);
			Ext.getCmp('project_contact_contact_id').disable();
   		}
	},
	onAfterRender: function(){
		
	},
	/**
	 * returns dialog
	 * 
	 * NOTE: when this method gets called, all initalisation is done.
	 */
	getFormItems: function() {
	    return {
	        xtype: 'panel',
	        border: false,
	        frame:true,
	        items:[{xtype:'columnform',items:[
	             [
	               	Tine.FundProject.Custom.getRecordPicker('Project','project_contact_project_id',{
						disabledClass: 'x-item-disabled-view',
						width: 300,
						fieldLabel: 'Projekt',
					    name:'project_id',
					    disabled: false,
					    onAddEditable: true,
					    onEditEditable: true,
					    blurOnSelect: true,
					    allowBlank:true
					})
				],[
	               	Tine.FundProject.Custom.getRecordPicker('ProjectRole','project_contact_project_role_id',{
						disabledClass: 'x-item-disabled-view',
						width: 300,
						fieldLabel: 'Projektrolle',
					    name:'project_role_id',
					    disabled: false,
					    onAddEditable: true,
					    onEditEditable: true,
					    blurOnSelect: true,
					    allowBlank:true
					})
				 ],[
					Tine.Addressbook.Custom.getRecordPicker('Contact','project_contact_contact_id',{
						disabledClass: 'x-item-disabled-view',
						width: 300,
						fieldLabel: 'Kontakt',
					    name:'contact_id',
					    disabled: false,
					    onAddEditable: true,
					    onEditEditable: true,
					    blurOnSelect: true,
					    allowBlank:true,
					    ddConfig:{
				        	ddGroup: 'ddGroupContact'
				        }
					})
				],[
				   {
					   fieldLabel:'Firma',
					   name: 'company',
					   disabledClass: 'x-item-disabled-view',
					   width: 300,
					   disabled: true
				   }
				],[
					   {
						   fieldLabel:'PLZ',
						   name: 'plz',
						   disabledClass: 'x-item-disabled-view',
						   width: 80,
						   disabled: true
					   },{
						   fieldLabel:'Ort',
						   name: 'location',
						   disabledClass: 'x-item-disabled-view',
						   width: 220,
						   disabled: true
					   }
				   
				   
				   
	             ]
	        ]}]
	    };
	}
});

/**
 * FundProject Edit Popup
 */
Tine.FundProject.ProjectContactEditDialog.openWindow = function (config) {
    var id = (config.record && config.record.id) ? config.record.id : 0;
    var window = Tine.WindowFactory.getWindow({
        width: 600,
        height: 450,
        name: Tine.FundProject.ProjectContactEditDialog.prototype.windowNamePrefix + id,
        contentPanelConstructor: 'Tine.FundProject.ProjectContactEditDialog',
        contentPanelConstructorConfig: config
    });
    return window;
};