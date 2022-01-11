import React from 'react';
import {
  Modal,
  FormControl,
  Input,
  Button,
} from "native-base";

const initialState = { loading: false, farmId: "" };

export default class FarmAddModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleChange = (value) => {
    this.setState({farmId: value});
  }

  async addFarm() {
    if (this.state.farmId === "")
      return;
    this.setState({ loading: true });
    const response = await fetch('https://spacefarmers.io/api/farmers/' + this.state.farmId);
    if (response.status === 200) {
      this.props.addFarm(this.state.farmId);
      this.props.setShowModal(false);
      this.setState(initialState);
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    return(
      <Modal isOpen={this.props.showFarmAddModal} onClose={() => this.props.setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Add farm</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Launcher ID</FormControl.Label>
              <Input value={this.state.farmId} onChangeText={this.handleChange} />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
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
                onPress={() => {
                  this.addFarm();
                }}
              >
                Add
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    );
  }
}
