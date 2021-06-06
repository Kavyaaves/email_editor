const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = new Schema({
	_id: { type: String, required: true },
	shop: { type: String, required: true },
	accessToken: { type: String, default: null },
	scopes: { type: String, default: null },
	isInstalled: { type: Boolean, default: false },
	templates: [
		{
			name: { type: String, unique: true },
			html: { type: String },
			json: { type: JSON },
		},
	],

	installedOn: { type: Date, default: Date.now() },
	nonce: { type: String, default: null },
});

const Shop = mongoose.model('Shop', shopSchema);
module.exports = Shop;
