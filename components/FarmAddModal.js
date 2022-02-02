import React from "react";
import { Modal, FormControl, Input, Button } from "native-base";

const initialState = { loading: false, farmId: "", error: "" };

export default class FarmAddModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleChange = (value) => {
    this.setState({ farmId: value });
  };

  async addFarm() {
    this.setState({ loading: true, error: "" });
    if (this.state.farmId === "") {
      this.setState({ loading: false, error: "Please fill in a launcher ID" });
      return;
    }
    const response = await fetch(
      "https://spacefarmers.io/api/farmers/" + this.state.farmId
    );
    if (response.status === 200) {
      await this.props.addFarm(this.state.farmId);
      this.props.setShowModal(false);
      this.setState(initialState);
    } else if (response.status === 404) {
      this.setState({ loading: false, error: "Launcher ID not found" });
    } else {
      this.setState({ loading: false });
    }
  }

  closeModal = () => {
    this.setState(initialState);
    this.props.setShowModal(false);
  };

  render() {
    return (
      <Modal isOpen={this.props.showModal} onClose={() => this.closeModal()}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Add farm</Modal.Header>
          <Modal.Body>
            <FormControl isInvalid={this.state.error != ""}>
              <FormControl.Label>Launcher ID</FormControl.Label>
              <Input
                value={this.state.farmId}
                onChangeText={this.handleChange}
              />
              <FormControl.ErrorMessage>
                {this.state.error}
              </FormControl.ErrorMessage>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => this.closeModal()}
              >
                Cancel
              </Button>
              <Button
                isLoading={this.state.loading}
                colorScheme="blue"
                onPress={() => this.addFarm()}
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
