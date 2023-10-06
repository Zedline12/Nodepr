const { getallproducts } = require('./services')
module.exports = () => {
	getallproducts: async (req, res) => {
		try {
			const id = req.params.id
			const product = await getProduct(id)
			res.json(product)
		}
		catch (err) {
		res.status(500).send(err)
		}
	}

    getalltypes: async (req, res) => {
		try {
			const id = req.params.id
			const product = await getProduct(id)
			res.json(product)
		}
		catch (err) {
		res.status(500).send(err)
		}
	}

    getallavaoptions: async (req, res) => {
		try {
			const id = req.params.id
			const product = await getProduct(id)
			res.json(product)
		}
		catch (err) {
		res.status(500).send(err)
		}
	}
    getproductvariant: async (req, res) => {
		try {
			const id = req.params.id
			const product = await getProduct(id)
			res.json(product)
		}
		catch (err) {
		res.status(500).send(err)
		}
	}
    getproductwithid: async (req, res) => {
		try {
			const id = req.params.id
			const product = await getProduct(id)
			res.json(product)
		}
		catch (err) {
		res.status(500).send(err)
		}
	}
    postProduct: async  (req, res) => {
		try {
			const id = req.params.id
			const product = await getProduct(id)
			res.json(product)
		}
		catch (err) {
		res.status(500).send(err)
		}
	}
}
