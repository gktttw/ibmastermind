(function($){function gamipress_track_visit(user_id,post_id){if(user_id===0){return}
$.ajax({url:gamipress_events.ajaxurl,type:'POST',data:{action:'gamipress_track_visit',user_id:user_id,post_id:post_id},success:function(response){if(gamipress_events.debug_mode){console.log(response)}}}).fail(function(response){if(gamipress_events.debug_mode){console.log(response)}})}
$(document).ready(function(){var user_id=parseInt(gamipress_events.user_id);var post_id=parseInt(gamipress_events.post_id);gamipress_track_visit(user_id,post_id)})})(jQuery)