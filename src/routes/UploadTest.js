import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import React from 'react';
export const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!) {
    uploadFile(file: $file)
  }
`;

const UploadOneFile = () => {
  return (
    <Mutation mutation={UPLOAD_FILE}>
      {uploadFile => (
        <input
          type={'file'}
          onChange={async ({
            target: {
              validity,
              files: [file],
            },
          }) => {
            if (validity.valid) {
              console.log(file);
              const response = await uploadFile({ variables: { file } });
              console.log(response);
            }
          }}
        />
      )}
    </Mutation>
  );
};

export default UploadOneFile;
