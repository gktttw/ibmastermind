=== GamiPress - BuddyPress integration ===
Contributors: gamipress, tsunoa, rubengc, eneribs
Tags: gamipress, gamification, gamify, point, achievement, badge, award, reward, credit, engagement, ajax, buddypress, bp, social networking, activity, profile, messaging, friend, group, forum, notification, settings, social, community, network, networking
Requires at least: 4.4
Tested up to: 4.9
Stable tag: 1.2.5
License: GNU AGPLv3
License URI:  http://www.gnu.org/licenses/agpl-3.0.html

Connect GamiPress with BuddyPress

== Description ==

Gamify your [BuddyPress](http://wordpress.org/plugins/buddypress/ "BuddyPress") community thanks to the powerful gamification plugin, [GamiPress](https://wordpress.org/plugins/gamipress/ "GamiPress")!

This plugin automatically connects GamiPress with BuddyPress adding new activity events and features.

= New Events =

* Account activation: When an user account get activated.
* Profile updates: When an user changes their profile information (avatar, cover image and/or just the profile information).
* Send friendship request: When an user request to another to become friends.
* Accept friendship requests: When an user accepts the friendship request from another one.
* Send/Reply private messages: When an user sends or replies to private messages.
* Activity stream messages: When an user publish new activity stream messages.
* Reply activity stream messages: When an user replies to an activity stream message.
* Favorite activity stream messages: When an user favorites an activity stream message.
* Get a favorite on an activity stream item: When an user gets a new favorite on an activity stream message.
* Group activity stream messages: When a group publish new activity stream messages.
* Create a group: When an user creates a new group.
* Join a group: When an user joins a group.
* Join a specific group: When an user joins a specific group.
* Get accepted on a private group: When an user gets accepted on a private group.
* Get accepted on a specific private group: When an user gets accepted on a specific private group.
* Group invitations: When an user invites someone to join a group.
* Group promotions: When an user get promoted or promotes another one as group moderator/administrator.

= New Features =

* Drag and drop settings to select which points types, achievement types and/or rank types should be displayed on user frontend profiles and in what order.
* Setting to select which achievement types should be displayed in activity streams.

There are more add-ons that improves your experience with GamiPress and BuddyPress:

* [BuddyPress Group Leaderboard](https://wordpress.org/plugins/gamipress-buddypress-group-leaderboard/)

== Installation ==

= From WordPress backend =

1. Navigate to Plugins -> Add new.
2. Click the button "Upload Plugin" next to "Add plugins" title.
3. Upload the downloaded zip file and activate it.

= Direct upload =

1. Upload the downloaded zip file into your `wp-content/plugins/` folder.
2. Unzip the uploaded zip file.
3. Navigate to Plugins menu on your WordPress admin area.
4. Activate this plugin.

== Frequently Asked Questions ==

== Screenshots ==

1. Show user points, achievements and ranks on frontend profile

== Changelog ==

= 1.2.5 =

* Prevent to show duplicated achievements at top of user profile.

= 1.2.4 =

* New event: Get a favorite on an activity stream item

= 1.2.3 =

* Fixed undefined index notice when registering new BuddyPress activities.

= 1.2.2 =

* Fixed typo on a settings field description.
* Improved settings placement.

= 1.2.1 =

* Fixed wrong group name on requirements.
* Updated deprecated WordPress functions.

= 1.2.0 =

* Improvements on multisite functionalities.
* Added stronger checks on settings to prevent display removed or renamed points types, achievement types and rank types.
* Moved old changelog to changelog.txt file.
