<?php

if(!defined('PLUGIN_PRIVACYIDEA_LDAP_HOST')) {
if(file_exists("../config.php")) {
include("../config.php");
} elseif (file_exists("config.php")) {
include("config.php");
}
}

function radius_auth($username, $code) {
	$radius = radius_auth_open();
	radius_add_server($radius, PLUGIN_PRIVACYIDEA_VALIDATION_SERVER, 0, PLUGIN_PRIVACYIDEA_RADIUS_SECRET, 5, 1);
	radius_create_request($radius, RADIUS_ACCESS_REQUEST);
	radius_put_attr($radius, RADIUS_USER_NAME, $_SESSION['privacyIDEAUsername']);
	radius_put_attr($radius, RADIUS_USER_PASSWORD, $code);
	$result = radius_send_request($radius);

	if($result == 2) {
		return true;
	} else {
		return false;
	}
}

function derive_uid($username) {
	$uid = $username;

	if (strpos($username, "@")) {

            // i assume, that user logs in with uid@ou
            $a_rdn = explode ("@", $username);
            $uid = $a_rdn[0];
        }

	return "$uid";
}

function derive_base_dn($username) {
	if (strpos($username, "@")) {

		// i assume, that user logs in with uid@ou
		$a_rdn = explode ("@", $username);
		$uid = $a_rdn[0];
		$uid_domain = $a_rdn[1];
	}

	return "uid=$uid,cn=".PLUGIN_PRIVACYIDEA_LDAP_USER_GROUP.",ou=$uid_domain";
}

function has_yubikey_attribute($uid) {
    $ldap_host = PLUGIN_PRIVACYIDEA_LDAP_HOST;
    $ldap_port = PLUGIN_PRIVACYIDEA_LDAP_PORT;
    $ldap_search_base_config = PLUGIN_PRIVACYIDEA_LDAP_SEARCH_BASE;
    $ldap_username_attribute_config = PLUGIN_PRIVACYIDEA_LDAP_USERNAME_ATTRIBUTE;
    $ldap_yubikey_attribute_config = PLUGIN_PRIVACYIDEA_LDAP_YUBIKEY_ATTRIBUTE;

    $base_dn = derive_base_dn($uid);

    $uid_l = derive_uid($uid);

    $ldap_search_base = "$base_dn,$ldap_search_base_config";

    //This attribute will be returned and will be matched with the used username
    $ldap_username_attribute = "$ldap_username_attribute_config";

    //This attribute will contain the 12bits publicid of the users OTP.
    $ldap_yubikey_attribute = "$ldap_yubikey_attribute_config";

    $ds=ldap_connect($ldap_host, $ldap_port);

    ldap_set_option($ds, LDAP_OPT_PROTOCOL_VERSION, 3);
    ldap_set_option($ds, LDAP_OPT_REFERRALS, 0);
    $has_yubikey = false;
    if ($ds) {
        $r = ldap_bind($ds);
	$sr = ldap_search($ds, $ldap_search_base, "$ldap_username_attribute=$uid_l");

        $info = ldap_first_entry($ds, $sr);

        if ($info) {
		$attribute = ldap_first_attribute($ds, $info);
		while ($attribute) {
			if($attribute == $ldap_yubikey_attribute_config) {
				// found the attribute with the configured name in LDAP object of the user
				$has_yubikey = true;
			}
			$attribute = ldap_next_attribute($ds, $info);
		}
        }

    }

    ldap_close($ds);
    return $has_yubikey;
}

function get_publicid($publicid) {
        $ldap_host = PLUGIN_PRIVACYIDEA_LDAP_HOST;
        $ldap_port = PLUGIN_PRIVACYIDEA_LDAP_PORT;
        $ldap_search_base_config = PLUGIN_PRIVACYIDEA_LDAP_SEARCH_BASE;
        $ldap_username_attribute_config = PLUGIN_PRIVACYIDEA_LDAP_USERNAME_ATTRIBUTE;
        $ldap_yubikey_attribute_config = PLUGIN_PRIVACYIDEA_LDAP_YUBIKEY_ATTRIBUTE;

        $ldap_search_base = "$ldap_search_base_config";

        //This attribute will be returned and will be matched with the used username
        $ldap_username_attribute = "dn";
        $dn = "";

        //This attribute will contain the 12bits publicid of the users OTP.
        $ldap_yubikey_attribute = "$ldap_yubikey_attribute_config";

        $ds = ldap_connect($ldap_host, $ldap_port);  // must be a valid LDAP server!
	ldap_set_option($ds, LDAP_OPT_PROTOCOL_VERSION, 3);
	ldap_set_option($ds, LDAP_OPT_REFERRALS, 0);

        if ($ds) {

                $r = ldap_bind($ds);

                $sr = ldap_search($ds, $ldap_search_base, "$ldap_yubikey_attribute=$publicid");

                $info = ldap_get_entries($ds, $sr);

                if ($info["count"] == 1) {
                        $dn = $info[0][$ldap_username_attribute];
                }
        }

	if (strpos($dn, ",")) {	
		$a_dn = explode (",", $dn);
	}

        ldap_close($ds);

	$username_0 = $a_dn[0];
        $domain_0 = $a_dn[2];

	$a_username = explode("=", $username_0);
	$a_domain = explode("=", $domain_0);
	$username = $a_username[1] ."@". $a_domain[1];

        return($username);

}
?>
