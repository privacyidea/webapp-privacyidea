<?php

/**
 * PHP Class for handling database communication (settings)
 *
 * @class PrivacyIDEAData
 * @author Daniel Rauer, bytemine GmbH
 * @copyright 2016 bytemine GmbH
 * @license http://www.gnu.org/licenses/ GNU Affero General Public License
 * @link https://www.bytemine.net/
 */
class PrivacyIDEAData {

	/**
	 * Two-factor authentication activated
	 *
	 * @return boolean
	 */
	public static function isActivated() {
		return $GLOBALS["settings"]->get("zarafa/v1/plugins/privacyidea/activate");
	}

	/**
	 * Activate or deactivate two-factor authentication
	 *
	 * @param boolean $activate activation true/false
	 */
	public static function setActivate($activate) {
		$GLOBALS["settings"]->set("zarafa/v1/plugins/privacyidea/activate", $activate);
		$GLOBALS["settings"]->saveSettings();
	}

}

?>
