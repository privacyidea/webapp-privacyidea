Ext.namespace('Zarafa.plugins.privacyidea');
Zarafa.plugins.privacyidea.ABOUT = '<p>Copyright &copy; 2016 bytemine GmbH &lt;info@bytemine.net&gt;, <a href="https://www.bytemine.net" target="_blank">https://www.bytemine.net</a></p><p>This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.</p><p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.</p><p>You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <a href="http://www.gnu.org/licenses/" target="_blank">http://www.gnu.org/licenses/</a>.</p><hr />';

/**
 * @class Zarafa.plugins.privacyidea.PrivacyIDEA
 * @extends Zarafa.core.Plugin
 *
 * @author Daniel Rauer, bytemine GmbH
 * @copyright 2016 bytemine GmbH
 * @license http://www.gnu.org/licenses/ GNU Affero General Public License
 * @link https://www.bytemine.net/
 *
 * Plugin PrivacyIDEA 
 */
Zarafa.plugins.privacyidea.PrivacyIDEA = Ext.extend(Zarafa.core.Plugin, {

	/**
	 * @constructor
	 * @param {Object} config Configuration object
	 */
	constructor : function (config)
	{
		config = config || {};
		Zarafa.plugins.privacyidea.PrivacyIDEA.superclass.constructor.call(this, config)
	},
	
	/**
	 * Init plugin
	 */
	initPlugin : function()
	{
		Zarafa.plugins.privacyidea.PrivacyIDEA.superclass.initPlugin.apply(this, arguments);
		Zarafa.plugins.privacyidea.data.Configuration.init();
		this.registerInsertionPoint("context.settings.categories", this.createSettingCategories, this)
	},

	/**
	 * Create category in settings
	 */
	createSettingCategories: function() {
		return {
        		xtype: "Zarafa.plugins.privacyidea.settingsprivacyideacategory"
		}
    	}
});

Zarafa.onReady(function() {
	container.registerPlugin(new Zarafa.core.PluginMetaData({
		name : 'privacyidea',
		displayName : _('PrivacyIDEA Plugin'),
		about: Zarafa.plugins.privacyidea.ABOUT,
		pluginConstructor : Zarafa.plugins.privacyidea.PrivacyIDEA
	}));
});
