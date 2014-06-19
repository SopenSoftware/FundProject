<?php


/**
 * This class handles all Http requests for the FundProject application
 *
 * @package     FundProject
 * @subpackage  Frontend
 */
class FundProject_Frontend_Http extends Tinebase_Frontend_Http_Abstract
{
    protected $_applicationName = 'FundProject';
    
    /**
     * Returns all JS files which must be included for this app
     *
     * @return array Array of filenames
     */
    public function getJsFilesToInclude()
    {
        return array(
        	'FundProject/js/Models.js',
            'FundProject/js/Backend.js',
        	//'FundProject/js/AddressbookPlugin.js',
        	'FundProject/js/Custom.js',
        	'FundProject/js/MainScreen.js',
        	'FundProject/js/Api.js',
            'FundProject/js/AppropriationChangeEditDialog.js',
        	'FundProject/js/AppropriationChangeGridPanel.js',
        	'FundProject/js/AppropriationEditDialog.js',
        	'FundProject/js/AppropriationGridPanel.js',
        	'FundProject/js/AppropriationPayoutEditDialog.js',
        	'FundProject/js/AppropriationPayoutGridPanel.js',
        	'FundProject/js/DepartmentEditDialog.js',
        	'FundProject/js/DepartmentGridPanel.js',
        	'FundProject/js/FundsCategoryEditDialog.js',
        	'FundProject/js/FundsCategoryGridPanel.js',
            'FundProject/js/FundsKindEditDialog.js',
        	'FundProject/js/FundsKindGridPanel.js',
            'FundProject/js/ProjectContactEditDialog.js',
        	'FundProject/js/ProjectContactGridPanel.js',
        	'FundProject/js/ProjectEditDialog.js',
        	'FundProject/js/ProjectGridPanel.js',
        	'FundProject/js/Renderer.js',
        	'FundProject/js/ProjectRoleEditDialog.js',
        	'FundProject/js/ProjectRoleGridPanel.js',
        	'FundProject/js/PromotionAreaEditDialog.js',
        	'FundProject/js/PromotionAreaGridPanel.js',
        	'FundProject/js/ChangeAppropriationDialog.js'
        );
    }
    
    public function getCssFilesToInclude()
    {
        return array(
            'FundProject/css/FundProject.css'
        );
    }
    
	public function requestAppropriationPayoutChange($ids, $requestChangeType){
    	FundProject_Controller_AppropriationPayout::getInstance()->requestAppropriationPayoutChange($ids, $requestChangeType);
    	
    }
}
