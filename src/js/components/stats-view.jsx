import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Col, Row} from 'react-bootstrap';
import {connect} from 'react-redux';
import {updateNetworkState} from '../redux/actions';


class StatsView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        const props = this.props;
        return (<Col md="12">
            <div className={'panel panel-filled'}>
                <div className={'panel-heading bordered'}>status
                </div>
                <div className={'panel-body'}>
                    {props.config.MODE_TEST_NETWORK && (<Row>
                        <Col className="pr-0"
                             style={{textAlign: 'left'}}>
                            <span>millix testnet</span>
                            <hr/>
                        </Col>
                    </Row>)}
                    {!!props.wallet.version_available && !(props.config.NODE_MILLIX_VERSION === props.wallet.version_available || props.config.NODE_MILLIX_VERSION !== (props.wallet.version_available + '-tangled')) &&
                     (<Row>
                         <Col style={{textAlign: 'right'}}>
                             <Button variant="outline-primary"
                                     onClick={() => {
                                     }}
                                     style={{
                                         fontSize: '75%',
                                         padding : 0,
                                         color   : '#ffadad'
                                     }}>new version
                                 available
                                 v.{props.wallet.version_available} !</Button>
                         </Col>
                     </Row>)}
                    <Row>
                        <Col>
                            <span>{props.network.node_is_public === 'unknown' ? 'analyzing your network connection' : props.network.node_is_public === true ? 'your node is public and is eligible to receive transaction fees' : 'your node is not public and is not eligible to receive transaction fees.  use port forwarding on your router to make your node public.'}</span>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            <span>event log
                                size: {props.log.size.toLocaleString('en-US')}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <span>backlog
                                size: {props.backlog.size.toLocaleString('en-US')}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <span>pending
                                transaction
                                count: {props.wallet.transaction_wallet_unstable_count.toLocaleString('en-US')}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <span>transaction
                                count: {props.wallet.transaction_count.toLocaleString('en-US')}</span>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            <span>node id: {props.network.node_id}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <span>node public
                                address: {props.network.node_public_ip.toLocaleString('en-US') + ':' + props.network.node_port}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <span>node bind
                                ip: {props.network.node_bind_ip.toLocaleString('en-US')}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <span>local network
                                addresses: {props.network.node_network_addresses.join(', ')}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="mb-3"
                             style={{textAlign: 'left'}}>
                            <a className={''}
                               onClick={() => props.history.push('/peers')}>
                                peers: {props.network.connections}
                            </a>
                        </Col>
                    </Row>
                </div>
            </div>
        </Col>);
    }
}


export default connect(
    state => ({
        clock  : state.clock,
        config : state.config,
        log    : state.log,
        network: state.network,
        wallet : state.wallet,
        backlog: state.backlog,
        node   : state.node
    }), {
        updateNetworkState
    })(withRouter(StatsView));
