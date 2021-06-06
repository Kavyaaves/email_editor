const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const crypto = require('crypto');
const cookie = require('cookie');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const Shop = require('../models/shop.model.');
router.get('/', async function (req, res) {
	if (req.query.shop) {
		var shopP;
		try {
			const shortShop = req.query.shop
				.replace('https://', '')
				.replace('http://', '')
				.split('.')[0];
		} catch (error) {}
		if (shopP && shopP.isInstalled) {
			try {
				req.session.store = shopP.shop;
				req.session.save(function (err) {
					res.redirect(`http://localhost:3000/${shopP.shop}`);
				});
			} catch (error) {}
		}
		const shop = req.query.shop;
		const api_key = process.env.SHOPIFY_API_KEY;
		const scopes = 'read_content,write_content';
		const redirect_uri = `http://localhost:5000/auth/callback`;
		const nonce = uuidv4();
		const access_mode = 'per-user';
		res.cookie('state', nonce, { path: `/` });
		res.redirect(
			`https://${shop}/admin/oauth/authorize?client_id=${api_key}&scope=${scopes}&redirect_uri=${redirect_uri}&state=${nonce}&grant_options[]=${access_mode}`
		);
	}
});

router.get('/home', function (req, res) {
	res.json({ return: 'returned' });
});

router.get('/auth/callback', async function (req, res) {
	//hmac, code, shop, host, state, timestamp
	const { state, hmac, code, shop, host, timestamp } = req.query;
	const stateCookie = cookie.parse(req.headers.cookie).state;
	if (state !== stateCookie) {
		return res.status(403).send('Request origin cannot be verified');
	}

	const queryMap = Object.assign({}, req.query);
	delete queryMap['hmac'];

	const message = querystring.stringify(queryMap);
	const providedHmac = Buffer.from(hmac, 'utf-8');
	const generatedHash = Buffer.from(
		crypto
			.createHmac('sha256', process.env.SHOPIFY_API_SECRET)
			.update(message)
			.digest('hex'),
		'utf-8'
	);

	let hashEquals = false;

	try {
		hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
	} catch (e) {
		hashEquals = false;
	}

	if (!hashEquals) {
		return res.status(400).send('HMAC validation failed');
	}

	try {
		const accessTokenRequestUrl =
			'https://' + shop + '/admin/oauth/access_token';
		const accessTokenPayload = {
			client_id: process.env.SHOPIFY_API_KEY,
			client_secret: process.env.SHOPIFY_API_SECRET,
			code,
		};
		const response = await axios
			.post(accessTokenRequestUrl, accessTokenPayload)
			.then(async (accessTokenResponse) => {
				return await accessTokenResponse;
			});
		const accessToken = response.data.access_token;
		const shortShop = shop
			.replace('https://', '')
			.replace('http://', '')
			.split('.')[0];
		const doc = await Shop.findOne({ shop: shortShop });
		if (doc !== null) {
			Shop.findOneAndUpdate(
				{ shop: shortShop },
				{
					_id: uuidv4(),
					shop: shortShop,
					nonce: stateCookie,
					installedOn: Date.now(),
					isInstalled: true,
					templates: [],
					accessToken: response.data.access_token,
					scopes: response.data.scope,
				}
			);
			req.session.store = shortShop;
			req.session.save(function (err) {
				// session saved
				res.redirect(`http://localhost:3000/${shortShop}`);
			});
		} else {
			Shop.create({
				_id: uuidv4(),
				shop: shortShop,
				nonce: stateCookie,
				installedOn: Date.now(),
				isInstalled: true,
				templates: [],
				accessToken: response.data.access_token,
				scopes: response.data.scope,
			});
			req.session.store = shortShop;
			req.session.save(function (err) {
				// session saved
				res.redirect(`http://localhost:3000/${shortShop}`);
			});
		}
	} catch (err) {
		res.redirect('http://localhost:3000/');
	}
});

module.exports = router;
