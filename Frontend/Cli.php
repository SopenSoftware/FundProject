 <?php
/**
 * Tine 2.0
 * @package     FundProject
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Hans-Jürgen Hartl <hhartl@sopen.de>
 * @copyright   Copyright (c) 2010 sopen GmbH (http://www.sopen.de)
 * @version     $Id: Cli.php  $
 * 
 */

/**
 * cli server for FundProject
 *
 * This class handles cli requests for the FundProject
 *
 * @package     FundProject
 */
class FundProject_Frontend_Cli extends Tinebase_Frontend_Cli_Abstract
{
    /**
     * the internal name of the application
     *
     * @var string
     */
    protected $_applicationName = 'FundProject';
    
    /**
     * import config filename
     *
     * @var string
     */
    protected $_configFilename = 'importconfig.inc.php';

    /**
     * help array with function names and param descriptions
     */

    /**
     * import Donations
     *
     * @param Zend_Console_Getopt $_opts
     */
    public function importProjects($_opts)
    {
    	set_time_limit(0);
        parent::_import($_opts, FundProject_Controller_Project::getInstance());        
    }
    
	public function importAppropriations($_opts)
    {
    	set_time_limit(0);
        parent::_import($_opts, FundProject_Controller_Appropriation::getInstance());        
    }

    public function importAppropriationPayouts($_opts)
    {
    	set_time_limit(0);
        parent::_import($_opts, FundProject_Controller_AppropriationPayout::getInstance());        
    }
    
	public function importAppropriationChanges($_opts)
    {
    	set_time_limit(0);
        parent::_import($_opts, FundProject_Controller_AppropriationChange::getInstance());        
    }
}
