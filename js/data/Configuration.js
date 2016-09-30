Ext.namespace("Zarafa.plugins.privacyidea.data");
/**
 * @class Zarafa.plugins.privacyidea.data.Configuration
 * @extends Object
 *
 * @author Daniel Rauer, bytemine GmbH
 * @copyright 2016 bytemine GmbH
 * @license http://www.gnu.org/licenses/ GNU Affero General Public License
 * @link https://www.bytemine.net/
 *
 * Manage the inital settings if settings is loading
 */
Zarafa.plugins.privacyidea.data.Configuration = Ext.extend(Object, 
{
	activate: undefined,
	init: function() 
	{
		var a = new Zarafa.plugins.privacyidea.data.ResponseHandler({
			successCallback: this.gotIsActivated.createDelegate(this)
		});
		container.getRequest().singleRequest("privacyideamodule", "isactivated", {}, a)
	},
	gotIsActivated: function(a) 
	{
		this.activate = a.isActivated
	},
	isActivated: function(a) 
	{
		return this.activate
	}
});
Zarafa.plugins.privacyidea.data.Configuration = new Zarafa.plugins.privacyidea.data.Configuration;
