Ext.namespace('Tine.FundProject');

Tine.FundProject.ProjectEditDialog = Ext.extend(Tine.widgets.dialog.EditDialog, {

	/**
	 * @private
	 */
	windowNamePrefix: 'ProjectEditWindow_',
	appName: 'FundProject',
	recordClass: Tine.FundProject.Model.Project,
	recordProxy: Tine.FundProject.projectBackend,
	loadRecord: true,
	evalGrants: false,

	initComponent: function(){
		this.on('load',this.onLoadProject, this);
		this.on('afterrender',this.onAfterRender,this);
		this.initDependentGrids();
		Tine.FundProject.ProjectEditDialog.superclass.initComponent.call(this);
	},
	initButtons: function(){
    	Tine.FundProject.ProjectEditDialog.superclass.initButtons.call(this);
		this.fbar = [
             '->',
             this.action_applyChanges,
             this.action_cancel,
             this.action_saveAndClose
        ];
    },
	onLoadProject: function(){
		if(this.record.id !== 0){
			// enable attendance grid if record has id
			this.appropriationGrid.enable();
			this.appropriationGrid.loadProject(this.record);
			this.projectContactGrid.enable();
			this.projectContactGrid.loadProject(this.record);

			this.appropriationPayoutGrid.enable();
			this.appropriationPayoutGrid.loadProject(this.record);

			this.projectGrid.enable();
			this.projectGrid.loadProject(this.record);
		}

		if(Tine.Tinebase.common.hasRight('approval_buha', 'FundProject')){
			Ext.getCmp('project_approval_buha').enable();
		}
	},
	onAfterRender: function(){

	},
	initDependentGrids: function(){
		this.appropriationGrid = new Tine.FundProject.AppropriationGridPanel({
			inDialog:true,
			title:'Fördermittel',
			layout:'border',
			disabled:true,
			frame: true,
			app: Tine.Tinebase.appMgr.get('FundProject')
		});
		this.appropriationPayoutGrid = new Tine.FundProject.AppropriationPayoutGridPanel({
			inDialog:true,
			title:'Auszahlungen',
			layout:'border',
			disabled:true,
			frame: true,
			perspective:'PROJECT',
			app: Tine.Tinebase.appMgr.get('FundProject')
		});
		this.projectContactGrid = new Tine.FundProject.ProjectContactGridPanel({
			title:'Kontakte',
			layout:'border',
			disabled:true,
			frame: true,
			app: Tine.Tinebase.appMgr.get('FundProject')
		});
		this.projectGrid = new Tine.FundProject.ProjectGridPanel({
			inDialog:true,
			title:'Verbundprojekte',
			layout:'border',
			disabled:true,
			frame: true,
			app: Tine.Tinebase.appMgr.get('FundProject')
		});
	},
	getFormItems: function() {
		this.activitiesPanel =  new Tine.widgets.activities.ActivitiesTabPanel({
            app: Tine.Tinebase.appMgr.get('FundProject'),
            record_id: (this.record) ? this.record.id : '',
            record_model: this.appName + '_Model_' + this.recordClass.getMeta('modelName')
        });
		this.documentsPanel =  new Tine.Document.DocumentsTabPanel({
            app: Tine.Tinebase.appMgr.get('FundProject'),
            record: this.record,
            parent_id: Tine.Document.registry.get('config').fundproject_id,
            record_model: this.appName + '_Model_' + this.recordClass.getMeta('modelName')
        });
		var fields = Tine.FundProject.ProjectFormFields.get();
		var tabPanel = new Ext.TabPanel({
	        region: 'center',
			activeTab: 0,
	        id: 'editMainTabPanel',
	        layoutOnTabChange:true,
	        items:[
	               this.appropriationGrid,
	               this.appropriationPayoutGrid,
	               this.projectContactGrid,
	               this.projectGrid
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
		            	height:320,
		            	layout:'border',
		            	items:[
		            	       {
		            	    	   xtype:'tabpanel',
		            	    	   activeTab:0,
		            	    	   region:'center',
		            	    	   layoutOnTabChange:true,
		            	    	   items:
		            	    	   [
										{
										   	xtype:'panel',
											//region: 'center',
											height:320,
											title:'Projektdaten',
											autoScroll:true,
											items:[
											       Tine.FundProject.ProjectForm.getColumnForm(
													[[
														fields.project_nr, fields.short_name, fields.project_id,fields.name, fields.id
													],[
													   	fields.department_id,fields.leading_department_id
													],[
													 	fields.promotion_area_id, fields.state, fields.decision_committee
													],[
													 	fields.aquisition_state, fields.agenda_topic
												    ],[
													    fields.approval_buha, fields.claim_entry_date, fields.buha_finish_date, fields.project_finish_date
												    ],[
													 	fields.amount, fields.proposal_amount
													],[
														fields.confirmed_amount, fields.payout_amount, fields.rest_amount
												    ],[
													   fields.pr_contact_date, fields.pr_opening_date,fields.pr_other_date, fields.query_date
												   	]]
												)]
										},

										this.activitiesPanel,
										this.documentsPanel
										]

		            	       }]

		            	       }

		            	       ,
		            tabPanel
		        ]
		  });
		  return [mainPanel];
	}
});


//extended content panel constructor
Tine.FundProject.ProjectEditDialogPanel = Ext.extend(Ext.Panel, {
	panelManager:null,
	windowNamePrefix: 'ProjectEditWindow_',
	appName: 'FundProject',
	layout:'fit',
	bodyStyle:'padding:0px;padding-top:5px',
	forceLayout:true,
	initComponent: function(){
		Ext.apply(this.initialConfig, {
			region:'center'//,
			//title:'Kreditor'
		});
		var regularDialog = new Tine.FundProject.ProjectEditDialog(this.initialConfig);
		regularDialog.doLayout();
		this.items = this.getItems(regularDialog);
		Tine.FundProject.ProjectEditDialogPanel.superclass.initComponent.call(this);
	},
	getItems: function(regularDialog){
		var recordChoosers = [
			{
				xtype:'contactselectiongrid',
				title:'Kontakte',
				layout:'border',
				app: Tine.Tinebase.appMgr.get('Addressbook')
			}
		];

		// use some fields from brevetation edit dialog
		 var recordChooserPanel = {
				 xtype:'panel',
				 layout:'accordion',
				 region:'east',
				 title: 'Auswahlübersicht',
				 width:540,
				 collapsible:true,
				 bodyStyle:'padding:8px;',
				 split:true,
				 items: recordChoosers
		 };
		return [{
			xtype:'panel',
			layout:'border',
			items:[
			       // display debitor widget north
			       //regularDialog.getProjectWidget(),
			       // tab panel containing debitor master data
			       // + dependent panels
			       regularDialog,
			       // place record chooser east
			       recordChooserPanel
			]
		}];
	}
});


/**
 * FundProject Edit Popup
 */
Tine.FundProject.ProjectEditDialog.openWindow = function (config) {
    var id = (config.record && config.record.id) ? config.record.id : 0;
    var window = Tine.WindowFactory.getWindow({
        width: 1200,
        height: 700,
        name: Tine.FundProject.ProjectEditDialog.prototype.windowNamePrefix + id,
        contentPanelConstructor: 'Tine.FundProject.ProjectEditDialogPanel',
        contentPanelConstructorConfig: config
    });
    return window;
};

Ext.ns('Tine.FundProject.ProjectForm');

Tine.FundProject.ProjectForm.getColumnForm = function(formFields){
	return {
        xtype: 'panel',
        border: false,
        frame:true,
        items:[{xtype:'columnform',items:
           formFields
        }]
    };
};

Ext.ns('Tine.FundProject.ProjectFormFields');

Tine.FundProject.ProjectFormFields.get = function(){
	return{
		// hidden fields
		id:
			{xtype: 'hidden',id:'id',name:'id', disabled:true, width:1},
		project_id:
			Tine.FundProject.Custom.getRecordPicker('Project','project_project_id',{
				disabledClass: 'x-item-disabled-view',
				width: 300,
				fieldLabel: 'Projektverbund',
			    name:'project_id',
			    disabled: false,
			    onAddEditable: true,
			    onEditEditable: true,
			    blurOnSelect: true,
			    allowBlank:true
			}),
		department_id:
			Tine.FundProject.Custom.getRecordPicker('Department','project_department_id',{
				disabledClass: 'x-item-disabled-view',
				width: 300,
				fieldLabel: 'Referat',
			    name:'department_id',
			    disabled: false,
			    onAddEditable: true,
			    onEditEditable: true,
			    blurOnSelect: true,
			    allowBlank:true
			}),
		leading_department_id:
			Tine.FundProject.Custom.getRecordPicker('Department','project_leading_department_id',{
				disabledClass: 'x-item-disabled-view',
				width: 300,
				fieldLabel: 'Federf. Referat',
			    name:'leading_department_id',
			    disabled: false,
			    onAddEditable: true,
			    onEditEditable: true,
			    blurOnSelect: true,
			    allowBlank:true
			}),
		promotion_area_id:
			Tine.FundProject.Custom.getRecordPicker('PromotionArea','project_promotion_area_id',{
				disabledClass: 'x-item-disabled-view',
				width: 300,
				fieldLabel: 'Förderbereich',
			    name:'promotion_area_id',
			    disabled: false,
			    onAddEditable: true,
			    onEditEditable: true,
			    blurOnSelect: true,
			    allowBlank:true
			}),
		project_nr:
			{
			    fieldLabel: 'Projekt-Nr',
			    id:'project_project_nr',
			    emptyText:'<automatisch>',
			    name:'project_nr',
			    disabledClass: 'x-item-disabled-view',
			    disabled:true,
			    value:null,
			    width: 100
			},
		short_name:
			{
			    fieldLabel: 'Kurztitel',
			    id:'project_short_name',
			    name:'short_name',
			    disabledClass: 'x-item-disabled-view',
			    disabled:false,
			    value:null,
			    width: 200
			},
		name:
			{
			    fieldLabel: 'Titel',
			    id:'project_name',
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
			    id:'project_description',
			    name:'description',
			    disabledClass: 'x-item-disabled-view',
			    disabled:false,
			    value:null,
			    width: 600,
			    height: 120
			},
		state:
			{
			    fieldLabel: 'Status',
			    disabledClass: 'x-item-disabled-view',
			    id:'project_state',
			    name:'state',
			    width: 150,
			    xtype:'combo',
			    store:[['PROJECT','Projekt'],['PROJECTFINISHED','Projekt erledigt'],['CLAIM','Antrag'],['CLAIMFINISHED','Antrag erledigt'],['QUERY','Anfrage'],['QUERYFINISHED','Anfrage erledigt']],
			    value: 'PROJECT',
				mode: 'local',
				displayField: 'name',
			    valueField: 'id',
			    triggerAction: 'all'
			},
		decision_committee:
			{
			    fieldLabel: 'Entsch. Gremium',
			    disabledClass: 'x-item-disabled-view',
			    id:'project_decision_committee',
			    name:'decision_committee',
			    width: 300,
			    xtype:'combo',
			    store:[['EXECUTIVE','Geschäftsführer'],['MANAGEMENT','Vorstand'],['ADVISER','Stiftungsrat'],['CIRCULATION','Umlaufverfahren (Vorstand)']],
			    value: 'EXECUTIVE',
				mode: 'local',
				displayField: 'name',
			    valueField: 'id',
			    triggerAction: 'all'
			},
		aquisition_state:
			{
			    fieldLabel: 'Status Erwerb',
			    disabledClass: 'x-item-disabled-view',
			    id:'project_aquisition_state',
			    name:'aquisition_state',
			    width: 150,
			    xtype:'combo',
			    store:[['AQUIRED','Erwerb'],['PARTLYAQUIRED','Teilerwerb'],['BENEFIT','Zuschuß']],
			    value: 'AQUIRED',
				mode: 'local',
				displayField: 'name',
			    valueField: 'id',
			    triggerAction: 'all'
			},
		agenda_topic:
			{
			    fieldLabel: 'Sitzung TOP',
			    id:'project_agenda_topic',
			    name:'agenda_topic',
			    disabledClass: 'x-item-disabled-view',
			    disabled:false,
			    value:null,
			    width: 600
			},
		approval_buha:
			{
				xtype: 'checkbox',
				disabledClass: 'x-item-disabled-view',
				id: 'project_approval_buha',
				name: 'approval_buha',
				hideLabel:true,
				infoField:true,
				disabled:true,
			    boxLabel: 'Freigabe Buha',
			    width:150
			},
		claim_entry_date:
		 	{
	        	xtype: 'datefield',
	            fieldLabel: 'Eingang Antrag',
	            disabledClass: 'x-item-disabled-view',
	            id:'project_claim_entry_date',
	            name:'claim_entry_date',
	            width: 100
	        },
	     buha_finish_date:
		 	{
	        	xtype: 'datefield',
	            fieldLabel: 'Rechn. Abschluß',
	            disabledClass: 'x-item-disabled-view',
	            id:'project_buha_finish_date',
	            name:'buha_finish_date',
	            width: 100
	        },
	     project_finish_date:
		 	{
	        	xtype: 'datefield',
	            fieldLabel: 'Projektabschluß',
	            disabledClass: 'x-item-disabled-view',
	            id:'project_project_finish_date',
	            name:'project_finish_date',
	            width: 100
	        },
	     pr_contact_date:
		 	{
	        	xtype: 'datefield',
	            fieldLabel: 'Kontaktaufn. ÖA',
	            disabledClass: 'x-item-disabled-view',
	            id:'project_pr_contact_date',
	            name:'pr_contact_date',
	            width: 100
	        },
	     pr_opening_date:
		 	{
	        	xtype: 'datefield',
	            fieldLabel: 'Eröffnung ÖA',
	            disabledClass: 'x-item-disabled-view',
	            id:'project_pr_opening_date',
	            name:'pr_opening_date',
	            width: 100
	        },
	     pr_other_date:
		 	{
	        	xtype: 'datefield',
	            fieldLabel: 'sonst. Termin ÖA',
	            disabledClass: 'x-item-disabled-view',
	            id:'project_pr_other_date',
	            name:'pr_other_date',
	            width: 100
	        },
	     query_date:
		 	{
	        	xtype: 'datefield',
	            fieldLabel: 'Eingang Anfrage',
	            disabledClass: 'x-item-disabled-view',
	            id:'project_query_date',
	            name:'query_date',
	            width: 100
	        },
	    amount:
			{
		 		xtype: 'sopencurrencyfield',
		    	fieldLabel: 'Beantr. Betrag',
			    id:'project_amount',
			    name:'amount',
			    disabled:true,
		    	disabledClass: 'x-item-disabled-view',
		    	blurOnSelect: true,
		 	    width:180
		 	},
		proposal_amount:
			{
		 		xtype: 'sopencurrencyfield',
		    	fieldLabel: 'Vorschlagssumme',
			    id:'project_proposal_amount',
			    name:'proposal_amount',
		    	disabledClass: 'x-item-disabled-view',
		    	disabled:true,
		    	blurOnSelect: true,
		 	    width:180
		 	},
	    confirmed_amount:
			{
		 		xtype: 'sopencurrencyfield',
		    	fieldLabel: 'Bew. Betrag',
			    id:'project_confirmed_amount',
			    name:'confirmed_amount',
		    	disabledClass: 'x-item-disabled-view',
		    	disabled:true,
		    	blurOnSelect: true,
		 	    width:180
		 	},
	    payout_amount:
			{
		 		xtype: 'sopencurrencyfield',
		    	fieldLabel: 'Ausgez. Betrag',
			    id:'project_payout_amount',
			    name:'payout_amount',
		    	disabledClass: 'x-item-disabled-view',
		    	disabled:true,
		    	blurOnSelect: true,
		 	    width:180
		 	},
		 rest_amount:
			{
		 		xtype: 'sopencurrencyfield',
		    	fieldLabel: 'Restbetrag',
			    id:'project_rest_amount',
			    name:'rest_amount',
		    	disabledClass: 'x-item-disabled-view',
		    	disabled:true,
		    	blurOnSelect: true,
		 	    width:180
		 	}
	};
};
