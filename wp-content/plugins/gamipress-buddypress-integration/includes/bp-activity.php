<?php
/**
 * BuddyPress Activity
 *
 * @package GamiPress\BuddyPress\BuddyPress_Activity
 * @since 1.0.1
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Register custom meta boxes
 *
 * @since  1.0.1
 */
function gamipress_bp_activity_meta_boxes() {

    // Start with an underscore to hide fields from custom fields list
    $prefix = '_gamipress_bp_';

    // Achievement Type
    new_cmb2_box( array(
        'id'           	=> 'bp-activity-achievement-type-data',
        'title'        	=> __( 'BuddyPress Member Activity', 'gamipress-buddypress-integration' ),
        'object_types' 	=> array( 'achievement-type' ),
        'context'      	=> 'normal',
        'priority'     	=> 'default',
        'fields' 		=> apply_filters( 'gamipress_bp_activity_achievement_type_data_meta_box_fields', array(
            array(
                'name' => __( 'Create activity entries', 'gamipress-buddypress-integration' ),
                'desc' => ' '.__( 'When an user earns an achievement of this type create an activity entry on their profile.', 'gamipress-buddypress-integration' ),
                'id'   => $prefix . 'create_bp_activity',
                'type' => 'checkbox',
                'classes' => 'gamipress-switch'
            ),
        ), $prefix )
    ) );

}
add_action( 'cmb2_admin_init', 'gamipress_bp_activity_meta_boxes' );

/**
 * Create BuddyPress Activity when a user earns an achievement.
 *
 * @param int       $user_id
 * @param int       $achievement_id
 * @param string    $trigger_type
 * @param int       $site_id
 * @param array     $args
 *
 * @since 1.0.1
 */
function gamipress_award_achievement_bp_activity( $user_id, $achievement_id, $trigger_type, $site_id, $args ) {

    if ( ! $user_id || ! $achievement_id ) {
        return;
    }

    $post = get_post( $achievement_id );
    $post_type = $post->post_type;

    // Don't make activity posts for not achievements
    if ( ! gamipress_is_achievement( $post ) ) {
        return;
    }

    // Check if create activity option is enabled
    $achievement_types = gamipress_get_achievement_types();
    $can_bp_activity = get_post_meta( $achievement_types[$post_type]['ID'], '_gamipress_bp_create_bp_activity', true );

    if ( ! $can_bp_activity ) {
        return;
    }

    // Grab the singular name for our achievement type
    $post_type_singular_name = strtolower( get_post_type_object( $post_type )->labels->singular_name );

    // Setup our entry content
    $content = '<div id="gamipress-achievement-' . $achievement_id . '" class="gamipress-achievement user-has-earned">';
    $content .= '<div class="gamipress-achievement-image"><a href="'. get_permalink( $achievement_id ) . '">' . gamipress_get_achievement_post_thumbnail( $achievement_id ) . '</a></div>';
    $content .= '<div class="gamipress-achievement-description">' . wpautop( $post->post_excerpt ) . '</div>';
    $content .= '</div>';

    // Bypass checking our activity items from moderation, as we know we are legit.
    add_filter( 'bp_bypass_check_for_moderation', '__return_true' );

    // Insert the activity
    bp_activity_add( apply_filters( 'gamipress_award_achievement_bp_activity_details',
        array(
            'action'       => sprintf( __( '%1$s earned the %2$s: %3$s', 'gamipress-buddypress-integration' ), bp_core_get_userlink( $user_id ), $post_type_singular_name, '<a href="' . get_permalink( $achievement_id ) . '">' . $post->post_title . '</a>' ),
            'content'      => $content,
            'component'    => 'gamipress',
            'type'         => 'activity_update',
            'primary_link' => get_permalink( $achievement_id ),
            'user_id'      => $user_id,
            'item_id'      => $achievement_id,
        ),
        $user_id,
        $achievement_id,
        $trigger_type,
        $site_id,
        $args
    ) );

}
add_action( 'gamipress_award_achievement', 'gamipress_award_achievement_bp_activity', 10, 5 );

/**
 * Filter activity allowed html tags to allow divs with classes and ids.
 *
 * @since 1.0.1
 */
function gamipress_bp_activity_allowed_tags( $activity_allowedtags ) {

    $activity_allowedtags['div'] = array();
    $activity_allowedtags['div']['id'] = array();
    $activity_allowedtags['div']['class'] = array();

    return $activity_allowedtags;

}
add_filter( 'bp_activity_allowed_tags', 'gamipress_bp_activity_allowed_tags' );
