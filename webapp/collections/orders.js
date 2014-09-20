Orders = new Meteor.Collection("orders");

//Allow anything in the database to be modified without a Meteor.call
Orders.allow({
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