<?php

/**
 * @author Daniel Rauer, bytemine GmbH
 * @copyright 2016 bytemine GmbH
 * @license http://www.gnu.org/licenses/ GNU Affero General Public License
 * @link https://www.bytemine.net/
 */

include("../../../init.php");
include("../../../config.php");
include("../../../server/includes/core/class.encryptionstore.php");
require("Auth/auth_helper.php");

session_name(COOKIE_NAME);
session_start();

$code = ($_POST && array_key_exists('token', $_POST)) ? $_POST['token'] : '';

if(has_yubikey_attribute($_SESSION['privacyIDEAUsername'])) {
        if(!radius_auth($_SESSION['privacyIDEAUsername'], $code)) {
		// logon was not successful, redirect to the OTP form
                $_SESSION['privacyIDEALoggedOn'] = FALSE;
                header('Location: login.php', true, 303);
                exit;
        }
}

// rebuild the session and redirect to WebApp main page
$encryptionStore = EncryptionStore::getInstance();
$encryptionStore->add('username', $_SESSION['privacyIDEAUsername']);
$encryptionStore->add('password', $_SESSION['privacyIDEAPassword']);
$_SESSION['privacyIDEACode'] = $code; // to disable code
$_SESSION['privacyIDEALoggedOn'] = TRUE; // 2FA successful
$_SESSION['fingerprint'] = $_SESSION['privacyIDEAFingerprint'];
$_SESSION['frontend-fingerprint'] = $_SESSION['privacyIDEAFrontendFingerprint'];
header('Location: ../../../index.php', true, 303);

?>
