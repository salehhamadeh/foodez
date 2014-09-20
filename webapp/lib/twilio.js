if (Meteor.isServer) {
	Twilio = Twilio(Meteor.settings["TWILIO_SID"], Meteor.settings["TWILIO_AUTH_TOKEN"]);
}