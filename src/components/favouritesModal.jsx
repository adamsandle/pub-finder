import React from "react";
import { Modal, Header, Icon, Button, Card } from "semantic-ui-react";

export default props => {
  return (
    <Modal open={props.open} onClose={props.handleClose} size="small">
      <Header icon="star" content="Favourites" />
      <Modal.Content>
        <Card.Group centered>
          {props.locations.map(item => {
            return (
              <Card key={item.id}>
                <Card.Content>
                  <Card.Header>{item.name}</Card.Header>
                  <Card.Meta>{item.distance}m</Card.Meta>
                </Card.Content>
                <Card.Content extra>
                  <div className="ui two buttons">
                    <Button
                      basic
                      color="green"
                      onClick={() => props.onSelect(item.id)}
                    >
                      Navigate
                    </Button>
                    <Button
                      basic
                      color="red"
                      onClick={() => props.onRemove(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={props.handleClose} inverted>
          <Icon name="checkmark" /> Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
