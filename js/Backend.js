Ext.ns('Tine.FundProject');

/**
* organizer backend
*/
Tine.FundProject.promotionAreaBackend = new Tine.Tinebase.data.RecordProxy({
   appName: 'FundProject',
   modelName: 'PromotionArea',
   recordClass: Tine.FundProject.Model.PromotionArea
});

Tine.FundProject.departmentBackend = new Tine.Tinebase.data.RecordProxy({
   appName: 'FundProject',
   modelName: 'Department',
   recordClass: Tine.FundProject.Model.Department
});

Tine.FundProject.projectRoleBackend = new Tine.Tinebase.data.RecordProxy({
   appName: 'FundProject',
   modelName: 'ProjectRole',
   recordClass: Tine.FundProject.Model.ProjectRole
});

Tine.FundProject.projectContactBackend = new Tine.Tinebase.data.RecordProxy({
   appName: 'FundProject',
   modelName: 'ProjectContact',
   recordClass: Tine.FundProject.Model.ProjectContact
});

Tine.FundProject.fundsKindBackend = new Tine.Tinebase.data.RecordProxy({
   appName: 'FundProject',
   modelName: 'FundsKind',
   recordClass: Tine.FundProject.Model.FundsKind
});

Tine.FundProject.fundsCategoryBackend = new Tine.Tinebase.data.RecordProxy({
   appName: 'FundProject',
   modelName: 'FundsCategory',
   recordClass: Tine.FundProject.Model.FundsCategory
});

Tine.FundProject.projectBackend = new Tine.Tinebase.data.RecordProxy({
   appName: 'FundProject',
   modelName: 'Project',
   recordClass: Tine.FundProject.Model.Project
});

Tine.FundProject.appropriationBackend = new Tine.Tinebase.data.RecordProxy({
   appName: 'FundProject',
   modelName: 'Appropriation',
   recordClass: Tine.FundProject.Model.Appropriation
});

Tine.FundProject.appropriationChangeBackend = new Tine.Tinebase.data.RecordProxy({
   appName: 'FundProject',
   modelName: 'AppropriationChange',
   recordClass: Tine.FundProject.Model.AppropriationChange
});

Tine.FundProject.appropriationPayoutBackend = new Tine.Tinebase.data.RecordProxy({
   appName: 'FundProject',
   modelName: 'AppropriationPayout',
   recordClass: Tine.FundProject.Model.AppropriationPayout
});


Tine.FundProject.getStoreFromRegistry = function(modelName, registryKey, searchMethod){
	var storeName = modelName + 'Store';
	var store = Ext.StoreMgr.get(storeName);
    if (!store) {
        store = new Ext.data.JsonStore({
            fields: Tine.FundProject.Model[modelName],
            baseParams: {
            	method: 'FundProject.' + searchMethod
            },
            root: 'results',
            totalProperty: 'totalcount',
            id: 'id',
            remoteSort: false
        });
        
        if (Tine.FundProject.registry.get(registryKey)) {
            store.loadData(Tine.FundProject.registry.get(registryKey));
        }
        Ext.StoreMgr.add(storeName, store);
    }
    
    return store;
};

/**
 * get attender role store
 * if available, load data from initial data
 * 
 * @return Ext.data.JsonStore with salutations
 */
Tine.FundProject.getStore = function(modelName) {
    switch(modelName){
    case 'PromotionArea':
    	return Tine.FundProject.getStoreFromRegistry('PromotionArea', 'PromotionAreas', 'getPromotionAreas');
    	break;
    case 'ProjectRole':
    	return Tine.FundProject.getStoreFromRegistry('ProjectRole', 'ProjectRoles', 'getProjectRoles');
    	break;
    case 'Department':
    	return Tine.FundProject.getStoreFromRegistry('Department', 'Departments', 'getDepartments');
    	break;
    case 'FundsCategory':
    	return Tine.FundProject.getStoreFromRegistry('FundsCategory', 'FundsCategorys', 'getFundsCategorys');
    	break;
    case 'FundsKind':
    	return Tine.FundProject.getStoreFromRegistry('FundsKind', 'FundsKinds', 'getFundsKinds');
    	break;
    default:
    	throw 'Unknown model for store';
    }
};
