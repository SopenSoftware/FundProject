Ext.namespace('Tine.Eventmanager');

Tine.Eventmanager.EventEditDialog = Ext.extend(Tine.widgets.dialog.EditDialog, {
	
	/**
	 * @private
	 */
	windowNamePrefix: 'EventEditWindow_',
	appName: 'Eventmanager',
	recordClass: Tine.Eventmanager.Model.Event,
	recordProxy: Tine.Eventmanager.eventBackend,
	loadRecord: false,
	evalGrants: false,
	
	initComponent: function(){
		this.on('load',this.onLoadEvent, this);
		this.on('afterrender',this.onAfterRender,this);
		this.initDependentGrids();
		
		this.action_sendConfirmationMails = new Ext.Action({
            actionType: 'edit',
            text: 'Anmeldebestätigung senden',
            handler: this.sendConfirmMails,
            iconCls: 'action_composeEmail',
            scope: this
        });
		
		this.action_sendStateMails = new Ext.Action({
            actionType: 'edit',
            text: 'Statusmails senden',
            //disabled:true,
            handler: this.sendStateMails,
            iconCls: 'action_composeEmail',
            scope: this
        });
		
		this.action_sendChangeMails = new Ext.Action({
            actionType: 'edit',
            text: 'Änderungsmails senden',
            //disabled:true,
            handler: this.sendChangeMails,
            iconCls: 'action_composeEmail',
            scope: this
        });
		
		this.action_printAttenders = new Ext.Action({
            actionType: 'edit',
            handler: this.printAttenders,
            iconCls: 'action_exportAsPdf',
            scope: this
        });
		
		this.action_addCalEvent = new Ext.Action({
            actionType: 'add',
            handler: this.onAddCalEvent,
            text: 'Termin anlegen',
            disabled:true,
            iconCls: 'actionAdd',
            scope: this
        });
		
		this.action_editCalEvent = new Ext.Action({
            actionType: 'edit',
            handler: this.onEditCalEvent,
            text: 'Termin bearbeiten',
            disabled:true,
            iconCls: 'action_edit',
            scope: this
        });
		
		this.action_deleteCalEvent = new Ext.Action({
            actionType: 'delete',
            handler: this.onDeleteCalEvent,
            text: 'Termin löschen',
            iconCls: 'action_delete',
            disabled:true,
            scope: this
        });
		
		
		 this.actions_sendMail = new Ext.Action({
	        	allowMultiple: false,
	            text: 'Email an Teilnehmer',
	            menu:{
	            	items:[
						   this.action_sendConfirmationMails,
						   this.action_sendStateMails,
						   this.action_sendChangeMails
	            	]
	            }
	        });
		this.buttonAddCalEvent = new Ext.Button(this.action_addCalEvent);
		this.buttonEditCalEvent = new Ext.Button(this.action_editCalEvent);
		this.buttonDeleteCalEvent = new Ext.Button(this.action_deleteCalEvent);
		
		
		Tine.Eventmanager.EventEditDialog.superclass.initComponent.call(this);
	},
    initButtons: function(){
    	Tine.Eventmanager.EventEditDialog.superclass.initButtons.call(this);
		this.tbar = [
      	   Ext.apply(new Ext.SplitButton(this.actions_sendMail), {
  				 scale: 'small',
  	             rowspan: 2,
  	             iconAlign: 'left'
  	        }),
  	      Ext.apply(new Ext.Button(this.action_printAttenders), {
				 text: 'TN-Liste drucken',
	             scale: 'small',
	             rowspan: 2,
	             iconAlign: 'left'
	        })
  	    ];
    	
        this.fbar = [
             '->',
             this.action_applyChanges,
             this.action_cancel,
             this.action_saveAndClose
        ];
    },
    sendConfirmMails: function(){
    	var eventId =  this.record.get('id');
		var data = [];
		Ext.Ajax.request({
			scope: this,
			success: this.onSendConfirmMails,
			params: {
				method: 'Eventmanager.sendAttenderMails',
				eventId: eventId,
				actionType: 'REGISTRATION',
				data: data
			},
			failure: this.onSendConfirmMailsFailure
		});
    },
    onSendConfirmMails: function(){
    	
    },
    onSendConfirmMailsFailure: function(){
    	
    },
    sendStateMails: function(){
    	var eventId =  this.record.get('id');
		var data = [];
		Ext.Ajax.request({
			scope: this,
			success: this.onSendStateMails,
			params: {
				method: 'Eventmanager.sendAttenderMails',
				eventId: eventId,
				actionType: 'STATEMESSAGE',
				data: data
			},
			failure: this.onSendStateMailsFailure
		});
    },
    onSendStateMails: function(){
    	
    },
    onSendStateMailsFailure: function(){
    	
    },
    sendChangeMails: function(){
    	var eventId =  this.record.get('id');
		var data = [];
		Ext.Ajax.request({
			scope: this,
			success: this.onSendChangeMails,
			params: {
				method: 'Eventmanager.sendAttenderMails',
				eventId: eventId,
				actionType: 'CHANGEMESSAGE',
				data: data
			},
			failure: this.onSendChangeMailsFailure
		});
    },
    onSendChangeMails: function(){
    	
    },
    onSendChangeMailsFailure: function(){
    	
    },
    printAttenders: function(){
		var win = Tine.Eventmanager.PrintAttendanceDialog.openWindow({
			panelTitle: 'Teilnehmerliste drucken',
    		actionType: 'printAttenders',
    		defaultFilter: 'query',
    		appendFilters: [
				{	
					field:'event_id',
					operator:'AND',
					value:[{
						field:'id',
						operator:'equals',
						value: this.record.get('id')}]
				}              
    		],
    		predefinedFilter:[
//				{
//					field:'reg_state',
//					operator: 'equals',
//					value: 'RESERVATION'
//				}     
			]
		});
    },
    
	initDependentGrids: function(){
		this.attendanceGrid = new Tine.Eventmanager.AttendanceGridPanel({
			title:'Teilnehmer',
			layout:'border',
			disabled:true,
			frame: true,
			app: Tine.Tinebase.appMgr.get('Eventmanager')
		});
		this.attendanceGrid.on('modifyattendance', this.onModifyAttendance, this);
		this.hotelsGrid = new Tine.Eventmanager.EventHotelGridPanel({
			title:'Hotels',
			layout:'border',
			disabled:true,
			frame: true,
			app: Tine.Tinebase.appMgr.get('Eventmanager')
		});
		this.hotelsGrid.on('modifyhotel', this.onModifyHotel, this);
		
		this.workflowGridPanel = new Tine.Eventmanager.WorkflowGridPanel({
			header:false,
			width:400,
			layout:'border',
			region:'center',
			disabled:true,
			frame: true,
			app: Tine.Tinebase.appMgr.get('Eventmanager'),
			autoSelectFirstRow: true
		});
		
		this.workflowGridPanel.on('selectrow', this.selectWorkflow, this);
		
		this.workflowElemGridPanel = new Tine.Eventmanager.WorkflowElemGridPanel({
			header:false,
			width:400,
			height:200,
			collapsible:true,
			layout:'border',
			region:'center',
			disabled:true,
			frame: true,
			app: Tine.Tinebase.appMgr.get('Eventmanager'),
			autoSelectFirstRow: true
		});
		
		this.workflowElemGridPanel.on('selectrow', this.selectWorkflowElem, this);
		
		this.workflowSubElemGridPanel = new Tine.Eventmanager.WorkflowSubElemGridPanel({
			header:false,
			width:400,
			layout:'border',
			region:'south',
			split:true,
			//disabled:true,
			frame: true,
			app: Tine.Tinebase.appMgr.get('Eventmanager')
		});
		this.workflowSubPanel = new Ext.Panel({
			layout:'border',
			region:'east',
			split:true,
			width:400,
			items:[
			       this.workflowElemGridPanel,
			       this.workflowSubElemGridPanel
			]
		});
		this.workflowPanel = new Ext.Panel({
			title:'Workflows',
			layout:'border',
			disabled:true,
			items:[
			       this.workflowGridPanel,
			       this.workflowSubPanel
			]
		});
	},
	selectWorkflow: function(sm){
		// should only be one record in array (single selection)
		var selRecords = sm.getSelections();
		var selRecord = selRecords[0];
		// load property grid according to selected position
		this.workflowElemGridPanel.enable();
		this.workflowElemGridPanel.loadWorkflow(selRecord);
	},
	selectWorkflowElem: function(sm){
		// should only be one record in array (single selection)
		var selRecords = sm.getSelections();
		var selRecord = selRecords[0];
		// load property grid according to selected position
		this.workflowSubElemGridPanel.enable();
		this.workflowSubElemGridPanel.loadWorkflowElem(selRecord);
	},
	onLoadEvent: function(){
		if(this.record.id !== 0){
			// enable attendance grid if record has id
			this.attendanceGrid.enable();
			this.attendanceGrid.loadEvent(this.record);
			this.hotelsGrid.enable();
			this.hotelsGrid.loadEvent(this.record);
			this.workflowPanel.enable();
			this.workflowGridPanel.enable();
			this.workflowGridPanel.loadEvent(this.record);
			
		}
	},
	onAfterRender: function(){
		if(this.record.id !== 0){
			// disable buttons
			//this.buttonAddCalEvent.disable();
			this.buttonEditCalEvent.enable();
			this.buttonDeleteCalEvent.enable();
			this.hotelsGrid.loadEvent(this.record);
			// enable buttons
		}else{
			//this.buttonAddCalEvent.enable();
			this.buttonEditCalEvent.disable();
			this.buttonDeleteCalEvent.disable();
			
			Ext.getCmp('event_organizer_id').selectDefault();
			Ext.getCmp('event_responsible_organizer_id').selectDefault();
			Ext.getCmp('event_ev_category_id').selectDefault();
			Ext.getCmp('event_event_kind_id').selectDefault();
		}
	},
	onAddCalEvent: function(){
		
	},
	onEditCalEvent: function(){
		var data = this.record.getForeignRecord(Tine.Calendar.Model.Event,'cal_event_id');
		
		var win = Tine.Calendar.EventEditDialog.openWindow({
			record: new Tine.Calendar.Model.Event(data,this.record.get('cal_event_id')),
			mode: 'remote',
			recordId: this.record.get('cal_event_id')
		});
	},
	onDeleteCalEvent: function(){
		
	},
	onModifyAttendance: function(){
		// reload record -> in order to get correct counts of attendances
		this.initRecord();
	},
	onModifyHotel: function(){
		
	},
	/**
	 * returns dialog
	 * 
	 * NOTE: when this method gets called, all initalisation is done.
	 */
	getFormItems: function() {
		var calToolbar = new Ext.Toolbar({height:26,items:
		[
		 	'->',
		 	//this.buttonAddCalEvent,
		 	this.buttonEditCalEvent,
		 	this.buttonDeleteCalEvent
		]});
		
		var notesPanel = new Ext.Panel({
		    layout: 'accordion',
            border: true,
            animate: true,        	
            region: 'east',
            width: 210,
			maxWidth: 300,
            split: true,
            collapsible: true,
            collapseMode: 'mini',
            collapsed:true,
            items: [
                new Tine.widgets.tags.TagPanel({
                    app: 'EventManager',
                    border: false,
                    bodyStyle: 'border:1px solid #B5B8C8;'
                }),
                new Tine.widgets.activities.ActivitiesPanel({
                    app: 'EventManager',
                    showAddNoteForm: false,
                    border: false,
                    bodyStyle: 'border:1px solid #B5B8C8;'
                })                                    
            ]
		});
		var fields = Tine.Eventmanager.EventFormFields.get();
		
		var tabPanel = new Ext.TabPanel({
	        region: 'center',
			activeTab: 3,
	        id: 'editMainTabPanel',
	        layoutOnTabChange:true,  
	        items:[
				{ 
					title: 'Basis',
				    autoScroll: true,
				    border: false,
				    frame: true,
				    items:[
						Tine.Eventmanager.EventForm.getColumnForm(
							[[
							   	fields.description
						   	],[
							   	fields.target_group
						   	]]
						)
				    ]
				},{ 
					title: 'Stati',
				    autoScroll: true,
				    border: false,
				    frame: true,
				    items:[
						Tine.Eventmanager.EventForm.getColumnForm(
							[[ 
							 	fields.planning_state, fields.preset_reg_state, fields.preset_overbook_state
						   	]]
						)
				    ]
				},{ 
					title: 'Ressourcen und Gebühren',
				    autoScroll: true,
				    border: false,
				    frame: true,
				    items:[
						Tine.Eventmanager.EventForm.getColumnForm(
							[[
							 	fields.room
							],[
								fields.referent_name
							],[
							   	fields.fee_std, fields.fee_reduced
						   	]]
						)
				    ]
				},{ 
					title: 'Medien',
				    autoScroll: true,
				    border: false,
				    frame: true,
				    forceLayout:true,
				    items:[
						Tine.Eventmanager.EventForm.getColumnForm(
							[[ 
							 	fields.jpeg_header
							],[
							   	fields.header_public_link
							],[
							   	fields.url_event_object
							],[
								fields.url_agenda
							],[
							   	fields.url_map
						   	],[ 	
							   	fields.jpeg_footer
						   	],[
							   	fields.footer_public_link
							]]
						)
				    ]
				},{ 
					title: 'Texte',
				    autoScroll: true,
				    border: false,
				    frame: true,
				    items:[
						Tine.Eventmanager.EventForm.getColumnForm(
							[[ 
							 	fields.att_confirm_text
							],[
							 	fields.att_certificate_text
							],[
								fields.att_registration_text
							],[
							   	fields.text_begin_changemessage
						   	],[ 	
							   	fields.text_begin_statemessage
							],[ 	
						   		fields.text_end_statemessage
							],[ 	
						   		fields.text_end_registration
							]]
						)
				    ]
				},

				// event hotel grid panel
				// -> put in tab
				this.hotelsGrid,
				
				// attendance grid panel
				// -> put in tab
				this.attendanceGrid,
				
				this.workflowPanel

			]
	    });
	  
	  var mainPanel = new Ext.Panel({
	  		layout:'border',
			autoScroll:true,
			width:1078,
			height:600,
			defaults: {
	            border: false,
	            frame: false            
	        },
	        items: [
	            {
	            	xtype:'panel',
	            	region: 'north',
	            	height:220,
	            	layout:'border',
	            	items:[{
	   	            	xtype:'panel',
		            	region: 'center',
		            	height:220,
		            	layout:'fit',
		            	items:[
		            	       Tine.Eventmanager.EventForm.getColumnForm(
								[[
								   	fields.name
								],[  
								   	fields.id
								],[  
								 	fields.event_id, fields.event_nr, fields.location
								],[
								 	fields.organizer_id, fields.responsible_organizer_id
								],[
								    fields.ev_kind_id, fields.ev_category_id
								],[
							   	   fields.att_max, fields.att_min,fields.att_reg, fields.att_res, fields.att_wait
							   	]]
							)]
	            		},{
	            			xtype:'panel',
			            	region: 'east',
			            	height:220,
			            	width: 260,
			            	split:true,
			            	collapsible:true,
			            	collapseMode:'mini',
			            	layout:'fit',
			            	title:'Termine',
			            	tbar: calToolbar,
			            	items:[
			            	     Tine.Eventmanager.EventForm.getColumnForm(
								[[
								 	fields.cal_event_id,fields.dtstart, fields.dtend
								],[
									fields.publication_from, fields.publication_to
								],[
								   	fields.bookable_from, fields.bookable_to
							   	]]
							)]    
	            		}
	            	]
	            },
				tabPanel,
				notesPanel
			]
	  });
	
	  return [mainPanel];
	}
});

/**
 * Eventmanager Edit Popup
 */
Tine.Eventmanager.EventEditDialog.openWindow = function (config) {
    var id = (config.record && config.record.id) ? config.record.id : 0;
    var window = Tine.WindowFactory.getWindow({
        width: 900,
        height: 700,
        name: Tine.Eventmanager.EventEditDialog.prototype.windowNamePrefix + id,
        contentPanelConstructor: 'Tine.Eventmanager.EventEditDialog',
        contentPanelConstructorConfig: config
    });
    return window;
};

Ext.ns('Tine.Eventmanager.EventForm');

Tine.Eventmanager.EventForm.getColumnForm = function(formFields){
	return {
        xtype: 'panel',
        border: false,
        frame:true,
        items:[{xtype:'columnform',items:
           formFields                               	
        }]
    };
};

Ext.ns('Tine.Eventmanager.EventFormFields');

Tine.Eventmanager.EventFormFields.get = function(){
	return{
		// hidden fields
		id: 
			{xtype: 'textfield',id:'id',name:'id', disabled:true, width:300},
		header_public_link:
			{
				xtype: 'textfield',
				disabledClass: 'x-item-disabled-view',
				fieldLabel: 'Öffentlicher Link Header-Grafik',
				labelIcon: 'images/oxygen/16x16/actions/network.png',
				name:'header_public_link',
				disabled:true,
				width:600
			},
		footer_public_link:
			{
				xtype: 'textfield',
				disabledClass: 'x-item-disabled-view',
				fieldLabel: 'Öffentlicher Link Footer-Grafik',
				labelIcon: 'images/oxygen/16x16/actions/network.png',
				name:'footer_public_link',
				disabled:true,
				width:600
			},
		event_id:
			Tine.Eventmanager.Custom.getRecordPicker('Event','event_event_id',{
				disabledClass: 'x-item-disabled-view',
				width: 300,
				fieldLabel: 'gehört zu Veranstaltung',
			    name:'event_id',
			    disabled: false,
			    onAddEditable: true,
			    onEditEditable: true,
			    blurOnSelect: true,
			    allowBlank:true
			}),
		organizer_id:
			Tine.Eventmanager.Custom.getRecordPicker('Organizer','event_organizer_id',{
				disabledClass: 'x-item-disabled-view',
				width: 300,
				fieldLabel: 'Veranstalter',
			    name:'organizer_id',
			    disabled: false,
			    onAddEditable: true,
			    onEditEditable: true,
			    blurOnSelect: true,
			    allowBlank:false
			}),
		responsible_organizer_id:
			Tine.Eventmanager.Custom.getRecordPicker('Organizer','event_responsible_organizer_id',{
				disabledClass: 'x-item-disabled-view',
				width: 300,
				fieldLabel: 'federführender Veranstalter',
			    name:'resp_organizer_id',
			    disabled: false,
			    onAddEditable: true,
			    onEditEditable: true,
			    blurOnSelect: true,
			    allowBlank:false
			}),
		cal_event_id:
			{xtype: 'hidden',id:'event_cal_event_id',name:'cal_event_id', width:1},
//			Tine.Eventmanager.Custom.getRecordPicker('CalEvent','event_cal_event_id',{
//				disabledClass: 'x-item-disabled-view',
//				width: 150,
//				fieldLabel: 'Termin',
//			    name:'cal_event_id',
//			    disabled: false,
//			    onAddEditable: true,
//			    onEditEditable: true,
//			    blurOnSelect: true,
//			    allowBlank:true
//			}),
		ev_kind_id:
			Tine.Eventmanager.Custom.getRecordPicker('EventKind','event_event_kind_id',{
				disabledClass: 'x-item-disabled-view',
				width: 300,
				fieldLabel: 'Veranstaltungsart',
			    name:'ev_kind_id',
			    disabled: false,
			    onAddEditable: true,
			    onEditEditable: true,
			    blurOnSelect: true,
			    allowBlank:false
			}),
		ev_category_id:
			Tine.Eventmanager.Custom.getRecordPicker('EventCategory','event_ev_category_id',{
				disabledClass: 'x-item-disabled-view',
				width: 150,
				fieldLabel: 'Veranstaltungskategorie',
			    name:'ev_category_id',
			    disabled: false,
			    onAddEditable: true,
			    onEditEditable: true,
			    blurOnSelect: true,
			    allowBlank:false
			}),
		event_nr:
			{
			    fieldLabel: 'Veranstaltungs-Nr',
			    id:'event_event_nr',
			    emptyText:'<automatisch>',
			    name:'event_nr',
			    disabledClass: 'x-item-disabled-view',
			    disabled:true,
			    value:null,
			    width: 100
			},
		name:
			{
			    fieldLabel: 'Bezeichnung',
			    id:'event_name',
			    name:'name',
			    disabledClass: 'x-item-disabled-view',
			    disabled:false,
			    value:null,
			    width: 600
			},
		description:
			{
				xtype: 'textarea',
			    fieldLabel: 'Beschreibung',
			    id:'event_description',
			    name:'description',
			    disabledClass: 'x-item-disabled-view',
			    disabled:false,
			    value:null,
			    width: 600,
			    height: 120
			},
		target_group:
			{
				xtype: 'textarea',
			    fieldLabel: 'Zielgruppe',
			    id:'event_target_group',
			    name:'target_group',
			    disabledClass: 'x-item-disabled-view',
			    disabled:false,
			    value:null,
			    width: 600,
			    height: 120
			},
		planning_state:
			{
			    fieldLabel: 'Planungsstatus',
			    disabledClass: 'x-item-disabled-view',
			    id:'event_planning_state',
			    name:'planning_state',
			    width: 150,
			    xtype:'combo',
			    store:[['EXECUTION','Ausführung'],['PLANNING','Planung'],['CANCELATION','Storno']],
			    value: 'PLANNING',
				mode: 'local',
				displayField: 'name',
			    valueField: 'id',
			    triggerAction: 'all'
			},
		preset_reg_state:
			{
			    fieldLabel: 'Voreinst. Anmeldestatus',
			    disabledClass: 'x-item-disabled-view',
			    id:'event_preset_reg_state',
			    name:'preset_reg_state',
			    width: 150,
			    xtype:'combo',
			    store:[['REGISTRATION','Registrierung'],['RESERVATION','Reservierung']],
			    value: 'RESERVATION',
				mode: 'local',
				displayField: 'name',
			    valueField: 'id',
			    triggerAction: 'all'
			},
		preset_overbook_state:
			{
			    fieldLabel: 'Voreinst. Überbuchung',
			    disabledClass: 'x-item-disabled-view',
			    id:'event_preset_overbook_state',
			    name:'preset_overbook_state',
			    width: 150,
			    xtype:'combo',
			    store:[['OVERBOOK','Überbuchung'],['WAITLIST','Warteliste'],['REFUSE','Abweisung']],
			    value: 'OVERBOOK',
				mode: 'local',
				displayField: 'name',
			    valueField: 'id',
			    triggerAction: 'all'
			},
		location:
			{
			    fieldLabel: 'Veranstaltungsort',
			    id:'event_location',
			    name:'location',
			    disabledClass: 'x-item-disabled-view',
			    disabled:false,
			    value:null,
			    width: 200
			},
		personal_costs:
			{
		 		xtype: 'sopencurrencyfield',
		    	fieldLabel: 'Personalkosten', 
			    id:'event_personal_costs',
			    name:'personal_costs',
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		 	    width:150
		 	},
		room_costs:
			{
		 		xtype: 'sopencurrencyfield',
		    	fieldLabel: 'Raumkosten', 
			    id:'event_room_costs',
			    name:'room_costs',
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		 	    width:150
		 	},
		 other_costs:
			{
		 		xtype: 'sopencurrencyfield',
		    	fieldLabel: 'Andere Kosten', 
			    id:'event_other_costs',
			    name:'other_costs',
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		 	    width:150
		 	},
		publication_from:
		 	{
	        	xtype: 'datefield',
	            fieldLabel: 'Publikation ab', 
	            disabledClass: 'x-item-disabled-view',
	            id:'event_publication_from',
	            name:'publication_from',
	            width: 100
	        },
	    publication_to:
		 	{
	        	xtype: 'datefield',
	            fieldLabel: 'Publikation bis', 
	            disabledClass: 'x-item-disabled-view',
	            id:'event_publication_to',
	            name:'publication_to',
	            width: 100
	        },
	    bookable_from:
		 	{
	        	xtype: 'datefield',
	            fieldLabel: 'Buchbar ab', 
	            disabledClass: 'x-item-disabled-view',
	            id:'event_bookable_from',
	            name:'bookable_from',
	            width: 100
	        },
	    bookable_to:
		 	{
	        	xtype: 'datefield',
	            fieldLabel: 'Buchbar bis', 
	            disabledClass: 'x-item-disabled-view',
	            id:'event_bookable_to',
	            name:'bookable_to',
	            width: 100
	        },
	    room:
			{
			    fieldLabel: 'Raum',
			    id:'event_room',
			    name:'room',
			    disabledClass: 'x-item-disabled-view',
			    disabled:false,
			    value:null,
			    width: 600
			},
		referent_name:
			{
			    fieldLabel: 'Name Referent',
			    id:'event_referent_name',
			    name:'referent_name',
			    disabledClass: 'x-item-disabled-view',
			    disabled:false,
			    value:null,
			    width: 600
			},
		fee_std:
			{
		 		xtype: 'sopencurrencyfield',
		    	fieldLabel: 'TN-Gebühr stand.', 
			    id:'event_fee_std',
			    name:'fee_std',
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		 	    width:150
		 	},
		 fee_reduced:
			{
		 		xtype: 'sopencurrencyfield',
		    	fieldLabel: 'TN-Gebühr reduziert', 
			    id:'event_fee_reduced',
			    name:'fee_reduced',
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		 	    width:150
		 	},
		att_max:
			{
		 		xtype: 'numberfield',
		 		decimalPrecision:0,
		 		fieldLabel: 'TN Max', 
			    id:'event_att_max',
			    name:'att_max',
			    value:0,
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		 	    width:120
		 	},
	 	att_min:
			{
		 		xtype: 'numberfield',
		    	fieldLabel: 'TN Min', 
			    id:'event_att_min',
			    decimalPrecision:0,
			    name:'att_min',
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		    	value:0,
		 	    width:120
		 	},
		att_reg:
			{
		 		xtype: 'numberfield',
		    	fieldLabel: 'TN angemeldet', 
			    id:'event_att_reg',
			    decimalPrecision:0,
			    name:'att_reg',
			    disabled:true,
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		 	    width:120
		 	},
		att_res:
			{
		 		xtype: 'numberfield',
		    	fieldLabel: 'TN reserviert', 
			    id:'event_att_res',
			    decimalPrecision:0,
			    name:'att_res',
			    disabled:true,
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		 	    width:120
		 	},
		att_wait:
			{
		 		xtype: 'numberfield',
		    	fieldLabel: 'TN Warteliste', 
			    id:'event_att_wait',
			    decimalPrecision:0,
			    name:'att_wait',
			    disabled:true,
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		 	    width:120
		 	},
		confirm_agb: 
			{
				xtype: 'checkbox',
				disabledClass: 'x-item-disabled-view',
				id: 'event_confirm_agb',
				name: 'confirm_agb',
				hideLabel:true,
				infoField:true,
			    boxLabel: 'AGB bestätigen',
			    width:150
			},
		url_agenda:
			{
				xtype: 'textfield',
				fieldLabel: 'Agenda',
				labelIcon: 'images/oxygen/16x16/actions/network.png',
				name:'url_agenda',
				width: 600
				/*listeners: {
				    scope: this,
				    focus: function(field) {
				        if (! field.getValue()) {
				            field.setValue('http://www.');
				        }
				    },
				    blur: function(field) {
				        if (field.getValue() == 'http://www.') {
				            field.setValue(null);
				            field.validate();
				        }
				    }
				 }*/
			},
		url_event_object:
			{
				xtype: 'textfield',
				fieldLabel: 'Eventobjekt im Medienarchiv',
				labelIcon: 'images/oxygen/16x16/actions/network.png',
				name:'url_event_object',
				width: 600
				/*listeners: {
				    scope: this,
				    focus: function(field) {
				        if (! field.getValue()) {
				            field.setValue('http://www.');
				        }
				    },
				    blur: function(field) {
				        if (field.getValue() == 'http://www.') {
				            field.setValue(null);
				            field.validate();
				        }
				    }
				 }*/
			},
		url_map:
			{
				xtype: 'textfield',
				fieldLabel: 'Anfahrtskizze',
				labelIcon: 'images/oxygen/16x16/actions/network.png',
				name:'url_map',
				width: 600
				/*listeners: {
				    scope: this,
				    focus: function(field) {
				        if (! field.getValue()) {
				            field.setValue('http://www.');
				        }
				    },
				    blur: function(field) {
				        if (field.getValue() == 'http://www.') {
				            field.setValue(null);
				            field.validate();
				        }
				    }
				 }*/
			},
		jpeg_header: new Ext.ux.form.ImageField({
            id: 'event_jpeg_header',
			name: 'jpeg_header',
			fieldLabel: 'Veranstaltungsgrafik (Header)',
            width: 600,
            height: 120
        }),
        jpeg_footer: new Ext.ux.form.ImageField({
        	id: 'event_jpeg_footer',
            name: 'jpeg_footer',
            fieldLabel: 'Veranstaltungsgrafik (Footer)',
            width: 600,
            height: 120
        }),
        att_confirm_text:
		{
        	xtype:'textarea',
		    fieldLabel: 'Text Anmeldebestätigung',
		    id:'event_att_confirm_text',
		    name:'att_confirm_text',
		    disabledClass: 'x-item-disabled-view',
		    disabled:false,
		    value:null,
		    width: 600,
		    height: 120
		},
		att_certificate_text:
		{
			xtype:'textarea',
		    fieldLabel: 'Text TN-Bescheinigung',
		    id:'event_att_certificate_text',
		    name:'att_certificate_text',
		    disabledClass: 'x-item-disabled-view',
		    disabled:false,
		    value:null,
		    width: 600,
		    height: 120
		},
		att_registration_text:
		{
			xtype:'textarea',
		    fieldLabel: 'Text Buchungsbestätigung',
		    id:'event_att_registration_text',
		    name:'att_registration_text',
		    disabledClass: 'x-item-disabled-view',
		    disabled:false,
		    value:null,
		    width: 600,
		    height: 120
		},
		text_begin_changemessage:
		{
			xtype:'textarea',
		    fieldLabel: 'TB allg. Einleitung Änderungsmitteilung',
		    id:'event_text_begin_changemessage',
		    name:'beg_changemessage',
		    disabledClass: 'x-item-disabled-view',
		    disabled:false,
		    value:null,
		    width: 600,
		    height: 120
		},
		text_begin_statemessage:
		{
			xtype:'textarea',
		    fieldLabel: 'TB allg. Einleitung Statusmitteilung',
		    id:'event_text_begin_statemessage',
		    name:'beg_statemessage',
		    disabledClass: 'x-item-disabled-view',
		    disabled:false,
		    value:null,
		    width: 600,
		    height: 120
		},
		text_end_statemessage:
		{
			xtype:'textarea',
		    fieldLabel: 'TB allg. Abschlußsatz Statusmitteilung',
		    id:'event_text_end_statemessage',
		    name:'end_statemessage',
		    disabledClass: 'x-item-disabled-view',
		    disabled:false,
		    value:null,
		    width: 600,
		    height: 120
		},
		text_end_registration:
		{
			xtype:'textarea',
		    fieldLabel: 'TB Abschlußsatz Anmeldung',
		    id:'event_text_end_registration',
		    name:'end_registration',
		    disabledClass: 'x-item-disabled-view',
		    disabled:false,
		    value:null,
		    width: 600,
		    height: 120
		},
		dtstart:
		{
            xtype: 'datetimefield',
            fieldLabel: 'Beginn',
            id: 'event_dtstart',
            name: 'dtstart',
            width:200
        },
		dtend:
		{
            xtype: 'datetimefield',
            fieldLabel: 'Ende',
            id: 'event_dtend',
            name: 'dtend',
            width:200
        }
	};
};