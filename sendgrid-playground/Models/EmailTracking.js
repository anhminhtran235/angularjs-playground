const mongoose = require('mongoose');

const emailTrackingSchema = new mongoose.Schema({
  xMessageId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  events: [
   {
    sgEventId: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
   }
  ]
})

const EmailTracking = mongoose.model('EmailTracking', emailTrackingSchema);
module.exports = EmailTracking;