Meals = new Meteor.Collection("meals");

//Allow anything in the database to be modified without a Meteor.call
Meals.allow({
  insert: function () {
      return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});