import React from 'react'
import {connect} from 'react-redux'
import {getItemThunk} from '../store/singleProduct'
import {addToCartThunk} from '../store/cart'
import {toGuestCartThunk} from '../store/guestCart'

class SingleItem extends React.Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(userID, itemID, entireItem) {
    if (userID) {
      this.props.addToCart(userID, itemID, 1)
    }
    if (!userID) {
      this.props.toGuestCart(entireItem)
    }
  }

  componentDidMount() {
    this.props.loadItem(this.props.match.params.id)
  }
  render() {
    const stars = [1, 2, 3, 4, 5]
    const item = this.props.item || {}
    const name = item.name || ''
    const rating = item.rating || 0
    const imageUrl = item.imageUrl || 'default.png'
    const description = item.description || 'No description available'
    const userID = this.props.user.id
    const prodID = Number(this.props.match.params.id)

    return (
      <div>
        <h3> {name} </h3>
        <h4>
          {' '}
          Rating:{' '}
          {stars.slice(0, rating).map(star => {
            return <>⭐ </>
          })}
        </h4>
        <img src={imageUrl} />
        <p>{description} </p>
        <button
          onClick={() => this.handleClick(userID, prodID, this.props.item)}
        >
          Add To Cart{' '}
        </button>
      </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user,
    item: state.singleProduct
  }
}

const mapDispatch = dispatch => {
  return {
    loadItem: itemID => dispatch(getItemThunk(itemID)),
    addToCart: (userID, prodID, quant) =>
      dispatch(addToCartThunk(userID, prodID, quant)),
    toGuestCart: newItem => dispatch(toGuestCartThunk(newItem))
  }
}

export default connect(mapState, mapDispatch)(SingleItem)
