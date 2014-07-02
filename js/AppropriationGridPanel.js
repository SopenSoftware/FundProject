Ext.namespace('Tine.FundProject');

/**
 * Timeaccount grid panel
 */
Tine.FundProject.AppropriationGridPanel = Ext.extend(Tine.widgets.grid.GridPanel, {
    recordClass: Tine.FundProject.Model.Appropriation,
    evalGrants: false,
    copyEditAction: true,
    inDialog: false,
    // grid specific
    defaultSortInfo: {field: 'appropriation_nr', direction: 'DESC'},
    gridConfig: {
        loadMask: true,
        autoExpandColumn: 'title'
    },
    initComponent: function() {
        this.recordProxy = Tine.FundProject.appropriationBackend;
        
        //this.actionToolbarItems = this.getToolbarItems();
        this.gridConfig.columns = this.getColumns();
        this.initFilterToolbar();
        
        this.plugins = this.plugins || [];
        this.plugins.push(this.filterToolbar);
        this.action_addAppropriation = new Ext.Action({
            actionType: 'add',
            handler: this.addAppropriation,
            iconCls: 'actionAdd',
            scope: this
        });
        Tine.FundProject.AppropriationGridPanel.superclass.initComponent.call(this);
        this.pagingToolbar.add(
				 '->'
		);
		this.pagingToolbar.add(
			 Ext.apply(new Ext.Button(this.action_addAppropriation), {
				 text: 'Mittel hinzufügen',
		         scale: 'small',
		         rowspan: 2,
		         iconAlign: 'left'
		     }
		));
    },
    initActions: function(){
		
		// get actions from Api and bind handlers to api instance
		// this is for using actions together with grid (no code duplication necessary anymore)
		Tine.FundProject.Api.Appropriation.getActions(this);
		this.supr().initActions.call(this);
	},
	getContextMenuItems: function(){
    	return [
    	  '-',
    	  this.action_confirmAppropriation,
    	  this.actions_rebooking,
    	  this.action_requestPayout
    	];
    },
    addAppropriation: function(checked){
    	
    	if(this.projectRecord && ((checked===true) || this.checkCanAddAppropriation())){
    		this.addAppropriationWin = Tine.FundProject.AppropriationEditDialog.openWindow({
    			projectRecord: this.projectRecord
    		});
    		this.addAppropriationWin.on('beforeclose',this.onUpdateAppropriation,this);
    	}
    },
    checkCanAddAppropriation: function(){
	    Ext.Ajax.request({
			scope:this,
	        params: {
	            method: 'FundProject.projectCanAddAppropriation',
	            projectId:  this.projectRecord.get('id')
	        },
	        success: this.onCheckCanAddAppropriation,
	        failure: this.onCheckCanAddAppropriationFailure
	    });
	},
	onCheckCanAddAppropriation: function(response){
		var result = Ext.util.JSON.decode(response.responseText);
		
		if(result.success == true && result.check == true){
		
			this.addAppropriation(true);
		}else{
			var messages = result.noAddMessages;
			
			Ext.MessageBox.show({
	             title: 'Hinweis', 
	             msg: messages.join('</br>'),
	             buttons: Ext.Msg.OK,
	             icon: Ext.MessageBox.INFO
	         });
			
		}
	},
	onCheckCanAddAppropriationFailure: function(){
		Ext.MessageBox.show({
            title: 'Fehler', 
            msg: 'Beim Versuch ein Mittel für das Projekt anzulegen, ist ein Fehler aufgetreten.',
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.INFO
        });
	},
    initFilterToolbar: function() {
		var quickFilter = [new Tine.widgets.grid.FilterToolbarQuickFilterPlugin()];	
		this.filterToolbar = new Tine.widgets.grid.FilterToolbar({
            app: this.app,
            filterModels: Tine.FundProject.Model.Appropriation.getFilterModel(),
            defaultFilter: 'query',
            filters: [{field:'query',operator:'contains',value:''}],
            plugins: []
        });
    },
    onUpdateAppropriation: function(){
		this.grid.store.reload();
		//this.fireEvent('modifyattendance');
	},
    loadProject: function( projectRecord ){
    	this.projectRecord = projectRecord;
    	this.store.reload();
    },
    getSelectedRecord: function(){
    	var selectedRows = this.grid.getSelectionModel().getSelections();
    	if(selectedRows.length>0){
    		return selectedRows[0];
    	}
    	return null;
    },
    onStoreBeforeload: function(store, options) {
    	Tine.FundProject.AppropriationGridPanel.superclass.onStoreBeforeload.call(this, store, options);
    	if(!this.inDialog){
    		return true;
    	}
    	delete options.params.filter;
    	options.params.filter = [];
    	if(!this.projectRecord || this.projectRecord.id == 0){
    		this.store.removeAll();
    		return false;
    	}
    	var filter = {	
			field:'project_id',
			operator:'AND',
			value:[{
				field:'id',
				operator:'equals',
				value: this.projectRecord.get('id')}]
		};
        options.params.filter.push(filter);
    },
    /**
     * generic edit in new window handler
     * -> just for unconventional handling of copy action!!
     * -> should be a hook in parent class
     */
    onEditInNewWindow: function(button, appropriation) {
        var record; 
        if (button.actionType == 'edit') {
            if (! this.action_editInNewWindow || this.action_editInNewWindow.isDisabled()) {
                // if edit action is disabled or not available, we also don't open a new window
                return false;
            }
            var selectedRows = this.grid.getSelectionModel().getSelections();
            record = selectedRows[0];
            
        } else if (button.actionType == 'copy') {
            var selectedRows = this.grid.getSelectionModel().getSelections();
            record = this.copyRecord(selectedRows[0].data);
        } else {
            record = new this.recordClass(this.recordClass.getDefaultData(), 0);
        }
        
        var popupWindow = Tine[this.app.appName][this.recordClass.getMeta('modelName') + 'EditDialog'].openWindow({
            record: record,
            listeners: {
                scope: this,
                'update': function(record) {
                    this.loadData(true, true, true);
                }
            }
        });
    },
	getColumns: function() {
		return [
		       // { id: 'appropriation_id', header: this.app.i18n._('Appropriation-ID'), dataIndex: 'id', sortable:true },
		        { id: 'appropriation_project_id', header: this.app.i18n._('Projekt'), dataIndex: 'project_id',renderer:Tine.FundProject.renderer.projectRenderer, sortable:true  },
		        { id: 'appropriation_nr', header: this.app.i18n._('Mittel-Nr'), dataIndex: 'appropriation_nr', sortable:true },
		        
		        { id: 'appropriation_name', header: this.app.i18n._('Bezeichnung'), dataIndex: 'name', sortable:true },
		        { id: 'appropriation_comment', header: this.app.i18n._('Beschreibung'), dataIndex: 'comment', sortable:true },
		        
		        
		        { id: 'appropriation_funds_category_id', header: this.app.i18n._('Mittelkategorie'), dataIndex: 'funds_category_id', renderer: Tine.FundProject.renderer.fundsCategoryRenderer, sortable:true },
		        { id: 'appropriation_funds_kind_id', header: this.app.i18n._('Mittelart'), dataIndex: 'funds_kind_id', renderer: Tine.FundProject.renderer.fundsKindRenderer, sortable:true },

		        { id: 'appropriation_state', header: this.app.i18n._('Status'), dataIndex: 'state',renderer:Tine.FundProject.renderer.appropriationStateRenderer, sortable:true  },
		        { 
					   id: 'appropriation_amount', header: 'Betrag', dataIndex: 'amount', sortable:true,
					   renderer: Sopen.Renderer.MonetaryNumFieldRenderer
		        },{ 
					   id: 'appropriation_proposal_amount', header: 'Vorschlagssumme', dataIndex: 'proposal_amount', sortable:true,
					   renderer: Sopen.Renderer.MonetaryNumFieldRenderer
		        },{ 
					   id: 'appropriation_payout_amount', header: 'Summe Ausz.', dataIndex: 'payout_amount', sortable:true,
					   renderer: Sopen.Renderer.MonetaryNumFieldRenderer
		        },{ 
					   id: 'appropriation_confirmed_amount', header: 'Summe bew.', dataIndex: 'confirmed_amount', sortable:true,
					   renderer: Sopen.Renderer.MonetaryNumFieldRenderer
		        },{ 
					   id: 'appropriation_rest_amount', header: 'Restsumme', dataIndex: 'rest_amount', sortable:true,
					   renderer: Sopen.Renderer.MonetaryNumFieldRenderer
		        },
		        { id: 'appropriation_approval_draft_date', header: this.app.i18n._('Bewilligungsvorlage'), dataIndex: 'approval_draft_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer },
		        { id: 'appropriation_debit_position_date', header: this.app.i18n._('Sollstellungsdatum Bewilligung'), dataIndex: 'debit_position_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer },
		        { id: 'appropriation_decision_date', header: this.app.i18n._('Beschlussdatum'), dataIndex: 'decision_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer },
		        { id: 'order_id', header: this.app.i18n._('Auftrags-Nr'), dataIndex: 'order_id', sortable:true, renderer: Tine.Billing.renderer.orderRenderer },	
		           
		        { 
			 		id: 'created_by',      header: 'angelegt von',             width: 220, dataIndex: 'created_by',            
			 		renderer: Tine.Tinebase.common.usernameRenderer 
			 	},
			 	{ 
			 		id: 'last_modified_by',      header: 'zuletzt geändert von',             width: 220, dataIndex: 'last_modified_by',            
			 		renderer: Tine.Tinebase.common.usernameRenderer 
			 	},
		        { 
		        	id: 'creation_time', header: 'angelegt am', dataIndex: 'creation_time', renderer: Tine.Tinebase.common.dateRenderer 
		        },
		        {
		        	id: 'last_modified_time', header: 'zuletzt geändert am', dataIndex: 'last_modified_time', renderer: Tine.Tinebase.common.dateRenderer 
			    }
        ];
	}
});