Ext.namespace('Tine.FundProject');

Tine.FundProject.ChangeAppropriationDialog = Ext.extend(Ext.form.FormPanel, {
	windowNamePrefix: 'ChangeAppropriationWindow_',
	appName: 'FundProject',
	layout:'fit',
	appropriationRecord: null,
	appropriationPayoutRecord: null,
	panelTitle: '--undefiniert--',
	parentMemberLabel: null,
	
	/**
	 * initialize component
	 */
	initComponent: function(){
		this.addEvents(
			'beforeclose'	
		);
		
		this.initActions();
		this.initToolbar();
		this.items = this.getFormItems();
		this.on('afterrender', this.onAfterRender, this);
		Tine.FundProject.ChangeAppropriationDialog.superclass.initComponent.call(this);
		
	},
	onAfterRender: function(){
		
		var project = this.appropriationRecord.getForeignRecord(Tine.FundProject.Model.Project, 'project_id');
		
		switch(this.changeSet){
		
		case 'Confirmation':
			var confirmedAmount = this.appropriationRecord.get('confirmed_amount');
			var claimAmount = this.appropriationRecord.get('amount');
			var proposeValue = Math.max(claimAmount - confirmedAmount, 0);
			Ext.getCmp('appropriation_confirmed_amount').setValue(proposeValue);
			
			
			return true;
		
		case 'Reallocation':
			Ext.getCmp('appropriation_project_id').setValue(project);
			Ext.getCmp('appropriation_id').setProjectId(project.get('id'));
			
			Ext.getCmp('appropriation_project_id').on('change', this.onReallocationChangeProject, this);
			Ext.getCmp('appropriation_project_id').on('select', this.onReallocationChangeProject, this);
			
			break;
			
		case 'RequestPayout':
		case 'Payout':
			Ext.getCmp('appropriation_payout_amount').setValue(this.appropriationRecord.get('rest_amount'));
			
			
			
			break;
			
		}
	},
	initActions: function(){
        this.actions_print = new Ext.Action({
            text: 'Ok',
            disabled: false,
            iconCls: 'action_applyChanges',
            handler: this.requestDataChange,
            scale:'small',
            iconAlign:'left',
            scope: this
        });
        this.actions_cancel = new Ext.Action({
            text: 'Abbrechen',
            disabled: false,
            iconCls: 'action_cancel',
            handler: this.cancel,
            scale:'small',
            iconAlign:'left',
            scope: this
        });        
	},
	/**
	 * init bottom toolbar
	 */
	initToolbar: function(){
		this.bbar = new Ext.Toolbar({
			height:48,
        	items: [
        	        '->',
                    Ext.apply(new Ext.Button(this.actions_cancel), {
                        scale: 'medium',
                        rowspan: 2,
                        iconAlign: 'left',
                        arrowAlign:'right'
                    }),
                    Ext.apply(new Ext.Button(this.actions_print), {
                        scale: 'medium',
                        rowspan: 2,
                        iconAlign: 'left',
                        arrowAlign:'right'
                    })
                ]
        });
	},
	/**
	 * save the order including positions
	 */
	requestDataChange: function(){
		if(!this.validateValues()){
			return false;
		}
		Ext.Ajax.request({
			scope:this,
            params: {
                method: 'FundProject.requestAppropriationChange',
                appropriationId:  this.appropriationRecord.get('id'),
                data: Ext.util.JSON.encode(this.getData()),
                changeSet: this.changeSet
            },
            success: this.onRequestSuccess,
            failure: this.onRequestFailure
        });
	},
	onRequestSuccess: function(){
		if(this.fireEvent('beforeclose', this)){
			this.window.close();
		}
	},
	onRequestFailure: function(){
		
	},
	validateValues: function(){
		switch(this.changeSet){
		case 'Confirmation':
		case 'Payin':
			return true;
			
	
		case 'Reallocation':
			if(parseFloat(Ext.getCmp('appropriation_confirmed_amount').getValue(),4)<=parseFloat(this.appropriationRecord.get('confirmed_amount'),4)){
				return true;
			}
			Ext.MessageBox.show({
	             title: 'Fehler', 
	             msg: 'Der umzuwidmende Betrag darf die bewilligte Summe des Mittels ('+this.appropriationRecord.get('confirmed_amount')+') nicht übersteigen.',
	             buttons: Ext.Msg.OK,
	             icon: Ext.MessageBox.INFO
	         });
			return false;
		case 'Liquidation':
			return true;
			
		case 'Reverse':
			return true;
			
		case 'RequestPayout':
		case 'Payout':
			if(parseFloat(Ext.getCmp('appropriation_payout_amount').getValue(),4)<=parseFloat(this.appropriationRecord.get('rest_amount'),4)){
				return true;
			}
			Ext.MessageBox.show({
	             title: 'Fehler', 
	             msg: 'Der auszuzahlende Betrag darf die Restsumme des Mittels ('+this.appropriationRecord.get('rest_amount')+') nicht übersteigen.',
	             buttons: Ext.Msg.OK,
	             icon: Ext.MessageBox.INFO
	         });
			return false;
			
				
		
		}
	},
	getData: function(){
		switch(this.changeSet){
		case 'Confirmation':
			return {
				confirmed_amount: Ext.getCmp('appropriation_confirmed_amount').getValue()
			};
	
		case 'Reallocation':
			return {
				confirmed_amount: Ext.getCmp('appropriation_confirmed_amount').getValue(),
				project_id: Ext.getCmp('appropriation_project_id').getValue(),
				appropriation_id: Ext.getCmp('appropriation_id').getValue()
			};
		case 'Liquidation':
			return {
				confirmed_amount: Ext.getCmp('appropriation_confirmed_amount').getValue()
			};
		case 'Reverse':
			return {
				confirmed_amount: Ext.getCmp('appropriation_confirmed_amount').getValue()
			};
		case 'RequestPayout':
			return {
				payout_amount: Ext.getCmp('appropriation_payout_amount').getValue(),
				approval_payout_query:Ext.getCmp('appropriation_payout_approval_payout_query').getValue()//,
				//payout_status:Ext.getCmp('appropriation_payout_status').getValue()
			};
		case 'Payout':
		case 'Payin':
			return {
				payout_amount: Ext.getCmp('appropriation_payout_amount').getValue()//,
				//approval_payout_query:Ext.getCmp('appropriation_payout_approval_payout_query').getValue()//,
				//payout_status:Ext.getCmp('appropriation_payout_status').getValue()
			};
		}
	},
	onReallocationChangeProject: function(){
		Ext.getCmp('appropriation_id').setProjectId(Ext.getCmp('appropriation_project_id').getValue());
	},
	/**
	 * 
	 * 
	 */
	getDataFields: function(){
		
		switch(this.changeSet){
		
		case 'Confirmation':
			
			var fields = Tine.FundProject.AppropriationFormFields.get();
			return [
			        Ext.apply(fields.confirmed_amount,{disabled:false})
				];
			
			
		case 'Reallocation':
			var fields = Tine.FundProject.AppropriationFormFields.get();
			return [
			    Ext.apply(fields.project_id,{
			    	disabled:false
			    }),
			    Tine.FundProject.Custom.getRecordPicker('Appropriation','appropriation_id',{
					disabledClass: 'x-item-disabled-view',
					width: 300,
					fieldLabel: 'Mittel',
				    name:'appropriation_id',
				    disabled: false,
				    blurOnSelect: true,
				    allowBlank:false
				}),
		        Ext.apply(fields.confirmed_amount,{
		        	disabled:false, 
		        	fieldLabel:'Betrag',
		        	maxValue: this.appropriationRecord.get('confirmed_amount'),
		        }),
		        
			];
			
			
			
		case 'Liquidation':
		case 'Reverse':
			var fields = Tine.FundProject.AppropriationFormFields.get();
			return [
		        Ext.apply(fields.confirmed_amount,{disabled:false, fieldLabel:'Betrag'})
			];
		
		case 'RequestPayout':
			return [
			{
				xtype: 'sopencurrencyfield',
				fieldLabel: 'Betrag Auszahlungsanforderung', 
				id:'appropriation_payout_amount',
				name:'payout_amount',
				disabledClass: 'x-item-disabled-view',
				blurOnSelect: true,
				maxValue: this.appropriationRecord.get('rest_amount'),
			    width:180
			},{
				xtype: 'checkbox',
				disabledClass: 'x-item-disabled-view',
				id: 'appropriation_payout_approval_payout_query',
				name: 'approval_payout_query',
				hideLabel:true,
				infoField:true,
			    boxLabel: 'Freigabe Anforderung Auszahlung',
			    width:200
			}/*,{
				fieldLabel: 'Status Auszahlung',
			    disabledClass: 'x-item-disabled-view',
			    id:'appropriation_payout_status',
			    name:'payout_status',
			    disabled:true,
			    width: 150,
			    xtype:'combo',
			    store:[['QUERY','Anfrage'],['PAYMENT','Zahlung']],
			    value: 'QUERY',
				mode: 'local',
				displayField: 'name',
			    valueField: 'id',
			    triggerAction: 'all'
			}     */
					
			];
			
		case 'Payout':
			return [
					{
						xtype: 'sopencurrencyfield',
						fieldLabel: 'Betrag', 
						id:'appropriation_payout_amount',
						name:'payout_amount',
						disabledClass: 'x-item-disabled-view',
						blurOnSelect: true,
						minValue: 0,
						maxValue: this.appropriationRecord.get('rest_amount'),
					    width:180
					}
							
					];
		case 'Payin':
			return [
					{
						xtype: 'sopencurrencyfield',
						fieldLabel: 'Betrag', 
						id:'appropriation_payout_amount',
						name:'payout_amount',
						disabledClass: 'x-item-disabled-view',
						blurOnSelect: true,
						minValue: 0,
					    width:180
					}
							
					];
		}
		
	},
	
	/**
	 * returns dialog
	 * 
	 * NOTE: when this method gets called, all initalisation is done.
	 */
	getFormItems: function() {
		//var fields = Tine.FundProject.SoMemberFormFields.get();
		
		var dialogItems = [];
		var items = dialogItems.concat(this.getDataFields())  ;
		
		var panel ={
			title: this.panelTitle,
			header:true,
	        xtype: 'panel',
	        layout:'fit',
	        anchor:'100%',
	        border: false,
	        frame:true,
	        items:[{xtype:'columnform', items:[
	        	 items  
	        ]}]
	    };
		
		return [panel];
		
		var wrapper = {
			xtype: 'panel',
			layout: 'border',
			frame: true,
			items: [
			   panel
			]
		
		};
		return wrapper;
	}
});

/**
 * FundProject Edit Popup
 */
Tine.FundProject.ChangeAppropriationDialog.openWindow = function (config) {
    // TODO: this does not work here, because of missing record
	record = {};
	var id = (config.record && config.record.id) ? config.record.id : 0;
    var window = Tine.WindowFactory.getWindow({
        width: 800,
        height: 300,
        name: Tine.FundProject.ChangeAppropriationDialog.prototype.windowNamePrefix + id,
        contentPanelConstructor: 'Tine.FundProject.ChangeAppropriationDialog',
        contentPanelConstructorConfig: config
    });
    return window;
};
