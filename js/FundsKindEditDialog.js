Ext.namespace('Tine.FundProject');

Tine.FundProject.FundsKindEditDialog = Ext.extend(Tine.widgets.dialog.EditDialog, {
	
	/**
	 * @private
	 */
	windowNamePrefix: 'FundsKindEditWindow_',
	appName: 'FundProject',
	recordClass: Tine.FundProject.Model.FundsKind,
	recordProxy: Tine.FundProject.fundsKindBackend,
	loadRecord: false,
	evalGrants: false,
	
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
	                {
						xtype: 'checkbox',
						disabledClass: 'x-item-disabled-view',
						id: 'is_default',
						name: 'is_default',
						hideLabel:true,
					    boxLabel: 'als Voreinstellung verwenden',
					    width: 250
					}
				 ],[
					{
						fieldLabel: 'Bezeichnung',
					    id:'name',
					    name:'name',
					    value:null,
					    width: 500
					} 
	             ]
	        ]}]
	    };
	}
});

/**
 * FundProject Edit Popup
 */
Tine.FundProject.FundsKindEditDialog.openWindow = function (config) {
    var id = (config.record && config.record.id) ? config.record.id : 0;
    var window = Tine.WindowFactory.getWindow({
        width: 600,
        height: 450,
        name: Tine.FundProject.FundsKindEditDialog.prototype.windowNamePrefix + id,
        contentPanelConstructor: 'Tine.FundProject.FundsKindEditDialog',
        contentPanelConstructorConfig: config
    });
    return window;
};