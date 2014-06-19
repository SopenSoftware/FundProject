Ext.namespace('Tine.FundProject');

/**
 * Timeaccount grid panel
 */
Tine.FundProject.ProjectRoleGridPanel = Ext.extend(Tine.widgets.grid.GridPanel, {
    recordClass: Tine.FundProject.Model.ProjectRole,
    evalGrants: false,
    // grid specific
    defaultSortInfo: {field: 'name', direction: 'DESC'},
    gridConfig: {
        loadMask: true,
        autoExpandColumn: 'title'
    },
    initComponent: function() {
        this.recordProxy = Tine.FundProject.projectRoleBackend;
        
        //this.actionToolbarItems = this.getToolbarItems();
        this.gridConfig.columns = this.getColumns();
        this.initFilterToolbar();
        
        this.plugins = this.plugins || [];
        this.plugins.push(this.filterToolbar);
        
        Tine.FundProject.ProjectRoleGridPanel.superclass.initComponent.call(this);
    },
    initFilterToolbar: function() {
		//var quickFilter = [new Tine.widgets.grid.FilterToolbarQuickFilterPlugin()];	
		this.filterToolbar = new Tine.widgets.grid.FilterToolbar({
            app: this.app,
            filterModels: Tine.FundProject.Model.ProjectRole.getFilterModel(),
            defaultFilter: 'query',
            filters: [{field:'query',operator:'contains',value:''}],
            plugins: []
        });
    },  
    
	getColumns: function() {
		return [
		   { id: 'name', header: this.app.i18n._('Bezeichnung'), dataIndex: 'name', sortable:true },		      
		   { id: 'key', header: this.app.i18n._('Schlüssel'), dataIndex: 'key', sortable:true },		     
		   { id: 'is_default', header: this.app.i18n._('als Voreinstellung'), renderer: Tine.FundProject.renderer.isDefault, dataIndex: 'is_default', sortable:false}
        ];
	}
});