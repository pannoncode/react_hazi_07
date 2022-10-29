import Card from "../UI/Card";
import classes from "./SucOrder.module.css";

const SucOrder = (props) => {
  const validValue = props.onValid;

  return (
    <Card>
      {validValue ? (
        <p className={classes.valid}>Sikeres rendelés</p>
      ) : (
        <p className={classes.invalid}>Sikertelen rendelés</p>
      )}
      <button className={classes.submit} onClick={props.onCancel}>
        Cancel
      </button>
    </Card>
  );
};

export default SucOrder;
