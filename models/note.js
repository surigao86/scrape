'use strict';

const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({

	title: {
		type: String,
		min: [1]
	},
	body: {
		type: String
	},
	createdAt: { 
		type: Date, 
		default: Date.now 
	}
});

module.exports = mongoose.model('Notes', noteSchema);