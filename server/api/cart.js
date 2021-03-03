const router = require('express').Router()
const {Cart, User, Product} = require('../db/models')

// We're in /api/carts/

// Get route to get a cart belonging to a user
router.get('/:userId', async (req, res, next) => {
  try {
    console.log('==========REQBODY==============', req.body)
    const cart = await User.findOne({
      where: {
        id: Number(req.params.userId)
      },
      include: [
        {
          model: Product
        }
      ]
    })
    res.json(cart)
  } catch (error) {
    next(error)
  }
})

// Put route to update quantity of a product inside a user's cart
router.put('/:userId/:productId', async (req, res, next) => {
  try {
    const cart = await Cart.update(req.body, {
      where: {
        userId: req.params.userId,
        productId: req.params.productId
      }
    })
    res.json(cart)
  } catch (error) {
    next(error)
  }
})

// Post route to add an item to cart.
router.post('/', async (req, res, next) => {
  console.log(`REQBODY`, req.body)
  try {
    console.log(req.body)
    const cart = await Cart.findOrCreate({
      where: req.body
    })
    console.log('CART', cart)
    if (cart[1]) {
      res.json(cart[0])
    } else {
      res.send('You already have this item in your cart')
    }
  } catch (err) {
    next(err)
  }
})

// Delete route to remove item from cart
router.delete('/:userId/:productId', async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      where: {
        userId: req.params.userId,
        productId: req.params.productId
      }
    })
    await cart.destroy()
    res.send(cart)
  } catch (error) {
    next(error)
  }
})

// Delete route to delete the entire cart
router.delete('/:userId', async (req, res, next) => {
  try {
    const cart = await Cart.findAll({
      where: {
        userId: req.params.userId
      }
    })
    cart.forEach(async singleCart => {
      await singleCart.destroy()
    })
    res.send(cart)
  } catch (error) {
    next(error)
  }
})

module.exports = router
