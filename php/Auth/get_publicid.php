<?php

function derive_uid($username) {

	$uid= $username;

	if (strpos($username, "@")) {
	
            // i assume, that user logs in with uid@ou                          
            $a_rdn = explode ("@", $username);                                  
            $uid = $a_rdn[0];                                                   
        } 

	return "$uid";
}

function derive_base_dn($username) {
	global $hosted;
	
	if($hosted) {
		if (strpos($username, "@")) {
		
		    // i assume, that user logs in with uid@ou                          
		    $a_rdn = explode ("@", $username);                                  
		    $uid = $a_rdn[0];                                                   
		    $uid_domain = $a_rdn[1];
		} 

		return "uid=$uid,cn=users,ou=$uid_domain";
	} else {
		return "uid=$username";
	}
}

function check_publicid($uid) {
    $ldap_host = "127.0.0.1";

    $base_dn = derive_base_dn($uid);

    $uid_l = derive_uid($uid);

    $ldap_search_base = "$base_dn,dc=bytemine,dc=net";

    //This attribute will be returned and will be matched with the used username
    $ldap_username_attribute = "uid";

    //This attribute will contain the 12bits publicid of the users OTP.
    $ldap_yubikey_attribute = "carlicense";

    $public_id = "";

    $ds=ldap_connect($ldap_host);

    ldap_set_option($ds, LDAP_OPT_PROTOCOL_VERSION, 3);
    ldap_set_option($ds, LDAP_OPT_REFERRALS, 0);

    if ($ds) {
        $r=ldap_bind($ds);

	$sr=ldap_search($ds, $ldap_search_base, "$ldap_username_attribute=$uid_l");

	$info = ldap_get_entries($ds, $sr);

	if ($info["count"] == 1) {
		$public_id = $info[0][$ldap_yubikey_attribute][0];
	}

    }
	
    ldap_close($ds);
    return $public_id;
}

function get_publicid($publicid) {
	global $hosted;

        $ldap_host = "127.0.0.1";
        
        $ldap_search_base = "dc=bytemine,dc=net";

        //This attribute will be returned and will be matched with the used username
        $ldap_username_attribute = "dn";
        $dn = "";

        //This attribute will contain the 12bits publicid of the users OTP.
        $ldap_yubikey_attribute = "carlicense";

        /////////////////////////////////////////////////////////////////////////////
        //No further configuration necessary!
        $ds=ldap_connect($ldap_host);  // must be a valid LDAP server!
	ldap_set_option($ds, LDAP_OPT_PROTOCOL_VERSION, 3);
	ldap_set_option($ds, LDAP_OPT_REFERRALS, 0);

        if ($ds) {

                $r=ldap_bind($ds);

                $sr=ldap_search($ds, $ldap_search_base, "$ldap_yubikey_attribute=$publicid");

                $info = ldap_get_entries($ds, $sr);

                if ($info["count"] == 1) {
                        $dn = $info[0][$ldap_username_attribute];
                }
        }

	if (strpos($dn, ",")) {	
		$a_dn = explode (",", $dn);
	}

        ldap_close($ds);

	$username_0= $a_dn[0];
        $domain_0= $a_dn[2];

	$a_username= explode("=", $username_0);
	$a_domain= explode("=", $domain_0);

	if($hosted) { 
		$username= $a_username[1] ."@". $a_domain[1];
	} else {
		$username= $a_username[1];
	}

        return($username);

}
?>
