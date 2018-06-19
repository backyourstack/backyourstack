import React from 'react';
import axios from 'axios';
import FormData from 'form-data';

export default class UploadPackage extends React.Component {
  handleUploadFile = (event) => {
    const data = new FormData();
    data.append('file', event.target.files[0]);
    axios.post('/files', data).then((response) => {
      console.log(response.data); // Logging
      if(response.data == "Uploaded")
        { alert("Package.JSON uploaded"); }
      else
        { alert("File type not supported! Upload package.JSON"); }  
    });
  }

    render() {
      return (
      <div>
           <input type="file" onChange={this.handleUploadFile} />
      </div>);
    }

}
