const { Schema } = require('mongoose')

module.exports = {
  // User Schema
  User: new Schema({
    _id: String,
    beatenGyms: { type: Array, default: [] },
    money: { type: Number, default: 0 },
    lastDaily: { type: Number, default: 0 },
    blacklisted: { type: Boolean, default: false },
    blacklistReason: String,
    blacklisterId: String,
    favColor: { type: String, default: process.env.EMBED_COLOR },
    rep: { type: Number, default: 0 },
    lastRep: { type: Number, default: 0 }
  }),

  // Guild Schema
  Guild: new Schema({
    _id: String,
    prefix: { type: String, default: process.env.PREFIX }
  })
}
