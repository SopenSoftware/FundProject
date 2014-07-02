Ext.namespace('Tine.Eventmanager');

/**
 * Timeaccount grid panel
 */
Tine.Eventmanager.EventGridPanel = Ext.extend(Tine.widgets.grid.GridPanel, {
    recordClass: Tine.Eventmanager.Model.Event,
    evalGrants: false,
    copyEditAction: true,
    // grid specific
    defaultSortInfo: {field: 'event_nr', direction: 'DESC'},
    gridConfig: {
        loadMask: true,
        autoExpandColumn: 'title'
    },
    initComponent: function() {
        this.recordProxy = Tine.Eventmanager.eventBackend;
        
        //this.actionToolbarItems = this.getToolbarItems();
        this.gridConfig.columns = this.getColumns();
        this.initFilterToolbar();
        
        this.plugins = this.plugins || [];
        this.plugins.push(this.filterToolbar);
        
        Tine.Eventmanager.EventGridPanel.superclass.initComponent.call(this);
    },
    initFilterToolbar: function() {
		var quickFilter = [new Tine.widgets.grid.FilterToolbarQuickFilterPlugin()];	
		this.filterToolbar = new Tine.widgets.grid.FilterToolbar({
            app: this.app,
            filterModels: Tine.Eventmanager.Model.Event.getFilterModel(),
            defaultFilter: 'query',
            filters: [{field:'query',operator:'contains',value:''}],
            plugins: quickFilter
        });
    },
    /**
     * generic edit in new window handler
     * -> just for unconventional handling of copy action!!
     * -> should be a hook in parent class
     */
    onEditInNewWindow: function(button, event) {
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
            record.set('jpeg_header', null);
            record.set('jpeg_footer', null);
            record.set('header_public_link', null);
            record.set('footer_public_link', null);
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
		        { id: 'id', header: this.app.i18n._('Event-ID'), dataIndex: 'id', sortable:true },
		        { id: 'event_nr', header: this.app.i18n._('Event-Nr'), dataIndex: 'event_nr', sortable:true },
		        { id: 'name', header: this.app.i18n._('Bezeichnung'), dataIndex: 'name', sortable:true },
		        { id: 'description', header: this.app.i18n._('Beschreibung'), dataIndex: 'description', sortable:true },
		        { id: 'location', header: this.app.i18n._('Ort'), dataIndex: 'location', sortable:true },
		        
		        { id: 'event_id', header: this.app.i18n._('gehört zu Veranstaltung'), dataIndex: 'event_id',renderer:Tine.Eventmanager.renderer.eventRenderer, sortable:true  },
		        { id: 'organizer_id', header: this.app.i18n._('Veranstalter'), dataIndex: 'organizer_id',renderer:Tine.Eventmanager.renderer.organizerRenderer, sortable:true  },
		        { id: 'resp_organizer_id', header: this.app.i18n._('verantw. Veranstalter'), dataIndex: 'resp_organizer_id',renderer:Tine.Eventmanager.renderer.organizerRenderer, sortable:true  },

		        { id: 'ev_kind_id', header: this.app.i18n._('Art'), dataIndex: 'ev_kind_id', renderer: Tine.Eventmanager.renderer.eventKindRenderer, sortable:true },
		        { id: 'ev_category_id', header: this.app.i18n._('Kategorie'), dataIndex: 'ev_category_id', renderer: Tine.Eventmanager.renderer.eventCategoryRenderer, sortable:true },

		        { id: 'planning_state', header: this.app.i18n._('Planungsstatus'), dataIndex: 'planning_state',renderer:Tine.Eventmanager.renderer.planningStateRenderer, sortable:true  },
		        { id: 'preset_reg_state', header: this.app.i18n._('Voreinst. Anmeldestatus'), dataIndex: 'preset_reg_state',renderer:Tine.Eventmanager.renderer.regStateRenderer, sortable:true  },
		        { id: 'preset_overbook_state', header: this.app.i18n._('Voreinst. Überbuch.stat.'), dataIndex: 'preset_overbook_state',renderer:Tine.Eventmanager.renderer.overbookStateRenderer, sortable:true  },
		        { id: 'att_min', header: this.app.i18n._('TN min'), dataIndex: 'att_min', sortable:true },
		        { id: 'att_max', header: this.app.i18n._('TN max'), dataIndex: 'att_max', sortable:true },
		        { id: 'att_res', header: this.app.i18n._('TN reserviert'), dataIndex: 'att_res', sortable:true },
		        { id: 'att_reg', header: this.app.i18n._('TN angemeldet'), dataIndex: 'att_reg', sortable:true },
		        { id: 'att_wait', header: this.app.i18n._('TN Warteliste'), dataIndex: 'att_wait', sortable:true },
		              
		      
		        //{ id: 'event_id', header: this.app.i18n._('gehört zu Veranstaltung'), dataIndex: 'event_id'  },
		        //{ id: 'event_nr', header: this.app.i18n._('Event-Nr'), dataIndex: 'event_nr', sortable:true }		               
		   
        ];
	}
});