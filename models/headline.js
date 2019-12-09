'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const headlineSchema = mongoose.Schema({

	link: {
		type: String,
		min: [1],
		required: true
	},
	headline: {
		type: String,
		min: [1],
		required: true
	},
	summary: {
		type: String,
		default: 'No summary available'
	},
	img: {
		type: String
	},
	saved: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: String,
		default: Date.now 
	},
	// this is for a toggle like save, use array for multiple comments
  comments: { 
    type: Schema.Types.ObjectId, 
    ref: 'Notes' 
  }
});

module.exports = mongoose.model('Headline', headlineSchema);