Ext.namespace('Tine.FundProject');

/**
 * Timeaccount grid panel
 */
Tine.FundProject.AppropriationChangeGridPanel = Ext.extend(Tine.widgets.grid.GridPanel, {
    recordClass: Tine.FundProject.Model.AppropriationChange,
    evalGrants: false,
    copyEditAction: true,
    inDialog: false,
    perspective:null,
    // grid specific
    defaultSortInfo: {field: 'id', direction: 'DESC'},
    gridConfig: {
        loadMask: true,
        autoExpandColumn: 'title'
    },
    initComponent: function() {
        this.recordProxy = Tine.FundProject.appropriationChangeBackend;
        
        //this.actionToolbarItems = this.getToolbarItems();
        this.gridConfig.columns = this.getColumns();
        this.initFilterToolbar();
        
        this.plugins = this.plugins || [];
        this.plugins.push(this.filterToolbar);
        
        Tine.FundProject.AppropriationChangeGridPanel.superclass.initComponent.call(this);
        
    },
    initFilterToolbar: function() {
		var quickFilter = [new Tine.widgets.grid.FilterToolbarQuickFilterPlugin()];	
		this.filterToolbar = new Tine.widgets.grid.FilterToolbar({
            app: this.app,
            filterModels: Tine.FundProject.Model.AppropriationChange.getFilterModel(),
            defaultFilter: 'query',
            filters: [{field:'query',operator:'contains',value:''}],
            plugins: []
        });
    },
    loadAppropriation: function( appropriationRecord ){
    	this.appropriationRecord = appropriationRecord;
    	this.store.reload();
    },
    onStoreBeforeload: function(store, options) {
    	Tine.FundProject.AppropriationGridPanel.superclass.onStoreBeforeload.call(this, store, options);
    	if(!this.inDialog){
    		return true;
    	}
    	delete options.params.filter;
    	options.params.filter = [];
    	if(!this.appropriationRecord || this.appropriationRecord.id == 0){
    		this.store.removeAll();
    		return false;
    	}
    	//if(!this.perspective){}
    	var filter = {	
			field:'appropriation_id',
			operator:'AND',
			value:[{
				field:'id',
				operator:'equals',
				value: this.appropriationRecord.get('id')}]
		};
        options.params.filter.push(filter);
    },
    /**
     * generic edit in new window handler
     * -> just for unconventional handling of copy action!!
     * -> should be a hook in parent class
     */
    onEditInNewWindow: function(button, appropriationChange) {
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
		        //{ id: 'id', header: this.app.i18n._('ID'), dataIndex: 'id', sortable:true, hidden:true },
		        { id: 'appropriation_id', header: this.app.i18n._('Mittel-Nr'), dataIndex: 'appropriation_id', sortable:true, renderer: Tine.FundProject.renderer.appropriationRenderer},
		        { 
					   id: 'change_amount', header: 'Betrag Änderung', dataIndex: 'change_amount', sortable:true,
					   renderer: Sopen.Renderer.MonetaryNumFieldRenderer
			 	},
			 	{ 
					   id: 'change_claim_amount', header: 'Änderung beantr. Summe', dataIndex: 'change_claim_amount', sortable:true,
					   renderer: Sopen.Renderer.MonetaryNumFieldRenderer
			 	},
			 	{ id: 'appropriation_change_state', header: this.app.i18n._('Status'), dataIndex: 'state',renderer:Tine.FundProject.renderer.appropriationStateRenderer, sortable:true  },
		        
			 	{ id: 'appropriation_is_state_change', header: this.app.i18n._('Ist Statusänderung'), dataIndex: 'is_state_change',renderer:Tine.Tinebase.common.booleanRenderer, sortable:true  },
			 	{ id: 'appropriation_is_amount_change', header: this.app.i18n._('Ist Betragsänderung'), dataIndex: 'is_amount_change',renderer:Tine.Tinebase.common.booleanRenderer, sortable:true  },
			 	{ id: 'appropriation_is_rebooking', header: this.app.i18n._('Ist Umbuchung'), dataIndex: 'is_rebooking',renderer:Tine.Tinebase.common.booleanRenderer, sortable:true  },
			 	{ id: 'appropriation_rebooking_kind', header: this.app.i18n._('Umbuchungsstatus'), dataIndex: 'rebooking_kind',renderer:Tine.FundProject.renderer.rebookingStateRenderer, sortable:true  },
		        
			 	
		        { id: 'appropriation_change_comment', header: this.app.i18n._('Beschreibung'), dataIndex: 'comment'},
		        /*
		        { id: 'payout_status', header: this.app.i18n._('Status'), dataIndex: 'payout_status', sortable:true },
		        { id: 'booking_text', header: this.app.i18n._('Buchungstext'), dataIndex: 'booking_text', sortable:false },
		        { id: 'approval_payout_query', header: this.app.i18n._('Freigabe Auszahlung'), dataIndex: 'approval_payout_query', sortable:false },
		        { id: 'payout_query_date', header: this.app.i18n._('Eingang Antrag'), dataIndex: 'payout_query_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer },
		        { id: 'approval_payout_date', header: this.app.i18n._('Eingang Antrag'), dataIndex: 'approval_payout_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer },
		        { id: 'booking_payout_date', header: this.app.i18n._('Eingang Antrag'), dataIndex: 'booking_payout_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer },
		        { id: 'claim_entry_date', header: this.app.i18n._('Eingang Antrag'), dataIndex: 'claim_entry_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer }*/
		        { 
			 		id: 'created_by',      header: 'angelegt von',             width: 220, dataIndex: 'created_by',            
			 		renderer: Tine.Tinebase.common.usernameRenderer 
			 	},
			 	{ 
			 		id: 'last_modified_by',      header: 'zuletzt geändert von',             width: 220, dataIndex: 'last_modified_by',            
			 		renderer: Tine.Tinebase.common.usernameRenderer 
			 	},
		        { 
		        	id: 'creation_time', header: 'angelegt am', dataIndex: 'creation_time', renderer: Tine.Tinebase.common.dateRenderer , sortable:true
		        },
		        {
		        	id: 'last_modified_time', header: 'zuletzt geändert am', dataIndex: 'last_modified_time', renderer: Tine.Tinebase.common.dateRenderer 
			    }
        ];
	}
});