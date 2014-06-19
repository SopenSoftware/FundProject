Ext.namespace('Tine.FundProject');

/**
 * Timeaccount grid panel
 */
Tine.FundProject.AppropriationPayoutGridPanel = Ext.extend(Tine.widgets.grid.GridPanel, {
    recordClass: Tine.FundProject.Model.AppropriationPayout,
    evalGrants: false,
    copyEditAction: true,
    inDialog: false,
    perspective:'APPROPRIATION',
    // grid specific
    defaultSortInfo: {field: 'id', direction: 'DESC'},
    appropriationRecord:null,
    projectRecord:null,
    gridConfig: {
        loadMask: true,
        autoExpandColumn: 'title'
    },
    initComponent: function() {
        this.recordProxy = Tine.FundProject.appropriationPayoutBackend;
        
        //this.actionToolbarItems = this.getToolbarItems();
        this.gridConfig.columns = this.getColumns();
        this.initFilterToolbar();
        
        this.plugins = this.plugins || [];
        this.plugins.push(this.filterToolbar);
        
        Tine.FundProject.AppropriationPayoutGridPanel.superclass.initComponent.call(this);
        
    },
    initFilterToolbar: function() {
		var quickFilter = [new Tine.widgets.grid.FilterToolbarQuickFilterPlugin()];	
		this.filterToolbar = new Tine.widgets.grid.FilterToolbar({
            app: this.app,
            filterModels: Tine.FundProject.Model.AppropriationPayout.getFilterModel(),
            defaultFilter: 'query',
            filters: [{field:'query',operator:'contains',value:''}],
            plugins: []
        });
    },
    initActions: function(){
		
		// get actions from Api and bind handlers to api instance
		// this is for using actions together with grid (no code duplication necessary anymore)
		Tine.FundProject.Api.AppropriationPayout.getActions(this);
		this.supr().initActions.call(this);
	},
	getActionToolbarItems: function() {
    	return [
            Ext.apply(new Ext.Button(this.action_releasePayout), {
                scale: 'medium',
                rowspan: 2,
                iconAlign: 'top',
                iconCls: 'action_edit'
            }),
            Ext.apply(new Ext.Button(this.action_execPayout), {
                scale: 'medium',
                rowspan: 2,
                iconAlign: 'top',
                iconCls: 'tinebase-action-export-csv'
            })
        ];
    },
	getContextMenuItems: function(){
    	return [
    	  '-',
    	  this.action_releasePayout,
    	  this.action_execPayout
    	];
    },
    loadAppropriation: function( appropriationRecord ){
    	this.appropriationRecord = appropriationRecord;
    	this.store.reload();
    },
    loadProject: function( projectRecord ){
    	this.projectRecord = projectRecord;
    	this.store.reload();
    },
    onStoreBeforeload: function(store, options) {
    	Tine.FundProject.AppropriationGridPanel.superclass.onStoreBeforeload.call(this, store, options);
    	if(!this.inDialog){
    		return true;
    	}
    	delete options.params.filter;
    	options.params.filter = [];
    	if(this.perspective == 'APPROPRIATION'){
	    	if(!this.appropriationRecord || this.appropriationRecord.id == 0){
	    		this.store.removeAll();
	    		return false;
	    	}
    	}else if(this.perspective == 'PROJECT'){
    		if(!this.projectRecord || this.projectRecord.id == 0){
	    		this.store.removeAll();
	    		return false;
	    	}
    	}
    	var field = 'appropriation_id';
    	var record = this.appropriationRecord;
    	var filter;
    	
    	if(this.perspective == 'PROJECT'){
    		var field = 'project_id';
        	var record = this.projectRecord;
        	filter = {	
				field: field,
				operator:'equals',
				value: record.get('id')
			};
    	}else{
    		filter = {	
				field: field,
				operator:'AND',
				value:[{
					field:'id',
					operator:'equals',
					value: record.get('id')}]
			};
    	}
    	
        options.params.filter.push(filter);
    },
    /**
     * generic edit in new window handler
     * -> just for unconventional handling of copy action!!
     * -> should be a hook in parent class
     */
    onEditInNewWindow: function(button, appropriationPayout) {
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
		        { id: 'id', header: this.app.i18n._('ID'), dataIndex: 'id', sortable:true, hidden:true },
		        { id: 'appropriation_id', header: this.app.i18n._('Mittel-Nr'), dataIndex: 'appropriation_id', sortable:true, renderer: Tine.FundProject.renderer.appropriationRenderer},
		        { 
					   id: 'amount', header: 'Betrag', dataIndex: 'amount', sortable:true,
					   renderer: Sopen.Renderer.MonetaryNumFieldRenderer
			 	},
		        //{ id: 'appropriation_name', header: this.app.i18n._('Bezeichnung'), dataIndex: 'name', sortable:true },
		        { id: 'payout_status', header: this.app.i18n._('Status'), dataIndex: 'payout_status', sortable:true, renderer:Tine.FundProject.renderer.payoutStateRenderer },
		        { id: 'payout_type', header: this.app.i18n._('Typ'), dataIndex: 'payout_type', sortable:true, renderer:Tine.FundProject.renderer.payoutTypeRenderer },
			       
		        { id: 'booking_text', header: this.app.i18n._('Buchungstext'), dataIndex: 'booking_text', sortable:false },
		        { id: 'approval_payout_query', header: this.app.i18n._('Freigabe Anf. Auszahlung'), dataIndex: 'approval_payout_query', sortable:false },
		        { id: 'payout_date', header: this.app.i18n._('Datum Auszahlung'), dataIndex: 'payout_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer },
			    { id: 'payout_query_date', header: this.app.i18n._('Datum Ausz.anford.'), dataIndex: 'payout_query_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer },
		        { id: 'approval_payout_date', header: this.app.i18n._('Freigabe Auszahlung'), dataIndex: 'approval_payout_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer },
		        { id: 'booking_payout_date', header: this.app.i18n._('Buchung Ausz.'), dataIndex: 'booking_payout_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer }
		        
		        
        ];
	}
});