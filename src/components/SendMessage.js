import React, { Component } from 'react';
import styled from 'styled-components';
import { Icon, Input } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const CREATE_MESSAGE_MUTATION = gql`
  mutation CREATE_MESSAGE_MUTATION(
    $channelId: ID!
    $text: String
    $file: Upload
  ) {
    createMessage(channelId: $channelId, text: $text, file: $file)
  }
`;
const MessageWrapper = styled.div`
  grid-column: 3;
  display: grid;
  padding: 10px;
  grid-template-columns: 50px auto;
`;

const CustomFileUpload = styled.label`
  input[type='file'] {
    display: none;
  }
  cursor: pointer;
  padding: 10px;
  margin-right: 5px;
  &:hover {
    background-color: floralwhite;
  }
`;

class SendMessage extends Component {
  state = {
    message: '',
  };
  messageOnChangeHandler = e => {
    this.setState({ message: e.target.value });
  };
  handleSubmit = async (e, createMessage) => {
    e.preventDefault();
    if (this.state.message.trim().length > 0) {
      if (!(await createMessage())) {
        alert('Error Occurred');
      }
      this.setState({ message: '' });
    }
  };
  onChange = async (
    {
      target: {
        validity,
        files: [file],
      },
    },
    createMessage
  ) => {
    if (validity.valid) {
      console.log(file);
      console.log(createMessage);
      const response = await createMessage({
        variables: { file, channelId: this.props.channelId },
      });
      // console.log(response);
    }
  };
  render() {
    let { channelName, channelId } = this.props;
    return (
      <Mutation
        mutation={CREATE_MESSAGE_MUTATION}
        variables={{ channelId, text: this.state.message }}
      >
        {(createMessage, { loading, error }) => {
          if (error) return <p>Error occured</p> || console.log(error);

          return (
            <form onSubmit={e => this.handleSubmit(e, createMessage)}>
              <MessageWrapper>
                <CustomFileUpload>
                  <Icon name={'plus'} />
                  <input
                    type="file"
                    onChange={e => this.onChange(e, createMessage)}
                  />
                </CustomFileUpload>

                <Input
                  fluid
                  placeholder={`Message # ${channelName}`}
                  onChange={this.messageOnChangeHandler}
                  value={this.state.message}
                  disabled={loading}
                />
              </MessageWrapper>
            </form>
          );
        }}
      </Mutation>
    );
  }
}

SendMessage.propTypes = { channelName: PropTypes.any };

export default SendMessage;
