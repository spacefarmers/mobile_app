import React from "react";
import { Modal, Button, Center, Text, Switch, HStack, Box, InputGroup, Input, InputRightAddon, Alert, VStack, Checkbox } from "native-base";
import { getExpoToken, getFarmAlerts, getNotification, updateFarmAlerts, deleteFarmAlerts } from '../helpers/notifications'

const initialState = {
  loading: false,
  token: undefined,
  missingNotifications: false,
  removeFarm: false,
  showAlerts: false,
  farmTibAlert: undefined,
  farmDownAlert: undefined,
  farmAlertCheckboxes: []
};

export default class FarmOptionsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  async componentDidMount() {
    const token = await getExpoToken();
    this.setState({token});
    const notification_data = await getNotification(token);
    if (!notification_data.attributes.farm_alerts) {
      this.setState({ missingNotifications: true });
    }
    const alert_data = await getFarmAlerts(token, this.props.farmId);
    if (alert_data) {
      let checkboxes = []
      if (alert_data.attributes.block_alert)
        checkboxes.push('farmBlock');
      if (alert_data.attributes.payout_alert)
        checkboxes.push('farmPayout');
      this.setState({
        showAlerts: true,
        farmTibAlert: alert_data.attributes.size_alert && alert_data.attributes.size_alert.toString(),
        farmDownAlert: alert_data.attributes.farm_down_minutes && alert_data.attributes.farm_down_minutes.toString(),
        farmAlertCheckboxes: checkboxes,
      });
    }
  }

  render() {
    return (
      <Modal
        isOpen={this.props.showModal}
        onClose={() => this.props.setShowModal(false)}
      >
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Farm options</Modal.Header>
          <Modal.Body>
            <Box>
              <HStack alignItems="center" space={4} >
                <Switch size="md" value={this.state.showAlerts} onToggle={() => { this.setState({ showAlerts: !this.state.showAlerts })}} />
                <Text>Alerts</Text>
              </HStack>
              { this.state.showAlerts &&
                <Box>
                  { this.state.missingNotifications &&
                    <Alert w="100%" status="warning">
                      <VStack space={2} flexShrink={1} w="100%">
                        <HStack flexShrink={1} space={2} justifyContent="space-between">
                          <HStack space={2} flexShrink={1}>
                            <Text fontSize="md" color="coolGray.800">
                              Enable farm alerts on the notifications page to receive alerts
                            </Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    </Alert>
                  }
                  <Checkbox.Group onChange={value => this.setState({farmAlertCheckboxes: value})} value={this.state.farmAlertCheckboxes}>
                    <HStack alignItems="center" space={4} >
                      <Checkbox value="farmBlock" mt={2}>
                        Farm found block
                      </Checkbox>
                    </HStack>
                    <HStack alignItems="center" space={4} >
                      <Checkbox value="farmPayout" mb={2}>
                        Farm payout sent
                      </Checkbox>
                    </HStack>
                  </Checkbox.Group>
                  <Text>Alert when 24H farm size drops below:</Text>
                  <InputGroup>
                    <Input value={this.state.farmTibAlert} onChangeText={value => this.setState({farmTibAlert: value})} keyboardType="numeric" placeholder="--" />
                    <InputRightAddon children={"TiB"} />
                  </InputGroup>
                  <Text>Alert when lost contact for:</Text>
                  <InputGroup>
                    <Input value={this.state.farmDownAlert} onChangeText={value => this.setState({farmDownAlert: value})} keyboardType="numeric" placeholder="--" />
                    <InputRightAddon children={"minutes"} />
                  </InputGroup>
                </Box>
              }
              <HStack alignItems="center" space={4} >
                <Switch size="md" colorScheme="secondary" value={this.state.removeFarm} onToggle={() => { this.setState({ removeFarm: !this.state.removeFarm })}} />
                <Text>Remove from dashboard</Text>
              </HStack>
            </Box>
            <Center>
              <Button.Group space={2}>
                <Button
                  isLoading={this.state.loading}
                  colorScheme="blue"
                  onPress={() => {
                    this.setState({loading: true});
                    if (this.state.removeFarm) {
                      deleteFarmAlerts(this.state.token, this.props.farmId)
                        .then(() => {
                          this.props.removeFarm();
                          this.setState({loading: false});
                          this.props.setShowModal(false);
                        });
                    }
                    else if (this.state.showAlerts) {
                      updateFarmAlerts(this.state.token, this.props.farmId, {
                        size_alert: this.state.farmTibAlert,
                        farm_down_minutes: this.state.farmDownAlert,
                        block_alert: this.state.farmAlertCheckboxes.includes('farmBlock'),
                        payout_alert: this.state.farmAlertCheckboxes.includes('farmPayout'),
                      }).then(() => {
                        this.setState({loading: false});
                        this.props.setShowModal(false);
                      });
                    } else {
                      deleteFarmAlerts(this.state.token, this.props.farmId)
                        .then(() => {
                          this.setState({loading: false});
                          this.props.setShowModal(false);
                        });
                    }
                  }}
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
