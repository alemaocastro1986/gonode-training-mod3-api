const Ad = require('../models/Ad')

class AdController {
  async index (req, res) {
    const filters = {
      purchasedBy: null
    }

    if (req.query.price_min || req.query.price_max) {
      filters.price = {}

      if (req.query.price_min) {
        filters.price.$gte = req.query.price_min
      }
      if (req.query.price_max) {
        filters.price.$lte = req.query.price_max
      }
    }

    if (req.query.title) {
      filters.title = new RegExp(req.query.title, 'i')
    }

    const ads = await Ad.paginate(filters, {
      page: req.query.page || 1,
      limit: 20,
      populate: 'author',
      sort: '-createdAt'
    })

    return res.status(200).json(ads)
  }

  async show (req, res) {
    const ad = await Ad.findById(req.params.id)

    return res.status(200).json(ad)
  }

  async store (req, res) {
    const ad = await Ad.create({ ...req.body, author: req.userId })

    return res.status(201).json(ad)
  }

  async update (req, res) {
    const ad = await Ad.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true
    })

    return res.status(200).json(ad)
  }

  async destroy (req, res) {
    await Ad.findOneAndDelete({ _id: req.params.id })

    return res.status(204).send()
  }
}

module.exports = new AdController()
