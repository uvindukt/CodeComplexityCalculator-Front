import React from 'react';
import Progress from './UploadProgress';
import {Container, Row, Col, FormGroup, FormText} from 'reactstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faFileUpload} from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import Alert from "./Alert";
import Table from "reactstrap/es/Table";

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cc: [],
            cp : 0,
            file: '',
            fileName: 'Choose File',
            uploadPercentage: 0,
            alert: false,
            alertText: null
        }
    }

    resetAlert = () => {
        this.setState({
            alert: false,
            alertText: null
        }, () => {
            this.setState({uploadPercentage: 0});
        });
    };

    onChange = event => {
        if (event.target.files[0]) {
            this.setState({
                file: event.target.files[0],
                fileName: event.target.files[0].name
            })
        }
    };

    onSubmit = async event => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', this.state.file);

        try {

            const res = await axios.post('http://localhost:8080/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => {
                    this.setState({
                        uploadPercentage: Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    });
                }
            });

            const packet = {
                method: "POST",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url: res.data.url
                })
            };

            this.setState({
                fileName: 'Choose File',
                alert: true,
                alertText: res.data.message
            }, () => {

                fetch('http://localhost:8080/api/cc', packet)
                    .then(response => response.json())
                    .then(result => this.setState({cc: result.cc, cp: result.cp}))
                    .catch(err => console.log(err));

            })

        } catch (err) {

            this.setState({
                fileName: 'Choose File',
                alert: true,
                alertText: err.message
            });
            console.log(err)

        }
    };

    render() {

        let alert = "";
        if (this.state.alert)
            alert = <Alert alertText={this.state.alertText} resetAlert={this.resetAlert}/>;

        console.log(this.state);

        return <Container>
            <Row>
                <Col md={12} className="text-center">
                    <h1 className="mt-5 mb-4 text-muted">
                        <FontAwesomeIcon icon={faCogs}/>&ensp;
                        Code Complexity Calculator
                    </h1>
                    <hr/>
                </Col>
            </Row>
            <Row>
                <Col md={12} className="mb-3">
                        <form onSubmit={this.onSubmit}>
                            <div className="comp pt-4 pb-3 p-2">
                                <div className="pr-4 pl-3">
                                    <div className='custom-file mb-5'>
                                        <FormGroup>
                                        <input
                                             type='file'
                                            className='custom-file-input'
                                            id='customFile'
                                            onChange={this.onChange}
                                        />
                                        <label className='custom-file-label' htmlFor='customFile'>
                                            {this.state.fileName}
                                        </label>
                                            <FormText>
                                                Select a file to scan.
                                            </FormText>
                                        </FormGroup>
                                    </div>
                                    <Progress percentage={this.state.uploadPercentage} />
                                    <div className="text-right">
                                        <button
                                            type='submit'
                                            className='button'
                                        ><FontAwesomeIcon icon={faFileUpload}/>&ensp;Upload</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                </Col>
                <Col md={12}>
                    <div className="comp pt-4 pb-3 p-2 mb-4">
                        <Table className="merchantTable text-center" striped borderless responsive>
                            <thead>
                            <tr>
                                <th>Line</th>
                                <th>CS</th>
                                <th>CTC</th>
                                <th>CNC</th>
                                <th>CI</th>
                                <th>CPS</th>
                                <th>TW</th>
                                <th>CR</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.cc.map(line =>
                                    <tr key={line.index}>
                                        <td className="text-left" style={{
                                            borderBottomLeftRadius: '0.5rem',
                                            borderTopLeftRadius: '0.5rem'
                                        }}>{line.text}</td>
                                        <td>{line.cs}</td>
                                        <td>{line.ctc}</td>
                                        <td>{line.cnc}</td>
                                        <td>{line.ci}</td>
                                        <td>{line.cps}</td>
                                        <td>{line.tw}</td>
                                        <td style={{
                                            borderBottomRightRadius: '0.5rem',
                                            borderTopRightRadius: '0.5rem'
                                        }}>{line.cr}</td>
                                    </tr>
                                )
                            }
                            <tr>
                                <td className="text-left" style={{
                                    borderBottomLeftRadius: '0.5rem',
                                    borderTopLeftRadius: '0.5rem'
                                }}><b>CP</b></td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td style={{
                                    borderBottomRightRadius: '0.5rem',
                                    borderTopRightRadius: '0.5rem'
                                }}>{this.state.cp}</td>
                            </tr>
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
            {alert}
        </Container>

    }

}