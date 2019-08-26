import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs } from "@fortawesome/free-solid-svg-icons";

class Alert extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: true
        };
    }

    toggle = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    };

    render() {

        const { alertText, resetAlert } = this.props;

        return <Modal fade={true} isOpen={this.state.modal} toggle={() => {this.toggle();resetAlert();}}
                      className="modalAlert">
            <ModalHeader toggle={() => {this.toggle();resetAlert();}} charCode="⨉">
                <div className="navbar-brand">
                    Code Complexity Calculator&ensp;
                    <FontAwesomeIcon
                        icon={faCogs}
                    />
                </div>
            </ModalHeader>
            <ModalBody>
                {alertText}
            </ModalBody>
            <ModalFooter>
                <Button className="button my-0 py-1" onClick={() => {this.toggle();resetAlert();}}>OK</Button>
            </ModalFooter>
        </Modal>;
    }

}

export default Alert;