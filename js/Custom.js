Ext.ns('Tine.FundProject.Custom');

Tine.FundProject.Custom.getProjectRecordPicker = function(id, config){
	if(!id){
		id = 'projectEditorField';
	}
	return new Tine.Tinebase.widgets.form.RecordPickerComboBox(Ext.apply({
		id:id,
		disabledClass: 'x-item-disabled-view',
		recordClass: Tine.FundProject.Model.Project,
		fieldLabel: 'Projekt',
	    allowBlank:false,
	    autoExpand: true,
	    triggerAction: 'all',
	    selectOnFocus: true,
	    itemSelector: 'div.search-item',
	    tpl:new Ext.XTemplate(
	            '<tpl for="."><div class="search-item">',
	                '<table cellspacing="0" cellpadding="2" border="0" style="font-size: 12px;" width="100%">',
	                    '<tr  style="font-size: 12px;border-bottom:1px solid #000000;">',
	                        '<td width="30%"><b>{[this.encode(values.project_nr)]}</b></td>',
	                        '<td width="70%">{[this.encode(values.name)]}<br/></td>',
	                    '</tr>',
	                '</table>',
	            '</div></tpl>',
	            {
	                encode: function(value) {
	                     if (value) {
	                        return Ext.util.Format.htmlEncode(value);
	                    } else {
	                        return '';
	                    }
	                }
	            }
	        )
	},config));
};

Tine.FundProject.Custom.getAppropriationRecordPicker = function(id, config){
	if(!id){
		id = 'appropriationEditorField';
	}
	return new Tine.Tinebase.widgets.form.RecordPickerComboBox(Ext.apply({
		id:id,
		disabledClass: 'x-item-disabled-view',
		recordClass: Tine.FundProject.Model.Appropriation,
		fieldLabel: 'Fördermittel',
	    allowBlank:false,
	    autoExpand: true,
	    triggerAction: 'all',
	    selectOnFocus: true,
	    itemSelector: 'div.search-item',
	    projectId: null,
	    appendFilters: [],
	    minChars: 2,
	    onBeforeQuery: function(qevent){
	    	this.store.baseParams.filter = [
	    	    {field: 'query', operator: 'contains', value: qevent.query }
	        ];
	    	this.store.baseParams.filter = this.store.baseParams.filter.concat(this.appendFilters);
	    	this.store.baseParams.sort = 'appropriation_nr';
	    	this.store.baseParams.dir = 'ASC';
	    },
	    setAppendFilters: function(appendFilters){
	    	this.appendFilters = appendFilters;
	    },
	    setProjectId: function(projectId){
	    	this.projectId = projectId;
	    	this.setAppendFilters([{field: 'project_id', operator: 'AND', value: [{field:'id',operator:'in',value:this.projectId}]}]);
	    	this.setValue(null);
	    	this.store.removeAll();
	    	this.store.reload();
	    },
	    onBeforeLoad: function(store, options) {
	        options.params.paging = {
                start: options.params.start,
                limit: options.params.limit
            };
	        options.params.sort = 'appropriation_nr';
	        options.params.dir = 'ASC';
	        options.params.paging.sort = 'appropriation_nr';
		    options.params.paging.dir = 'ASC';
	    },  
	    tpl:new Ext.XTemplate(
	            '<tpl for="."><div class="search-item">',
	                '<table cellspacing="0" cellpadding="2" border="0" style="font-size: 12px;" width="100%">',
	                    '<tr  style="font-size: 12px;border-bottom:1px solid #000000;">',
	                        '<td width="30%"><b>{[this.encode(values.appropriation_nr)]}</b></td>',
	                        '<td width="70%">{[this.encode(values.name)]}<br/></td>',
	                    '</tr>',
	                '</table>',
	            '</div></tpl>',
	            {
	                encode: function(value) {
	                     if (value) {
	                        return Ext.util.Format.htmlEncode(value);
	                    } else {
	                        return '';
	                    }
	                }
	            }
	        )
	},config));
};



Tine.FundProject.Custom.getPromotionAreaRecordPicker = function(id, config){
	if(!id){
		id = 'promotionAreaEditorField';
	}
	return new Tine.Tinebase.widgets.form.RecordPickerComboBox(Ext.apply({
		id:id,
		disabledClass: 'x-item-disabled-view',
		recordClass: Tine.FundProject.Model.PromotionArea,
		fieldLabel: 'Förderbereich',
	    allowBlank:false,
	    autoExpand: true,
	    triggerAction: 'all',
	    selectOnFocus: true,
	    hasDefault: true,
	    injectStore: true,
	    store: Tine.FundProject.getStore('PromotionArea')
	},config));
};

Tine.FundProject.Custom.getProjectRoleRecordPicker = function(id, config){
	if(!id){
		id = 'projectRoleEditorField';
	}
	return new Tine.Tinebase.widgets.form.RecordPickerComboBox(Ext.apply({
		id:id,
		disabledClass: 'x-item-disabled-view',
		recordClass: Tine.FundProject.Model.ProjectRole,
		fieldLabel: 'Projektrolle',
	    allowBlank:false,
	    autoExpand: true,
	    triggerAction: 'all',
	    selectOnFocus: true,
	    hasDefault: true,
	    injectStore: true,
	    store: Tine.FundProject.getStore('ProjectRole')
	},config));
};

Tine.FundProject.Custom.getFundsCategoryRecordPicker = function(id, config){
	if(!id){
		id = 'fundsCategoryEditorField';
	}
	return new Tine.Tinebase.widgets.form.RecordPickerComboBox(Ext.apply({
		id:id,
		disabledClass: 'x-item-disabled-view',
		recordClass: Tine.FundProject.Model.FundsCategory,
		fieldLabel: 'Mittelkategorie',
	    allowBlank:false,
	    autoExpand: true,
	    triggerAction: 'all',
	    selectOnFocus: true,
	    hasDefault: true,
	    injectStore: true,
	    store: Tine.FundProject.getStore('FundsCategory')
	},config));
};

Tine.FundProject.Custom.getFundsKindRecordPicker = function(id, config){
	if(!id){
		id = 'fundsKindEditorField';
	}
	return new Tine.Tinebase.widgets.form.RecordPickerComboBox(Ext.apply({
		id:id,
		disabledClass: 'x-item-disabled-view',
		recordClass: Tine.FundProject.Model.FundsKind,
		fieldLabel: 'Mittelart',
	    allowBlank:false,
	    autoExpand: true,
	    triggerAction: 'all',
	    selectOnFocus: true,
	    hasDefault: true,
	    injectStore: true,
	    store: Tine.FundProject.getStore('FundsKind')
	},config));
};

Tine.FundProject.Custom.getDepartmentRecordPicker = function(id, config){
	if(!id){
		id = 'departmentEditorField';
	}
	return new Tine.Tinebase.widgets.form.RecordPickerComboBox(Ext.apply({
		id:id,
		disabledClass: 'x-item-disabled-view',
		recordClass: Tine.FundProject.Model.Department,
		fieldLabel: 'Referat',
	    allowBlank:false,
	    autoExpand: true,
	    triggerAction: 'all',
	    selectOnFocus: true,
	    hasDefault: true,
	    injectStore: true,
	    store: Tine.FundProject.getStore('Department')
	},config));
};

Tine.FundProject.Custom.getRecordPicker = function(modelName, id, config){
	switch(modelName){
	case 'Project':
		return Tine.FundProject.Custom.getProjectRecordPicker(id, config);
	case 'Appropriation':
		return Tine.FundProject.Custom.getAppropriationRecordPicker(id, config);
	case 'PromotionArea':
		return Tine.FundProject.Custom.getPromotionAreaRecordPicker(id, config);
	case 'ProjectRole':
		return Tine.FundProject.Custom.getProjectRoleRecordPicker(id, config);
	case 'FundsCategory':
		return Tine.FundProject.Custom.getFundsCategoryRecordPicker(id, config);
	case 'FundsKind':
		return Tine.FundProject.Custom.getFundsKindRecordPicker(id, config);
	case 'Department':
		return Tine.FundProject.Custom.getDepartmentRecordPicker(id, config);
	default: 
		throw 'Unknown model type for record picker';
	}
};