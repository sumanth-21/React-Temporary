import React, { Component } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {
    componentDidMount () {
        this.props.onFetchOrders(this.props.token, this.props.userId);
    }

    render () {
        let orders = <Spinner />;
        if ( !this.props.loading ) {
            orders = this.props.orders.map( (order,index) => (
                <Order
                    key={order.id}
                    ingredients={order.ingredients}
                    price={order.price}
                    confirmOrder= {index === this.props.orders.length-1 ? this.props.orderConfirm : true}
                    cancelOrder= {() => this.props.onCancelOrder(order.id, this.props.token)} />
            ) )
            orders.reverse();
        }
        return (
            <div>
                {orders}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        orderConfirm: state.order.orderConfirm,
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch( actions.fetchOrders(token, userId) ),
        onCancelOrder: (id, token) => dispatch( actions.cancelOrder(id, token) )
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler( Orders, axios ) );