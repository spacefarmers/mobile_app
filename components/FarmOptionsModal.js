import React from 'react';
import {
  Modal,
  Button,
  Center
} from "native-base";

const initialState = { loading: false, farmId: "" };

export default class FarmOptionsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleChange = (value) => {
    this.setState({farmId: value});
  }

  render() {
    return(
      <Modal isOpen={this.props.showModal} onClose={() => this.props.setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Remove farm?</Modal.Header>
          <Modal.Body>
            <Center>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    this.props.setShowModal(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={this.state.loading}
                  colorScheme="blue"
                  onPress={this.props.removeFarm}
                >
                  Confirm
                </Button>
              </Button.Group>
            </Center>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    );
  }
}
