<?php
/**
 * Recount Activity
 *
 * @package GamiPress\bbPress\Admin\Recount_Activity
 * @since 1.0.2
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Add recountable options to the Recount Activity Tool
 *
 * @since 1.0.2
 *
 * @param array $recountable_activity_triggers
 *
 * @return array
 */
function gamipress_bbp_recountable_activity_triggers( $recountable_activity_triggers ) {

    $recountable_activity_triggers[__( 'bbPress', 'gamipress-bbpress-integration' )] = array(
        'bbp_activities' => __( 'Recount forum activities (forums, topics and replies)', 'gamipress-bbpress-integration' ),
        'bbp_favorites' => __( 'Recount topics favorites', 'gamipress-bbpress-integration' ),
    );

    return $recountable_activity_triggers;

}
add_filter( 'gamipress_recountable_activity_triggers', 'gamipress_bbp_recountable_activity_triggers' );

/**
 * Recount bbPress activity
 *
 * @since 1.0.2
 *
 * @param array $response
 *
 * @return array $response
 */
function gamipress_bbp_activity_recount_activities( $response ) {

    global $wpdb;

    // Get all published forums
    $forums = $wpdb->get_results( $wpdb->prepare(
        "SELECT p.ID, p.post_author FROM $wpdb->posts AS p WHERE p.post_type = %s AND p.post_status = 'publish'",
        bbp_get_forum_post_type()
    ) );

    foreach( $forums as $forum ) {

        // Trigger new forum action for each forum
        gamipress_bbp_new_forum( array(
            'forum_id' => $forum->ID,
            'forum_author' => $forum->post_author,
        ) );

    }

    // Get all published topics
    $topics = $wpdb->get_results( $wpdb->prepare(
        "SELECT p.ID, p.post_author, p.post_parent FROM $wpdb->posts AS p WHERE p.post_type = %s AND p.post_status = 'publish'",
        bbp_get_topic_post_type()
    ) );

    foreach( $topics as $topic ) {
        // Trigger new topic action for each topic
        gamipress_bbp_new_topic( $topic->ID, $topic->post_parent, array(), $topic->post_author );
    }

    // Get all published replies
    $replies = $wpdb->get_results( $wpdb->prepare(
        "SELECT p.ID, p.post_author, p.post_parent FROM $wpdb->posts AS p WHERE p.post_type = %s AND p.post_status = 'publish'",
        bbp_get_reply_post_type()
    ) );

    foreach( $replies as $reply ) {
        $forum_id = wp_get_post_parent_id( $reply->post_parent );

        if( $forum_id ) {
            // Trigger new reply action for each reply
            gamipress_bbp_new_reply( $reply->ID, $reply->post_parent, $forum_id, array(), $reply->post_author );
        }
    }

    return $response;

}
add_filter( 'gamipress_activity_recount_bbp_activities', 'gamipress_bbp_activity_recount_activities' );


/**
 * Recount favorites
 *
 * @since 1.0.2
 *
 * @param array $response
 *
 * @return array $response
 */
function gamipress_bbp_activity_recount_favorites( $response ) {

    global $wpdb;

    // Get all stored users
    $users = $wpdb->get_results( "SELECT {$wpdb->users}.ID FROM {$wpdb->users}" );

    foreach( $users as $user ) {

        // Get all favorites topics
        $favorites = bbp_get_user_favorites_topic_ids( $user->ID );

        if( $favorites ) {

            foreach( $favorites as $topic_id ) {
                // Trigger favorite action for each favorite topic
                gamipress_bbp_favorite_topic( $user->ID, $topic_id );
            }

        }

    }

    return $response;

}
add_filter( 'gamipress_activity_recount_bbp_favorites', 'gamipress_bbp_activity_recount_favorites' );