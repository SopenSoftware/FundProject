Ext.namespace('Tine.FundProject');

/**
 * Timeaccount grid panel
 */
Tine.FundProject.ProjectContactGridPanel = Ext.extend(Tine.widgets.grid.GridPanel, {
    recordClass: Tine.FundProject.Model.ProjectContact,
    evalGrants: false,
    // grid specific
    defaultSortInfo: {field: 'id', direction: 'DESC'},
    ddConfig:{
    	ddGroup: 'ddGroupContact'
    },
    gridConfig: {
        loadMask: true,
        autoExpandColumn: 'title'
    },
    initComponent: function() {
        this.recordProxy = Tine.FundProject.projectContactBackend;
        
        //this.actionToolbarItems = this.getToolbarItems();
        this.gridConfig.columns = this.getColumns();
        this.initFilterToolbar();
        
        this.plugins = this.plugins || [];
        this.plugins.push(this.filterToolbar);
        this.action_addContact = new Ext.Action({
            actionType: 'add',
            handler: this.addContact,
            iconCls: 'actionAdd',
            scope: this
        });
        this.on('afterrender', this.onAfterRender, this);
        Tine.FundProject.ProjectContactGridPanel.superclass.initComponent.call(this);
        this.pagingToolbar.add(
				 '->'
		);
		this.pagingToolbar.add(
			 Ext.apply(new Ext.Button(this.action_addContact), {
				 text: 'Projekt-Kontakt hinzufügen',
		         scale: 'small',
		         rowspan: 2,
		         iconAlign: 'left'
		     }
		));
    },
    initFilterToolbar: function() {
		//var quickFilter = [new Tine.widgets.grid.FilterToolbarQuickFilterPlugin()];	
		this.filterToolbar = new Tine.widgets.grid.FilterToolbar({
            app: this.app,
            filterModels: Tine.FundProject.Model.ProjectContact.getFilterModel(),
            defaultFilter: 'query',
            filters: [{field:'query',operator:'contains',value:''}],
            plugins: []
        });
    },  
    addContact: function(){
		this.addContactWin = Tine.FundProject.ProjectContactEditDialog.openWindow({
			projectRecord: this.projectRecord
		});
		this.addContactWin.on('beforeclose',this.onUpdateContact,this);
    },
    loadProject: function( projectRecord ){
    	this.projectRecord = projectRecord;
    	this.store.reload();
    },
    onStoreBeforeload: function(store, options) {
    	Tine.FundProject.ProjectContactGridPanel.superclass.onStoreBeforeload.call(this, store, options);
//    	if(!this.inDialog){
//    		return true;
//    	}
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
		   { id: 'project_contact_project_id', header: this.app.i18n._('Projekt'), dataIndex: 'project_id',renderer:Tine.FundProject.renderer.projectRenderer, sortable:true  },
		   { id: 'project_contact_project_role_id', header: this.app.i18n._('Projektrolle'), dataIndex: 'project_role_id',renderer:Tine.FundProject.renderer.projectRoleRenderer},
		   { id: 'project_contact_contact_id', header: this.app.i18n._('Kontakt'), dataIndex: 'contact_id',renderer:Tine.FundProject.renderer.contactRenderer  },
		   { id: 'project_contact_company', header: this.app.i18n._('Firma'), dataIndex: 'company' },
		   { id: 'project_contact_plz', header: this.app.i18n._('PLZ'), dataIndex: 'plz' },
		   { id: 'project_contact_location', header: this.app.i18n._('Ort'), dataIndex: 'location' }
        ];
	},
	addProjectContactFromContact: function(contact){
    	this.pWin = Tine.FundProject.ProjectContactEditDialog.openWindow({
    		projectRecord: this.projectRecord,
    		contactRecord: contact,
    		listeners: {
                scope: this,
                'update': function(record) {
                    this.onReloadProjectContact();
                }
            }
		});
		this.pWin.on('beforeclose',this.onReloadProjectContact,this);
    },
    onReloadProjectContact: function(){
    	this.store.reload();
    },
	 onAfterRender: function(){
			this.initDropZone();
	    },
	    initDropZone: function(){
	    	if(!this.ddConfig){
	    		return;
	    	}
			this.dd = new Ext.dd.DropTarget(this.el, {
				scope: this,
				ddGroup     : this.ddConfig.ddGroup,
				notifyEnter : function(ddSource, e, data) {
					this.scope.el.stopFx();
					this.scope.el.highlight();
				},
				onDragOver: function(e,id){
				},
				notifyDrop  : function(ddSource, e, data){
					return this.scope.onDrop(ddSource, e, data);
					//this.scope.addRecordFromArticle(data.selections[0]);
					//this.scope.fireEvent('drop',data.selections[0]);
					return true;
				}
			});
			// self drag/drop
			this.dd.addToGroup(this.gridConfig.ddGroup);
		},
		onDrop: function(ddSource, e, data){
			switch(ddSource.ddGroup){
			// if article gets dropped in: add new receipt position
			case 'ddGroupContact':
				return this.addProjectContactFromContact(data.selections[0]);
				break;
			}
		}
});