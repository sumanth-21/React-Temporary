import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Reservation.css';
import axios from '../../axios-orders';
import Input from '../../components/UI/Input/Input';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index';

class Reservation extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            contact: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Contact Number'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 10,
                    maxLength: 10,
                    isNumeric: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            tableCapacity: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'select', displayValue: 'Select Capacity'}
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
                        {value: 'select', displayValue: 'Select TimeSlot'}
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
        this.props.onFetchTables();
    }

    componentDidUpdate (prevProps) {
        if(prevProps.capacity !== this.props.capacity){ 
            const {orderForm} = this.state;
                this.setState({
                    orderForm: { 
                        ...orderForm,
                        tableCapacity: {
                            ...orderForm.tableCapacity,
                            elementConfig: {
                                ...orderForm.tableCapacity.elementConfig,
                                options: this.props.capacity
                            }
                        }
                    }
                });
        }
        if(prevProps.slots !== this.props.slots){ 
            const {orderForm} = this.state;
                this.setState({
                    orderForm: { 
                        ...orderForm,
                        timeSlot: {
                            ...orderForm.timeSlot,
                            elementConfig: {
                                ...orderForm.timeSlot.elementConfig,
                                options: this.props.slots
                            }
                        }
                    }
                });
        }
    }

    orderHandler = ( event ) => {
        event.preventDefault();
  
        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            orderData: formData,
            userId: this.props.userId
        }
        this.props.onOrderTable(order, this.props.token, this.props.tables);
        
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        if(inputIdentifier === "tableCapacity") {
            this.props.onFetchSlots(event.target.value, this.props.tables)
        }
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = { 
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
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
                <Button btnType="Success" disabled={!this.state.formIsValid}>BOOK TABLE</Button>
            </form>
        );
        if ( this.props.loading ) {
            form = <Spinner />;
        }
        if(this.props.purchased ) {
            alert("Table Reserved Successfully");
            this.props.onOrderTableInit();
        }
        const purchasedRedirect = this.props.purchased ? <Redirect to="/"/> : null;
        return (
            <div className={classes.Reservation}>
                {purchasedRedirect}
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        tables: state.reservation.tables,
        capacity: state.reservation.capacity,
        slots: state.reservation.slots,
        loading: state.reservation.loading,
        purchased: state.reservation.purchased,
        userId: state.auth.userId,
        token: state.auth.token
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderTable: (orderData, token, tables) => dispatch(actions.bookTable(orderData, token, tables)),
        onOrderTableInit: () => dispatch(actions.bookTableInit()),
        onFetchTables: () => dispatch(actions.fetchTables()),
        onFetchSlots: (capacity, tables) => dispatch(actions.fetchSlots(capacity, tables))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Reservation, axios));