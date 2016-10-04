Ext.namespace("Zarafa.plugins.privacyidea.settings");

/**
 * @class Zarafa.plugins.privacyidea.settings.SettingsPrivacyIDEAWidget
 * @extends Zarafa.settings.ui.SettingsWidget
 *
 * @author Daniel Rauer, bytemine GmbH
 * @copyright 2016 bytemine GmbH
 * @license http://www.gnu.org/licenses/ GNU Affero General Public License
 * @link https://www.bytemine.net/
 *
 * Widget view in settings for two-factor authentication
 */
Zarafa.plugins.privacyidea.settings.SettingsPrivacyIDEAWidget = Ext.extend(Zarafa.settings.ui.SettingsWidget, {
	constructor: function(a) 
	{
		a = a || {};
		Ext.applyIf(a, {
			title: dgettext("plugin_privacyidea", "Configuration two-factor authentication"),
			layout: "form",
			items: [{
				xtype: "displayfield",
				hideLabel: true,
				value: dgettext("plugin_privacyidea", "The two-factor authentication provides an additional protection for the Zarafa WebApp.") + "<br />" +
					dgettext("plugin_privacyidea", "After activation you need next to your password an one-time code to log in.") + "<br />" + "<br />" +
					dgettext("plugin_privacyidea", "To generate an one-time code, you have to configure an OTP device like a YubiKey.") + "<br />&nbsp;"
			}, {
				xtype: "button",
				text: dgettext("plugin_privacyidea", "Configuration"),
				handler: this.openConfigurationDialog,
				scope: this,
				disabled: !container.getSettingsModel().get("zarafa/v1/plugins/privacyidea/enable_but_conf"),
				width: 250
			}, {
				xtype: "displayfield",
				hideLabel: true,
				value: "<hr />" + dgettext("plugin_privacyidea", "Activate or deactivate the two-factor authentication.") + "<br />&nbsp;"
			}, {
				xtype: "displayfield",
				fieldLabel: dgettext("plugin_privacyidea", "Current status"),
				value: this.getStatus(),
				htmlEncode: true,
				ref: "status",
				width: 250
                        }, {
				xtype: "displayfield",
				hideLabel: true,
				value: ""
			}, {
				xtype: "button",
				text: dgettext("plugin_privacyidea", "Activation/Deactivation"),
				handler: this.activate,
				scope: this,
				disabled: !container.getSettingsModel().get("zarafa/v1/plugins/privacyidea/enable_but_activ"),
				width: 250
			}, {
				xtype: "displayfield",
				hideLabel: true,
				value: "<hr />" + dgettext("plugin_privacyidea", "You can completely reset the configuration.") + "<br />" +
					dgettext("plugin_privacyidea", "This deletes the configuration of the two-factor authentication.") + "<br />&nbsp;"
			}, {
				xtype: "button",
				text: dgettext("plugin_privacyidea", "Reset"),
				handler: this.openResetConfigurationDialog,
				scope: this,
				disabled: !container.getSettingsModel().get("zarafa/v1/plugins/privacyidea/enable_but_reset"),
				width: 250
			}]
		});
		Zarafa.plugins.privacyidea.settings.SettingsPrivacyIDEAWidget.superclass.constructor.call(this, a)
	},
	getStatus: function()
	{
		return (Zarafa.plugins.privacyidea.data.Configuration.isActivated() ? dgettext("plugin_privacyidea", "Activated") : dgettext("plugin_privacyidea", "Deactivated"))
	},
	openResetConfigurationDialog: function() 
	{
		Zarafa.common.dialogs.MessageBox.show({
			title: dgettext("plugin_privacyidea", "Reset"),
			msg: dgettext("plugin_privacyidea", "Do you really want to reset the configuration?"),
			icon: Zarafa.common.dialogs.MessageBox.QUESTION,
			buttons: Zarafa.common.dialogs.MessageBox.YESNO,
			fn: this.resetConfiguration,
			scope: this
		})
	},
	resetConfiguration: function(a) 
	{
		if (a === "yes") {
			container.getRequest().singleRequest("privacyideamodule", "resetconfiguration", {}, new Zarafa.plugins.privacyidea.data.ResponseHandler({
                        	successCallback: this.openResetConfigurationFinishDialog.createDelegate(this)
	                }))
		}
	},
	openResetConfigurationFinishDialog: function(a) 
	{
		Zarafa.plugins.privacyidea.data.Configuration.gotIsActivated(a);
		this.status.setValue(this.getStatus());
		Zarafa.common.dialogs.MessageBox.show({
			title: dgettext("plugin_privacyidea", "Reset"),
			msg: dgettext("plugin_privacyidea", "The configuration has been reset."),
			icon: Zarafa.common.dialogs.MessageBox.INFO,
			buttons: Zarafa.common.dialogs.MessageBox.OK,
			scope: this
		})
	},
	openConfigurationDialog: function(a) 
	{
		Zarafa.common.dialogs.MessageBox.addCustomButtons({
			title: dgettext("plugin_privacyidea", "Configuration"),
			msg: dgettext("plugin_privacyidea", "Please install an authentication App on second device:") + "<br />" +
				dgettext("plugin_privacyidea", "Afterwards test the function with a generated code to ensure that the configurations are correct."),
			fn: this.openVerifyCodeDialog,
			customButton: [{
                                text: dgettext("plugin_privacyidea", "Test"),
                                name: "verify"
                        }],
			scope: this,
			width: 500
		})
	},
	openVerifyCodeDialog: function(a) 
	{
		if (a === "verify")
			Zarafa.common.dialogs.MessageBox.prompt(dgettext("plugin_privacyidea", "Test generated code"), dgettext("plugin_privacyidea", "Please enter code"), this.verifyCode, this)
	},
	verifyCode: function(a, b) 
	{
		if (a === "ok") {
			container.getRequest().singleRequest("privacyideamodule", "verifycode", {code: b}, new Zarafa.plugins.privacyidea.data.ResponseHandler({
                        	successCallback: this.openResponseDialog.createDelegate(this)
	                }))
		}	
	},
	openResponseDialog: function(a) 
	{
		if (a.isCodeOK) 
		{
			Zarafa.common.dialogs.MessageBox.show({
                                title: dgettext("plugin_privacyidea", "Test generated code"),
                                msg: dgettext("plugin_privacyidea", "Valid code, you can use the two-factor authentication."),
                                icon: Zarafa.common.dialogs.MessageBox.INFO,
                                buttons: Zarafa.common.dialogs.MessageBox.OK,
                                scope: this,
				width: 350
                        })
		} else {
			Zarafa.common.dialogs.MessageBox.show({
				title: dgettext("plugin_privacyidea", "Test generated code"),
				msg: dgettext("plugin_privacyidea", "Invalid code, please check code.") + "<br />" +
					dgettext("plugin_privacyidea", "You can use a code only one-time.") + "<br />" + 
					dgettext("plugin_privacyidea", "Please make sure that time from of server and second device are correct."),
				icon: Zarafa.common.dialogs.MessageBox.ERROR,
				buttons: Zarafa.common.dialogs.MessageBox.OK,
				scope: this,
				width: 350
			})
		}
	},
	activate: function() 
	{
		container.getRequest().singleRequest("privacyideamodule", "activate", {}, new Zarafa.plugins.privacyidea.data.ResponseHandler({
			successCallback: this.setStatus.createDelegate(this)
		}))
	},
	setStatus: function(a) 	
	{
		Zarafa.plugins.privacyidea.data.Configuration.gotIsActivated(a);
		this.status.setValue(this.getStatus());
		container.getNotifier().notify("info.saved", dgettext("plugin_privacyidea", "Two-factor authentication") + ": " + this.getStatus(), 
			dgettext("plugin_privacyidea", "Current status") + ": " + this.getStatus())
	}
});
Ext.reg("Zarafa.plugins.privacyidea.settingsprivacyideawidget", Zarafa.plugins.privacyidea.settings.SettingsPrivacyIDEAWidget);
