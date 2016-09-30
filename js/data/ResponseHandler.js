Ext.namespace("Zarafa.plugins.privacyidea.data");

/**
 * @class Zarafa.plugins.privacyidea.data.ResponseHandler
 * @extends Zarafa.core.data.AbstractResponseHandler
 *
 * @author Daniel Rauer, bytemine GmbH
 * @copyright 2016 bytemine GmbH
 * @license http://www.gnu.org/licenses/ GNU Affero General Public License
 * @link https://www.bytemine.net/
 *
 * Response handler for communication with server
 */
Zarafa.plugins.privacyidea.data.ResponseHandler = Ext.extend(Zarafa.core.data.AbstractResponseHandler, 
{
	successCallback: null,
	failureCallback: null,
	doResetconfiguration: function(a) 
	{
		this.successCallback(a)
	},
	doGetsecret: function(a) 
	{
		this.successCallback(a)
	},
	doActivate: function(a) 
	{
		this.successCallback(a)
	},
	doIsactivated: function(a) 
	{
		this.successCallback(a)
	},
	doVerifycode: function(a) 
	{
		this.successCallback(a)
	},
	doGettimelesscodes: function(a) 
	{
		this.successCallback(a)
	},
	doError: function(a) 
	{
		a.error ? Zarafa.common.dialogs.MessageBox.show(
		{
			title: "Error",
			msg: a.error.info.original_message,
			icon: Zarafa.common.dialogs.MessageBox.ERROR,
			buttons: Zarafa.common.dialogs.MessageBox.OK
		}) : Zarafa.common.dialogs.MessageBox.show({
			title: "Error",
			msg: a.info.original_message,
			icon: Zarafa.common.dialogs.MessageBox.ERROR,
			buttons: Zarafa.common.dialogs.MessageBox.OK
		})
	}
});
Ext.reg("zarafa.privacyidearesponsehandler", Zarafa.plugins.privacyidea.data.ResponseHandler);
