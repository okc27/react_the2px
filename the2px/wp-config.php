<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'the2px_db' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );
define('WP_ALLOW_REPAIR', true);

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'sxhB(_n}em22Xg7@IpI#EmxEl.,S{{Uv?-M~foo$GJY3I;uN-I4Do<>~9=O(:r0m' );
define( 'SECURE_AUTH_KEY',  'J{[U(3vQA`QK2BR*ce=[p)(qI,%Ucl0/ZmvfJ>3Z:;&we8TfZbKCt9b|Q2_Ok6Rx' );
define( 'LOGGED_IN_KEY',    'B1|fqP$!!5Ps>R(1p)uv[NB/URSe[_$0A)Z~<zOfR=Zk0%lR;d{305iA^3`x|G$^' );
define( 'NONCE_KEY',        'XoBsuw^-gCUnk[TfCsiDfB!OiP4FM!SC.Y+Su:TcOjN|WUEWkS}&Wb{ECG4]sL<Y' );
define( 'AUTH_SALT',        'ne6MHu]%9_U,ZdYstlhW2qd6n8=+,RG,%.J-=40?L_mH4GIKZ4Jw!!qlK6c,P`;C' );
define( 'SECURE_AUTH_SALT', 'KT7`uRf5]D9>+N^^%q[fD4U%6,@lDWi|mK!LHN1Bb=$Zd=^R6=.]Px]V1k#V^x<F' );
define( 'LOGGED_IN_SALT',   'J~0K^;|G6zS#:LPB{WH.rr65WP?|Xd`u+bLWPFIpsO!LG|xOLF/`w*8j~4$Fz(AE' );
define( 'NONCE_SALT',       'xfxf:#6d<*}CgqU!1dE(vCY<mq0/fX&y6KqL0Wbuwy,ru( $Vi+Dn;d_:L(kqr#@' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */

define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);


/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
