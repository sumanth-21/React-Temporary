import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Manager.css';
import Aux from '../../hoc/Wrap/Aux';
import Booking from '../../components/Booking/Booking';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import Input from '../../components/UI/Input/Input';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index';

class Manager extends Component {
    state = {
        orderForm: {
            tableCapacity: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'select', displayValue: 'Select Capacity'},
                        {value: '2', displayValue: '2'},
                        {value: '4', displayValue: '4'},
                        {value: '6', displayValue: '6'}
                    ]
                },
                value: 'select',
                validation: {},
                valid: true
            },
            timeSlot: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'select', displayValue: 'Select TimeSlot'},
                        {value: 'morning', displayValue: 'morning'},
                        {value: 'afternoon', displayValue: 'afternoon'},
                        {value: 'evening', displayValue: 'evening'},
                    ]
                },
                value: 'fastest',
                validation: {},
                valid: true
            }
        },
        formIsValid: false
    }

    
    componentDidMount () {
        this.props.onFetchAllOrders(this.props.token);
        this.props.onFetchAllBookings(this.props.token);
    }

    orderHandler = ( event ) => {
        event.preventDefault();
  
        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        this.props.onAddTable(formData.tableCapacity, formData.timeSlot, this.props.tables);
    }


    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = { 
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        
        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
    }

    render () {
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>Add Table</Button>
            </form>
        );
        if ( this.props.loading ) {
            form = <Spinner />;
        }
        const purchasedRedirect = this.props.purchased ? <Redirect to="/"/> : null;

        let orders = <Spinner />;
        if ( !this.props.loading ) {
            orders = this.props.orders.map( (order,index) => (
                <Order
                    key={order.id}
                    ingredients={order.ingredients}
                    price={order.price} />
            ) )
            orders.reverse();
        }

        let bookings = <Spinner />;
        if ( !this.props.loading ) {
            bookings = this.props.bookings.map( (order,index) => (
                <Booking
                    key={order.id}
                    capacity={order.orderData.tableCapacity}
                    timeSlot={order.orderData.timeSlot} />
            ) )
            bookings.reverse();
        }

        return (
            <Aux>
                <div className={classes.Manager}>
                    {purchasedRedirect}
                    <h4>Enter details of Table to be added</h4>
                    {form}
                </div>
                <div className={classes.List}>
                    <div>
                        <h2>Orders:</h2>
                        {orders}
                    </div>
                    <div>
                        <h2>Table bookings:</h2>
                        {bookings}
                    </div>
                </div>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        tables: state.reservation.tables,
        capacity: state.reservation.capacity,
        slots: state.reservation.slots,
        orders: state.manager.allOrders,
        bookings: state.manager.allBookings,
        loading: state.manager.loading,
        purchased: state.reservation.purchased,
        userId: state.auth.userId,
        token: state.auth.token
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onAddTable: (capacity, token, tables) => dispatch(actions.addTable(capacity, token, tables)),
        onFetchAllOrders: (token) => dispatch(actions.fetchAllOrders(token)),
        onFetchAllBookings: (token) => dispatch(actions.fetchAllBookings(token))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Manager, axios));