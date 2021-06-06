const express = require('express');
const router = express.Router();
const Shop = require('../models/shop.model.');

router.post('/save/:shop', async (req, res) => {
	const shop = req.params.shop;
	const { html, json, name } = req.body;
	const present = await Shop.exists({ shop, 'templates.name': name });
	if (present === false) {
		Shop.updateOne(
			{ shop },
			{ $push: { templates: [{ name, html, json }] } },
			(err, docs) => {
				if (err) alert('Error');
			}
		);
		res.json({ success: 'success' });
	} else {
		Shop.updateOne(
			{ shop, 'templates.name': name },
			{
				$set: {
					'templates.$.name': name,
					'templates.$.json': json,
					'templates.$.html': html,
				},
			},
			(err, docs) => {
				if (err) alert('Error');
			}
		);
		res.json({ success: 'success' });
	}
});

router.get('/:shop', async function (req, res) {
	const docs = await Shop.find({ shop: req.params.shop });
	if (docs[0].templates) res.status(200).json(docs[0].templates);
	else return res.json({ error: 'error' });
});

router.post('/delete/:name', async function (req, res) {
	Shop.updateOne(
		{ shop: req.body.shop, 'templates.name': req.body.template },
		{
			$pull: {
				templates: { name: req.body.template },
			},
		},
		(err, docs) => {
			if (docs.ok === '1') res.json({ status: 'ok' });
		}
	);
	res.json({ status: 'deleted' });
});

module.exports = router;
