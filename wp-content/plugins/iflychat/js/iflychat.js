var iflychat_bundle = document.createElement("SCRIPT");
if(iflychat_chatcamp_check === "0") {
  iflychat_bundle.src = "//"+iflychat_external_cdn_host+"/js/iflychat-v2.min.js?app_id="+iflychat_app_id;
  iflychat_bundle.async="async";
  document.body.appendChild(iflychat_bundle);
}
else if(iflychat_chatcamp_check === "1") {
  iflychat_bundle.src = "//"+iflychat_external_cdn_host+"/js/chatcamp-ui.min.js";
  iflychat_bundle.async="async";
  document.body.appendChild(iflychat_bundle);
  jQuery(document).ready(function($) {
    var data = {
      'action': 'iflychat-get'
    };
    jQuery.post(iflychat_auth_url, data, function(response) {
      console.log("RE", response);
      // Initialize ChatCamp
      window.ChatCampUi.init({
        appId: iflychat_app_id, 
        user: {
          id: response.user.id,
          accessToken: response.user.access_token // optional
        }, 
        ui: {
          theme: {
            primaryBackground: "#3f45ad",
            primaryText: "#ffffff",
            secondaryBackground: "#ffffff",
            secondaryText: "#000000",
            tertiaryBackground: "#f4f7f9",
            tertiaryText: "#263238"
          },
          roster: {
            tabs: ['recent', 'rooms', 'users'], 
            render: true, 
            defaultMode: 'open', // other possible values are minimize, hidden
            showUserAvatarUpload: true
          },
          channel: {
            showAttachFile: true,
            showVideoCall: true,
            showVoiceRecording: true
          }
        }
      })
    });
  });
}