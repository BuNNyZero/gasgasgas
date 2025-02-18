// import logo from "./logo.svg";
import EmployeeContainer from "../Employee/EmployeeContainer";
import CustomerContainer from "../CustomerContainer/CustomerContainer";

function EmployeeCustomerContainer(props) {
    return (
        <> {props?.isAdmin ? (
            <EmployeeContainer {...props} />
        ) : (
            <CustomerContainer {...props} />
        )}
        </>
    );
}

export default EmployeeCustomerContainer;
