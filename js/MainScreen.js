/**
 * sopen
 * 
 * @package     FundProject
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Hans-Jürgen Hartl <hhartl@sopen.de>
 * @copyright   sopen GmbH, Hans-Jürgen Hartl 2011
 * @version     $Id:  $
 *
 */
Ext.ns('Tine.FundProject');

Tine.FundProject.Application = Ext.extend(Tine.Addressbook.Application, {
    addressbookPlugin: null,
    
	init: function(){
		Tine.Tinebase.appMgr.on('initall',this.onInitAll,this);
	},
	
	onInitAll: function(){
	//	this.addressbookPlugin = new Tine.FundProject.AddressbookPlugin();
	//	Tine.Tinebase.appMgr.get('Addressbook').registerPlugin(new Tine.FundProject.AddressbookPlugin());
	//	this.registerPlugin(this.addressbookPlugin);
	},
    /**
     * Get translated application title of the calendar application
     * 
     * @return {String}
     */
    getTitle: function() {
        return this.i18n.ngettext('Förderprojekte', 'Förderprojekte', 1);
    }
});

Tine.FundProject.MainScreen = Ext.extend(Tine.widgets.MainScreen, {
    activeContentType: 'Project',
    westPanelXType: 'tine.fundproject.treepanel',
    mainPanel: null,
    fundMasterPanel: null,
    donationPanel: null,
    campaignPanel: null,
    projectPanel: null,
    fundMasterEmbedded: true,
    
    initComponent: function(){
		Tine.FundProject.MainScreen.superclass.initComponent.call(this);
	},
    show: function() {
	    if(this.fireEvent("beforeshow", this) !== false){
	    	this.showWestPanel();
	        this.showCenterPanel();
	        this.showNorthPanel();
	        this.fireEvent('show', this);
	    }
	    return this;
	},
	getCenterPanel: function(activeContentType){
		switch(activeContentType){
		case 'Project':
			if(!this.projectPanel){
				this.projectPanel = new Tine.FundProject.ProjectGridPanel({
					app: this.app,
					plugins:[]
				});
			}
			this.mainPanel = this.projectPanel;
			break;
		case 'Appropriation':
			if(!this.appropriationPanel){
				this.appropriationPanel = new Tine.FundProject.AppropriationGridPanel({
					app: this.app,
					plugins:[]
				});
			}
			this.mainPanel = this.appropriationPanel;
			break;
		case 'AppropriationPayout':
			if(!this.appropriationPayoutPanel){
				this.appropriationPayoutPanel = new Tine.FundProject.AppropriationPayoutGridPanel({
					app: this.app,
					plugins:[]
				});
			}
			this.mainPanel = this.appropriationPayoutPanel;
			break;
		case 'PromotionArea':
			if(!this.promotionAreaPanel){
				this.promotionAreaPanel = new Tine.FundProject.PromotionAreaGridPanel({
					app: this.app,
					plugins:[]
				});
			}
			this.mainPanel = this.promotionAreaPanel;
			break;
		case 'ProjectRole':
			if(!this.projectRolePanel){
				this.projectRolePanel = new Tine.FundProject.ProjectRoleGridPanel({
					app: this.app,
					plugins:[]
				});
			}
			this.mainPanel = this.projectRolePanel;
			break;
		case 'FundsCategory':
			if(!this.fundsCategoryPanel){
				this.fundsCategoryPanel = new Tine.FundProject.FundsCategoryGridPanel({
					app: this.app,
					plugins:[]
				});
			}
			this.mainPanel = this.fundsCategoryPanel;
			break;
		case 'FundsKind':
			if(!this.fundsKindPanel){
				this.fundsKindPanel = new Tine.FundProject.FundsKindGridPanel({
					app: this.app,
					plugins:[]
				});
			}
			this.mainPanel = this.fundsKindPanel;
			break;
		case 'Department':
			if(!this.departmentPanel){
				this.departmentPanel = new Tine.FundProject.DepartmentGridPanel({
					app: this.app,
					plugins:[]
				});
			}
			this.mainPanel = this.departmentPanel;
			break;
		}
		return this.mainPanel;
	},
	getNorthPanel: function(){
		if(this.activeContentType == 'Project'){
			try{
				return this.mainPanel.getGrid().getActionToolbar();	
			}catch(e){
				
			}
			
		}
		return this.mainPanel.getActionToolbar();
	}
});

Tine.FundProject.FilterPanel = function(config) {
    Ext.apply(this, config);
    Tine.FundProject.FilterPanel.superclass.constructor.call(this);
};

Ext.extend(Tine.FundProject.FilterPanel, Tine.widgets.persistentfilter.PickerPanel, {
	suppressProjects:false,
    filter: [{field: 'model', operator: 'equals', value: 'FundProject_Model_ProjectFilter'}],
    onFilterChange: function(){
	}
});

Tine.FundProject.TreePanel = Ext.extend(Ext.tree.TreePanel, {
	rootVisible:false,
	useArrows:true,
    initComponent: function() {
        this.root = {
            id: 'root',
            leaf: false,
            expanded: true,
            children: [{
                text: this.app.i18n._('Projekte'),
                id : 'projectContainer',
                contentType: 'Project',
                leaf:true
            },{
                text: this.app.i18n._('Fördermittel'),
                id : 'appropriationContainer',
                contentType: 'Appropriation',
                leaf:true
            },{
                text: this.app.i18n._('Auszahlungen'),
                id : 'appropriationPayoutContainer',
                contentType: 'AppropriationPayout',
                leaf:true
            },{
                text: this.app.i18n._('Konfiguration'),
                iconCls: 'BillingConfig',
                id : 'fundProjectConfig',
                contentType: 'Config',
                leaf:false,
                children: [
					{
					    text: this.app.i18n._('Förderbereiche'),
					    id : 'promotionAreaContainer',
					    contentType: 'PromotionArea',
					    leaf:true
					},
					{
					    text: this.app.i18n._('Projekt-Rollen'),
					    id : 'projectRoleContainer',
					    contentType: 'ProjectRole',
					    leaf:true
					},
					{
					    text: this.app.i18n._('Mittelkategorien'),
					    id : 'fundsCategoryContainer',
					    contentType: 'FundsCategory',
					    leaf:true
					},
					{
					    text: this.app.i18n._('Mittelarten'),
					    id : 'fundsKindContainer',
					    contentType: 'FundsKind',
					    leaf:true
					},
					{
					    text: this.app.i18n._('Referate'),
					    id : 'departmentContainer',
					    contentType: 'Department',
					    leaf:true
					}
                ]
            }]
        };
        
    	Tine.FundProject.TreePanel.superclass.initComponent.call(this);
        this.on('click', function(node) {
            if (node.attributes.contentType !== undefined) {
                this.app.getMainScreen().activeContentType = node.attributes.contentType;
                this.app.getMainScreen().show();
            }
        }, this);
	}
});
Ext.reg('tine.fundproject.treepanel',Tine.FundProject.TreePanel);


