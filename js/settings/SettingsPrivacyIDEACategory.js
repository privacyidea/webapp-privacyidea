Ext.namespace("Zarafa.plugins.privacyidea.settings");

/**
 * @class Zarafa.plugins.privacyidea.settings.SettingsPrivacyIDEACategory
 * @extends Zarafa.settings.ui.SettingsCategory
 *
 * @author Daniel Rauer, bytemine GmbH
 * @copyright 2016 bytemine GmbH
 * @license http://www.gnu.org/licenses/ GNU Affero General Public License
 * @link https://www.bytemine.net/
 *
 * Category view for two-factor authentication in settings
 */
Zarafa.plugins.privacyidea.settings.SettingsPrivacyIDEACategory = Ext.extend(Zarafa.settings.ui.SettingsCategory, {
	constructor: function(a) 
	{
        	a = a || {};
		Ext.applyIf(a, {
			title: dgettext("plugin_privacyidea", "PrivacyIDEA 2FA"),
			categoryIndex: 1,
			iconCls: "icon_privacyidea_category",
			items: [{
				xtype: "Zarafa.plugins.privacyidea.settingsprivacyideawidget"
			}, container.populateInsertionPoint("context.settings.category.privacyidea", this)]
		});
		Zarafa.plugins.privacyidea.settings.SettingsPrivacyIDEACategory.superclass.constructor.call(this, a)
	}
});

Ext.reg("Zarafa.plugins.privacyidea.settingsprivacyideacategory", Zarafa.plugins.privacyidea.settings.SettingsPrivacyIDEACategory);
