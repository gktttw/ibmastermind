<?php
define('WP_CACHE', true); // Added by WP Rocket
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'deceit5_wp968');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '3)&*^Dglo:1M8@^eG&mfG=1`Y|~*DAaDV)O-XQR>]-Zg>8YrgHEr6p}CPP392Zb#');
define('SECURE_AUTH_KEY',  'Vz8%?Gb95;|74B,V+3uJr}|Tatjb928{YI:D2+-XoxU=-/#!s%Pu+WL2O6R3fN?Y');
define('LOGGED_IN_KEY',    'T3Y6jN[cV;!NKV U^!_tgRA0|Msquw1AQdgCso:/0y12d./5|>S6#sQr2Gr*i@at');
define('NONCE_KEY',        'i&J|&bN/;_$Oe0eE_BLW,UU$)t!X h3i@69)X;}7WFV|[[* F(i uy1W+:_Q?^?n');
define('AUTH_SALT',        '(YU! +eKO&H&(R{Dnb5mRc7!!}|3+B,$mj8V695b7vqWInNt3^~_+7Y|c~MS0b[!');
define('SECURE_AUTH_SALT', '8Yz0Q8JD,m3hM>hv:cp7!%f]|B4~T/A9;V|[&)C+!|!zwO~{+8VDs29-([a:@+d8');
define('LOGGED_IN_SALT',   '#y(:;AHt/Wm5[jsvx18b.Oc>)#sPc2{2DUsT-E[<$[z-r??O@lN-j}d*XbQ/J+pa');
define('NONCE_SALT',       'DfJH$<h?v/8A:ev1yKcs!qx.s|OHf0J+&kAM&0zX;~,gLe.Kq[1@y(?U&-C8)+od');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp88_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

// stop caching
define('WP_CACHE', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');

