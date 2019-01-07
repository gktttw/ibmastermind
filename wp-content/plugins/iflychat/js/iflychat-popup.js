if(typeof(iflychat_chatcamp_check) === "undefined" || iflychat_chatcamp_check === "0") {
  var iflychat_popup=document.createElement("DIV");
  iflychat_popup.className="iflychat-popup";
  document.body.appendChild(iflychat_popup);
}
else if(iflychat_chatcamp_check === "1") {
  var iflychat_popup=document.createElement("DIV");
  iflychat_popup.id="cc-app";
  document.body.appendChild(iflychat_popup);
}