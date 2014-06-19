Ext.namespace('Tine.FundProject');

/**
 * Timeaccount grid panel
 */
Tine.FundProject.ProjectGridPanel = Ext.extend(Tine.widgets.grid.GridPanel, {
    recordClass: Tine.FundProject.Model.Project,
    inDialog: false,
    evalGrants: false,
    copyEditAction: true,
    // grid specific
    defaultSortInfo: {field: 'project_nr', direction: 'DESC'},
    gridConfig: {
        loadMask: true,
        autoExpandColumn: 'title'
    },
    initComponent: function() {
        this.recordProxy = Tine.FundProject.projectBackend;
        
        //this.actionToolbarItems = this.getToolbarItems();
        this.gridConfig.columns = this.getColumns();
        this.initFilterToolbar();
        
        this.plugins = this.plugins || [];
        this.plugins.push(this.filterToolbar);
        
        Tine.FundProject.ProjectGridPanel.superclass.initComponent.call(this);
    },
    initFilterToolbar: function() {
    	var plugins;
    	if(!this.inDialog){
    		plugins = [new Tine.widgets.grid.FilterToolbarQuickFilterPlugin()];	
    	}
    	
		this.filterToolbar = new Tine.widgets.grid.FilterToolbar({
            app: this.app,
            filterModels: Tine.FundProject.Model.Project.getFilterModel(),
            defaultFilter: 'query',
            filters: [{field:'query',operator:'contains',value:''}],
            plugins: plugins
        });
    },
    loadProject: function( projectRecord ){
    	this.projectRecord = projectRecord;
    	this.store.reload();
    },
    /**
     * generic edit in new window handler
     * -> just for unconventional handling of copy action!!
     * -> should be a hook in parent class
     */
    onEditInNewWindow: function(button, project) {
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
	getColumns: function() {
		return [
		        //{ id: 'id', header: this.app.i18n._('ID'), dataIndex: 'id', sortable:true },
		        { id: 'project_id', header: this.app.i18n._('Projektverbund-Nr'), dataIndex: 'project_id',renderer:Tine.FundProject.renderer.projectNrRenderer, sortable:true  },
		        
		        { id: 'department_id', header: this.app.i18n._('Referat'), dataIndex: 'department_id',renderer:Tine.FundProject.renderer.departmentRenderer, sortable:true  },
		        { id: 'leading_department_id', header: this.app.i18n._('Federf. Referat'), dataIndex: 'leading_department_id',renderer:Tine.FundProject.renderer.departmentRenderer, sortable:true  },
		        { id: 'promotion_area_id', header: this.app.i18n._('Förderbereich'), dataIndex: 'promotion_area_id',renderer:Tine.FundProject.renderer.promotionAreaRenderer, sortable:true  },
		        { id: 'project_nr', header: this.app.i18n._('Projekt-Nr'), dataIndex: 'project_nr', sortable:true },
		        { id: 'short_name', header: this.app.i18n._('Kurztitel'), dataIndex: 'short_name', sortable:true },
		        { id: 'name', header: this.app.i18n._('Titel'), dataIndex: 'name', sortable:true },
		        { id: 'description', header: this.app.i18n._('Beschreibung'), dataIndex: 'description', sortable:true },
		        { id: 'state', header: this.app.i18n._('Status'), dataIndex: 'state', sortable:false,renderer:Tine.FundProject.renderer.projectStateRenderer },
		        { id: 'aquisition_state', header: this.app.i18n._('Status Erwerb'), dataIndex: 'aquisition_state', sortable:false,renderer:Tine.FundProject.renderer.aquisitionStateRenderer },
		        { id: 'decision_committee', header: this.app.i18n._('entsch. Gremium'), dataIndex: 'decision_committee', sortable:false,renderer:Tine.FundProject.renderer.decisionCommitteeRenderer },
		        { id: 'approval_buha', header: this.app.i18n._('Freigabe Buha'), dataIndex: 'approval_buha', sortable:false,renderer:Tine.FundProject.renderer.booleanRenderer },
		        { id: 'agenda_topic', header: this.app.i18n._('Sitzung TOP'), dataIndex: 'agenda_topic', sortable:true },
		        { id: 'claim_entry_date', header: this.app.i18n._('Eingang Antrag'), dataIndex: 'claim_entry_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer },
		        { id: 'buha_finish_date', header: this.app.i18n._('Rechnerisch. Abschluß'), dataIndex: 'buha_finish_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer },
				{ id: 'project_finish_date', header: this.app.i18n._('Projektabschluß'), dataIndex: 'project_finish_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer },
				{ id: 'pr_contact_date', header: this.app.i18n._('Kontaktaufn. ÖA'), dataIndex: 'pr_contact_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer },
				{ id: 'pr_opening_date', header: this.app.i18n._('Eröffnung ÖA'), dataIndex: 'pr_opening_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer },
				{ id: 'pr_other_date', header: this.app.i18n._('sonst. Term. ÖA'), dataIndex: 'pr_other_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer },
		        { id: 'query_date', header: this.app.i18n._('Eingang Anfrage'), dataIndex: 'query_date', sortable:true, renderer: Tine.Tinebase.common.dateRenderer },
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
		        }
        ];
	}
});