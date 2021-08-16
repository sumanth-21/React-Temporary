import React, { Component } from 'react';
import { connect } from 'react-redux';

import Booking from '../../components/Booking/Booking';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Bookings extends Component {
    componentDidMount () {
        this.props.onFetchBookings(this.props.token, this.props.userId);
    }

    render () {
        let bookings = <Spinner />;
        if ( !this.props.loading ) {
            bookings = this.props.bookings.map( (order,index) => (
                <Booking
                    key={order.id}
                    capacity={order.orderData.tableCapacity}
                    timeSlot={order.orderData.timeSlot}
                    confirmOrder= {index === this.props.bookings.length-1 ? this.props.bookingConfirm : true}
                    cancelOrder= {() => this.props.onCancelBooking(order.id, this.props.token)} />
            ) )
            bookings.reverse();
        }
        return (
            <div>
                {bookings}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        bookings: state.reservation.bookings,
        loading: state.reservation.loading,
        bookingConfirm: state.reservation.bookingConfirm,
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchBookings: (token, userId) => dispatch( actions.fetchBookings(token, userId) ),
        onCancelBooking: (id, token) => dispatch( actions.cancelBooking(id, token) )
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( withErrorHandler( Bookings, axios ) );