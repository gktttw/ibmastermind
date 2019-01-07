<?php
/**
 * Listeners
 *
 * @package GamiPress\bbPress\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

// New forum
function gamipress_bbp_new_forum( $forum ) {

    // On create a new forum, triggers gamipress_bbp_new_forum
    do_action( 'gamipress_bbp_new_forum', $forum['forum_id'], $forum['forum_author'] );

}
add_action( 'bbp_new_forum', 'gamipress_bbp_new_forum', 10 );

// New topic
function gamipress_bbp_new_topic( $topic_id, $forum_id, $anonymous_data, $topic_author ) {

    // On create a new topic on specific forum, triggers gamipress_bbp_specific_new_topic
    do_action( 'gamipress_bbp_specific_new_topic', $topic_id, $topic_author, $forum_id );

    // On create a new topic, triggers gamipress_bbp_new_topic
    do_action( 'gamipress_bbp_new_topic', $topic_id, $topic_author, $forum_id );

}
add_action( 'bbp_new_topic', 'gamipress_bbp_new_topic', 10, 4 );

// New reply
function gamipress_bbp_new_reply( $reply_id, $topic_id, $forum_id, $anonymous_data, $reply_author ) {

    // On reply on a specific topic, triggers gamipress_bbp_specific_new_reply
    do_action( 'gamipress_bbp_specific_new_reply', $reply_id, $reply_author, $topic_id );

    // On reply, triggers gamipress_bbp_new_reply
    do_action( 'gamipress_bbp_new_reply', $reply_id, $reply_author, $topic_id );

}
add_action( 'bbp_new_reply', 'gamipress_bbp_new_reply', 10, 5 );

// Favorite a topic
function gamipress_bbp_favorite_topic( $user_id, $topic_id ) {

    $topic_author = get_post_field( 'post_author', $topic_id );

    // Topic author get a new favorite on a topic, triggers gamipress_bbp_new_topic
    do_action( 'gamipress_bbp_get_favorite_topic', $topic_id, $topic_author );

    // On favorite a specific topic, triggers gamipress_bbp_specific_favorite_topic
    do_action( 'gamipress_bbp_specific_favorite_topic', $topic_id, $user_id );

    // On favorite a topic, triggers gamipress_bbp_new_topic
    do_action( 'gamipress_bbp_favorite_topic', $topic_id, $user_id );

}
add_action( 'bbp_add_user_favorite', 'gamipress_bbp_favorite_topic', 10, 2 );

// Delete forum
function gamipress_bbp_delete_forum( $forum_id ) {

    $user_id = get_current_user_id();

    // On delete a forum, triggers gamipress_bbp_delete_forum
    do_action( 'gamipress_bbp_delete_forum', $forum_id, $user_id );

}
add_action( 'bbp_delete_forum', 'gamipress_bbp_delete_forum' );

// Delete topic
function gamipress_bbp_delete_topic( $topic_id ) {

    $user_id = get_current_user_id();

    // On delete a topic, triggers gamipress_bbp_delete_topic
    do_action( 'gamipress_bbp_delete_topic', $topic_id, $user_id );

}
add_action( 'bbp_delete_topic', 'gamipress_bbp_delete_topic' );

// Delete reply
function gamipress_bbp_delete_reply( $reply_id ) {

    $user_id = get_current_user_id();

    // On delete a reply, triggers gamipress_bbp_delete_reply
    do_action( 'gamipress_bbp_delete_reply', $reply_id, $user_id );

}
add_action( 'bbp_delete_reply', 'gamipress_bbp_delete_reply' );