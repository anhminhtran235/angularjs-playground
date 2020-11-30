const express = require('express');
const cors = require('cors')
const emailService = require('./emails/emailService');
const EmailTracking = require('./Models/EmailTracking');
const port = 3000;
const {PROCESSED, DROPPED, DELIVERED, DEFERRED, BOUNCE, OPEN } = require('./emailEvents');
const db = require('./db/db');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/email/send', async (req, res) => {
  const {to} = req.body;
  emailService.sendEmail(to, (emailInfo) => {
    console.log('Email sent callback', emailInfo);
    const xMessageId = emailInfo[0].headers['x-message-id'];
    const newEmailTracking = new EmailTracking({xMessageId, timestamp: Date.now()});
    newEmailTracking.save();
    return res.send(emailInfo);
  }, err => {
    console.log(err);
    return res.send(err);
  })
});

app.post('/email/webhook', async (req, res) => {
    const newEvents = req.body;
    newEvents.forEach(emailEvent => {
      if (eventsOfInterest.includes(emailEvent.event)) {
        const {sg_message_id, sg_event_id, timestamp, event} = emailEvent;
        const xMessageId = sgMessageIdToXMessageId(sg_message_id);
        EmailTracking.findOne({xMessageId})
          .exec(async (err, emailTracking) => {
            if (err) {
              console.log(err);
            }
            if (emailTracking) {
              const newEmailEvent = {
                sgEventId: sg_event_id,
                eventType: event,
                timestamp
              }
              emailTracking.events.push(newEmailEvent);
              await emailTracking.save();
            }
        })
      }
    })
    res.status(200).send(); // Must send 2xx response to sendgrid
})

const eventsOfInterest = [
  PROCESSED, 
  DROPPED,
  DELIVERED,
  DEFERRED,
  BOUNCE,
  OPEN
]

const sgMessageIdToXMessageId = (sgMessageId) => {
  const index = sgMessageId.indexOf('.');
  if (index === -1) {
    throw new Error('Invalid sg_message_id');
  }
  const xMessageId = sgMessageId.substring(0, index);
  return xMessageId;
}

app.get('/email/tracking/:xMessageId', (req, res) => {
  const {xMessageId} = req.params;
  EmailTracking.findOne({xMessageId}, (err, emailTracking) => {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    if (emailTracking) {
      res.send(emailTracking);
    } else {
      res.send('No email data found');
    }
  })
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
