import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Button, Icon } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

class FileUpload extends Component {
  onDrop = e => {
    console.log(e);
  };
  render() {
    return (
      <Dropzone onDrop={this.onDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => {
          return (
            <div {...getRootProps()} className="ignore">
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop files here...</p>
              ) : (
                <Button icon>
                  <Icon name={'plus'} />
                </Button>
              )}
            </div>
          );
        }}
      </Dropzone>
    );
  }
}

export default FileUpload;
