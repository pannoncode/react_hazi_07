import { Fragment, useContext, useRef, useState } from "react";
import CartContext from "../../store/cart-context";
import SucOrder from "../Order/SucOrder";
import classes from "./Checkout.module.css";
import useHttp from "../../hooks/use-http";
import Modal from "../UI/Modal";

const isEmpty = (value) => value.trim() === "";
const isNull = (value) => value.trim() >= 5;

const Checkout = (props) => {
  const cartCtx = useContext(CartContext);
  const [isSubmit, setIsSubmit] = useState(false);
  const { sendRequest } = useHttp();
  const [formInputValues, setFormInputValues] = useState({
    name: true,
    street: true,
    city: true,
    postalCode: true,
  });
  const [validForm, setValidForm] = useState(true);

  const nameInputRef = useRef();
  const streetInputRef = useRef();
  const cityInputRef = useRef();
  const postalCodeInputRef = useRef();

  const confirmHandler = (event) => {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredStreet = streetInputRef.current.value;
    const enteredCity = cityInputRef.current.value;
    const enteredPostalcode = postalCodeInputRef.current.value;

    const enteredNameisValid = !isEmpty(enteredName);
    const enteredStreetIsValid = !isEmpty(enteredStreet);
    const enteredCityisValid = !isEmpty(enteredCity);
    const enteredPostalcodeIsValid = isNull(enteredPostalcode);

    setFormInputValues({
      name: enteredNameisValid,
      street: enteredStreetIsValid,
      city: enteredCityisValid,
      postalCode: enteredPostalcodeIsValid,
    });

    const formIsValid =
      enteredNameisValid &&
      enteredStreetIsValid &&
      enteredCityisValid &&
      enteredPostalcodeIsValid;

    if (!formIsValid) {
      setValidForm(false);
      return;
    }

    let cartItems = [];
    for (const key of cartCtx.items) {
      cartItems.push({
        id: key.id,
        name: key.name,
        amount: key.amount,
        price: key.price,
      });
    }

    if (!validForm) {
      return;
    }
    sendRequest({
      url: "https://foodproject-3be58-default-rtdb.europe-west1.firebasedatabase.app/orders.json",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        ordered: {
          id: Math.random(),
          name: enteredName,
          city: enteredCity,
          street: enteredStreet,
          postalCode: enteredPostalcode,
        },
        cart: cartItems,
      },
    });

    nameInputRef.current.value = "";
    streetInputRef.current.value = "";
    cityInputRef.current.value = "";
    postalCodeInputRef.current.value = "";
  };

  const submitHandler = () => {
    setIsSubmit(true);
  };

  return (
    <Fragment>
      <form className={classes.form} onSubmit={confirmHandler}>
        <div
          className={`${classes.control} ${
            formInputValues.name ? "" : classes.invalid
          }`}
        >
          <label htmlFor="name">Your Name</label>
          <input type="text" id="name" ref={nameInputRef} />
          {!formInputValues.name && <p>Please enter a valid name</p>}
        </div>
        <div
          className={`${classes.control} ${
            formInputValues.city ? "" : classes.invalid
          }`}
        >
          <label htmlFor="city">Your City</label>
          <input type="text" id="city" ref={cityInputRef} />
          {!formInputValues.city && <p>Please enter a valid city</p>}
        </div>

        <div
          className={`${classes.control} ${
            formInputValues.street ? "" : classes.invalid
          }`}
        >
          <label htmlFor="street">Your Street</label>
          <input type="text" id="street" ref={streetInputRef} />
          {!formInputValues.street && <p>Please enter a valid street</p>}
        </div>

        <div
          className={`${classes.control} ${
            formInputValues.postalCode ? "" : classes.invalid
          }`}
        >
          <label htmlFor="postal">Your PostalCode</label>
          <input type="text" id="postal" ref={postalCodeInputRef} />
          {!formInputValues.postalCode && (
            <p>Please enter a valid PostalCode</p>
          )}
        </div>
        <div className={classes.actions}>
          <button type="button" onClick={props.onCancel}>
            Cancel
          </button>

          <button
            type="submit"
            className={classes.submit}
            onClick={submitHandler}
          >
            Submit
          </button>
        </div>
      </form>
      {isSubmit && (
        <Modal>
          {validForm && <SucOrder onValid={true} onCancel={props.onCancel} />}
          {!validForm && <SucOrder onValid={false} onCancel={props.onCancel} />}
        </Modal>
      )}
    </Fragment>
  );
};

export default Checkout;
