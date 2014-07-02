Ext.ns('Tine.FundProject.Api');

Tine.FundProject.Api.ApiAppropriation = function(config){
	config = config || {};
    Ext.apply(this, config);

    Tine.FundProject.Api.ApiAppropriation.superclass.constructor.call(this);
};

Tine.FundProject.Api.ApiAppropriationPayout = function(config){
	config = config || {};
    Ext.apply(this, config);

    Tine.FundProject.Api.ApiAppropriationPayout.superclass.constructor.call(this);
};

Ext.extend(Tine.FundProject.Api.ApiAppropriation, Ext.util.Observable, {
	currentAction: null,
	confirmAppropriation: function(action, event){
		if(action.source.getSelectedRecord().isNew()){
			return false;
		}
		this.checkCanAddAppropriation(action);
		
	},
	checkCanAddAppropriation: function(action){
		this.currentAction = action;
	    Ext.Ajax.request({
			scope:this,
	        params: {
	            method: 'FundProject.appropriationCanBeConfirmed',
	            appropriationId:  action.source.getSelectedRecord().get('id')
	        },
	        success: this.onCheckCanAddAppropriation,
	        failure: this.onCheckCanAddAppropriationFailure
	    });
	},
	onCheckCanAddAppropriation: function(response){
		var action = this.currentAction;
		var result = Ext.util.JSON.decode(response.responseText);
		
		if(result.success == true && result.check == true){
		
			var win = Tine.FundProject.ChangeAppropriationDialog.openWindow({
	    		panelTitle: 'Mittelbewilligung erfassen',
	    		changeSet: 'Confirmation',
	    		appropriationRecord: action.source.getSelectedRecord()
	    	});
			win.on('beforeclose', action.source.onBeforeCloseChangeDialog, action.source);
		}else{
			var messages = result.noAddMessages;
			
			Ext.MessageBox.show({
	             title: 'Hinweis', 
	             msg: messages.join('</br>'),
	             buttons: Ext.Msg.OK,
	             icon: Ext.MessageBox.INFO
	         });
			
		}
	},
	onCheckCanAddAppropriationFailure: function(){
		Ext.MessageBox.show({
            title: 'Fehler', 
            msg: 'Beim Versuch, das Mittel zu bewilligen, ist ein Fehler aufgetreten.',
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.INFO
        });
	},
	cancelAppropriation: function(action, event){
		if(action.source.getSelectedRecord().isNew()){
			return false;
		}
		
		var record = action.source.getSelectedRecord();
		var confirmedAmount = parseFloat(record.get('confirmed_amount'),4);
		if(confirmedAmount==0){
			action.source.rejectAppropriation();
		}else{
			Ext.Ajax.request({
				scope:action.source,
	            params: {
	                method: 'FundProject.requestAppropriationChange',
	                appropriationId:  record.get('id'),
	                data:{ confirmed_amount: confirmedAmount, state: 'REJECTED'},
	                changeSet: 'Liquidation'
	            },
	            success: action.source.onBeforeCloseChangeDialog,
	            failure: function(){}
	        });
		}
	},
	reallocateAppropriation: function(action, event){
		if(action.source.getSelectedRecord().isNew()){
			return false;
		}
		var win = Tine.FundProject.ChangeAppropriationDialog.openWindow({
    		panelTitle: 'Umwidmung erfassen',
    		changeSet: 'Reallocation',
    		appropriationRecord: action.source.getSelectedRecord()
    	});
		win.on('beforeclose', action.source.onBeforeCloseChangeDialog, action.source);
	},
	liquidateAppropriation: function(action, event){
		if(action.source.getSelectedRecord().isNew()){
			return false;
		}
		var win = Tine.FundProject.ChangeAppropriationDialog.openWindow({
    		panelTitle: 'Bewilligungslöschung erfassen',
    		changeSet: 'Liquidation',
    		appropriationRecord: action.source.getSelectedRecord()
    	});
		win.on('beforeclose', action.source.onBeforeCloseChangeDialog, action.source);
	},
	reverseAppropriation: function(action, event){
		if(action.source.getSelectedRecord().isNew()){
			return false;
		}
		var win = Tine.FundProject.ChangeAppropriationDialog.openWindow({
    		panelTitle: 'Bewilligung stornieren',
    		changeSet: 'Reverse',
    		appropriationRecord: action.source.getSelectedRecord()
    	});
		win.on('beforeclose', action.source.onBeforeCloseChangeDialog, action.source);
	},
	requestPayout: function(action, event){
		if(action.source.getSelectedRecord().isNew()){
			return false;
		}
		var win = Tine.FundProject.ChangeAppropriationDialog.openWindow({
    		panelTitle: 'Auszahlungsanforderung erfassen',
    		changeSet: 'RequestPayout',
    		appropriationRecord: action.source.getSelectedRecord()
    	});
		win.on('beforeclose', action.source.onBeforeCloseChangeDialog, action.source);
	},
	payIn: function(action, event){
		if(action.source.getSelectedRecord().isNew()){
			return false;
		}
		var win = Tine.FundProject.ChangeAppropriationDialog.openWindow({
    		panelTitle: 'Einzahlung erfassen',
    		changeSet: 'Payin',
    		appropriationRecord: action.source.getSelectedRecord()
    	});
		win.on('beforeclose', action.source.onBeforeCloseChangeDialog, action.source);
	},
	payOut: function(action, event){
		if(action.source.getSelectedRecord().isNew()){
			return false;
		}
		var win = Tine.FundProject.ChangeAppropriationDialog.openWindow({
    		panelTitle: 'Auszahlung erfassen',
    		changeSet: 'Payout',
    		appropriationRecord: action.source.getSelectedRecord()
    	});
		win.on('beforeclose', action.source.onBeforeCloseChangeDialog, action.source);
	}
	
	
});


Ext.extend(Tine.FundProject.Api.ApiAppropriationPayout, Ext.util.Observable, {
	currentAction: null,
	releasePayout: function(action, event){
		var ids = action.source.getSelectedIds();
		Ext.Ajax.request({
			scope:action.source,
            params: {
                method: 'FundProject.requestAppropriationPayoutChange',
                ids: Ext.util.JSON.encode(ids),
                requestChangeType: 'RELEASE'
            },
            success: action.source.refresh,
            failure: this.onRequestPayoutChangeFailure
        });
		
	},
	execPayout: function(action, event){
		var ids = action.source.getSelectedIds();
		var requestChangeType;
		if(ids){
			requestChangeType = 'EXEC';
		}else{
			requestChangeType = 'EXECDUE';
			ids = [];
		}
		
		var downloader = new Ext.ux.file.Download({
            params: {
                method: 'FundProject.requestAppropriationPayoutChange',
                requestType: 'HTTP',
                ids: Ext.util.JSON.encode(ids),
                requestChangeType:  requestChangeType
            }
        }).start();
		
	},
	
	onRequestPayoutChangeFailure: function(){
		Ext.MessageBox.show({
            title: 'Fehler', 
            msg: 'Beim Bearbeiten der Auszahlung(en) ist ein Fehler aufgetreten.',
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.INFO
        });
	}
});


Ext.ns('Tine.FundProject.Api.Appropriation');

Tine.FundProject.Api.Appropriation.getInstance = function(){
	if(!Tine.FundProject.Api.ApiAppropriationInstance){
		Tine.FundProject.Api.ApiAppropriationInstance = new Tine.FundProject.Api.ApiAppropriation();
	}
	return Tine.FundProject.Api.ApiAppropriationInstance;
}



Tine.FundProject.Api.Appropriation.getActions = function( scope ){
	
	scope.action_confirmAppropriation = new Ext.Action({
        actionType: 'edit',
        handler: Tine.FundProject.Api.Appropriation.getInstance().confirmAppropriation,
        disabled:true,
        text: 'Bewilligung',
        iconCls: 'actionEdit',
        source: scope,
        scope: Tine.FundProject.Api.Appropriation.getInstance()
    });
	
	scope.action_cancelAppropriation = new Ext.Action({
        actionType: 'edit',
        handler: Tine.FundProject.Api.Appropriation.getInstance().cancelAppropriation,
        disabled:true,
        text: 'Ablehnung',
        iconCls: 'actionEdit',
        source: scope,
        scope: Tine.FundProject.Api.Appropriation.getInstance()
    });
	
	scope.action_reallocateAppropriation = new Ext.Action({
        actionType: 'edit',
        handler: Tine.FundProject.Api.Appropriation.getInstance().reallocateAppropriation,
        disabled:true,
        text: 'Umwidmung',
        iconCls: 'actionEdit',
        source: scope,
        scope: this
    });
	
	scope.action_liquidateAppropriation = new Ext.Action({
        actionType: 'edit',
        handler: Tine.FundProject.Api.Appropriation.getInstance().liquidateAppropriation,
        disabled:true,
        text: 'Bewilligungslöschung',
        iconCls: 'actionEdit',
        source: scope,
        scope: Tine.FundProject.Api.Appropriation.getInstance()
    });
	
	scope.action_reverseAppropriation = new Ext.Action({
        actionType: 'edit',
        handler: Tine.FundProject.Api.Appropriation.getInstance().reverseAppropriation,
        disabled:true,
        text: 'Storno',
        iconCls: 'actionEdit',
        source: scope,
        scope: Tine.FundProject.Api.Appropriation.getInstance()
    });
	
	scope.action_requestPayout = new Ext.Action({
        actionType: 'edit',
        handler: Tine.FundProject.Api.Appropriation.getInstance().requestPayout,
        disabled:true,
        text: 'Auszahlung anfordern',
        iconCls: 'actionEdit',
        source: scope,
        scope: Tine.FundProject.Api.Appropriation.getInstance()
    });
	
	scope.action_payOut = new Ext.Action({
        actionType: 'edit',
        handler: Tine.FundProject.Api.Appropriation.getInstance().payOut,
        disabled:true,
        text: 'Auszahlung',
        iconCls: 'actionEdit',
        source: scope,
        scope: Tine.FundProject.Api.Appropriation.getInstance()
    });
	
	scope.action_payIn = new Ext.Action({
        actionType: 'edit',
        handler: Tine.FundProject.Api.Appropriation.getInstance().payIn,
        disabled:true,
        text: 'Einzahlung',
        iconCls: 'actionEdit',
        source: scope,
        scope: Tine.FundProject.Api.Appropriation.getInstance()
    });
	
	
	scope.actions_rebooking = new Ext.Action({
     	allowMultiple: false,
     	text: 'Umbuchung',
        menu:{
         	items:[
         	       scope.action_reallocateAppropriation,
         	       scope.action_liquidateAppropriation,
         	       scope.action_reverseAppropriation
         	]
         }
     });
}





Ext.ns('Tine.FundProject.Api.AppropriationPayout');

Tine.FundProject.Api.AppropriationPayout.getInstance = function(){
	if(!Tine.FundProject.Api.ApiAppropriationPayoutInstance){
		Tine.FundProject.Api.ApiAppropriationPayoutInstance = new Tine.FundProject.Api.ApiAppropriationPayout();
	}
	return Tine.FundProject.Api.ApiAppropriationPayoutInstance;
}

Tine.FundProject.Api.AppropriationPayout.getActions = function( scope ){
	
	scope.action_releasePayout = new Ext.Action({
        actionType: 'edit',
        handler: Tine.FundProject.Api.AppropriationPayout.getInstance().releasePayout,
        disabled:false,
        text: 'Auszahlung freigeben',
        iconCls: 'actionEdit',
        source: scope,
        scope: Tine.FundProject.Api.AppropriationPayout.getInstance()
    });
	
	scope.action_execPayout = new Ext.Action({
        actionType: 'edit',
        handler: Tine.FundProject.Api.AppropriationPayout.getInstance().execPayout,
        disabled:false,
        text: 'Auszahlung veranlassen (DTA)',
        iconCls: 'actionEdit',
        source: scope,
        scope: Tine.FundProject.Api.AppropriationPayout.getInstance()
    });
	
};