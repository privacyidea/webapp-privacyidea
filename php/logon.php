<?php

/**
 * PHP file check code from two-factor authentication login page (login.php)
 *
 * @author Daniel Rauer, bytemine GmbH
 * @copyright 2016 bytemine GmbH
 * @license http://www.gnu.org/licenses/ GNU Affero General Public License
 * @link https://www.bytemine.net/
 */
	include("../../../init.php");
        include("../../../config.php");
	include("../../../server/includes/core/class.encryptionstore.php");
	require("Auth/get_publicid.php");

        session_name(COOKIE_NAME);
        session_start();

	$code = ($_POST && array_key_exists('token', $_POST)) ? $_POST['token'] : '';

	$has_yubikey = has_yubikey_attribute($_SESSION['privacyIDEAUsername']);
               if($has_yubikey == true) {
                       if($code != "") {
                               //Check if Yubikey public id is matched to the correct username
                               $publicid = substr($code, 0, 12);

                               $radius = radius_auth_open();
                               radius_add_server($radius, PLUGIN_PRIVACYIDEA_VALIDATION_SERVER, 0, PLUGIN_PRIVACYIDEA_RADIUS_SECRET, 5, 1);
                               radius_create_request($radius, RADIUS_ACCESS_REQUEST);
                               radius_put_attr($radius, RADIUS_USER_NAME, $_SESSION['privacyIDEAUsername']);
                               radius_put_attr($radius, RADIUS_USER_PASSWORD, $code);
                               $result = radius_send_request($radius);
                               if($result != 2) {
					$_SESSION['privacyIDEALoggedOn'] = FALSE; // login not successful
			                header('Location: login.php', true, 303);
                               }
		                $encryptionStore = EncryptionStore::getInstance();
               			$encryptionStore->add('username', $_SESSION['privacyIDEAUsername']);
		                $encryptionStore->add('password', $_SESSION['privacyIDEAPassword']);
		                $_SESSION['privacyIDEACode'] = $code; // to disable code 
		                $_SESSION['privacyIDEALoggedOn'] = TRUE; // 2FA successful
		                $_SESSION['fingerprint'] = $_SESSION['privacyIDEAFingerprint'];
		                $_SESSION['frontend-fingerprint'] = $_SESSION['privacyIDEAFrontendFingerprint'];
		                header('Location: ../../../index.php', true, 303);
                       }
               }
?>
