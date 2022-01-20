import React, {Component} from 'react';
import SideNav, {NavItem, NavText} from '@trendmicro/react-sidenav';
import {connect} from 'react-redux';
import {lockWallet} from '../redux/actions/index';
import moment from 'moment';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';


class Sidebar extends Component {
    constructor(props) {
        super(props);
        let now            = Date.now();
        this.state         = {
            fileKeyExport: 'export_' + now,
            fileKeyImport: 'import_' + now,
            date         : new Date()
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    highlightSelected(defaultSelected) {

        if (defaultSelected.startsWith('/transaction/')) {
            defaultSelected = '/history';
        }
        else if (defaultSelected === '/') {
            defaultSelected = '/wallet';
        }
        else if (defaultSelected.startsWith('/peer/')) {
            defaultSelected = '/peers';
        }

        return defaultSelected;
    }

    render() {
        let props           = this.props;
        let defaultSelected = this.highlightSelected(props.location.pathname);
        return (<aside className={'navigation'} style={{
            height   : '100%',
            minHeight: '100vh'
        }}>
            <SideNav
                expanded={true}
                onToggle={() => {
                }}
                onSelect={(selected) => {
                    switch (selected) {
                        case 'lock':
                            props.lockWallet();
                            break;
                        case 'resetValidation':
                            break;
                        default:
                            props.history.push(selected);
                    }
                }}
            >
                <div className="nav-utc_clock">
                    <span>{moment.utc(this.state.date).format('YYYY-MM-DD HH:mm:ss')} utc</span>
                </div>
                <SideNav.Nav
                    selected={defaultSelected}
                >
                    <NavItem key={'wallet'} eventKey="/wallet">
                        <NavText>
                            home
                        </NavText>
                    </NavItem>

                    <NavItem eventKey="transaction">
                        <NavText>
                            transactions <FontAwesomeIcon className={'icon'}
                                                          icon="chevron-down"
                                                          size="1x"/>
                            <FontAwesomeIcon className={'icon hidden'}
                                             icon="chevron-up"
                                             size="1x"/>
                        </NavText>
                        <NavItem key={'transaction-list'}
                                 eventKey="/transaction-list">
                            <NavText>
                                all
                            </NavText>
                        </NavItem>
                        <NavItem key={'unspent-transaction-output-list-pending'}
                                 eventKey="/unspent-transaction-output-list/pending">
                            <NavText>
                                pending unspent list
                            </NavText>
                        </NavItem>
                        <NavItem key={'unspent-transaction-output-list-stable'}
                                 eventKey={'/unspent-transaction-output-list/stable'}>
                            <NavText>
                                stable unspent list
                            </NavText>
                        </NavItem>
                    </NavItem>

                    {/*
                     <NavItem key={'log'} eventKey="/log">
                     <NavText>
                     logs
                     </NavText>
                     </NavItem>
                     */}
                    <NavItem key={'config'} eventKey="/config">
                        <NavText>
                            settings
                        </NavText>
                    </NavItem>
                    <NavItem key={'actions'} eventKey="/actions">
                        <NavText>
                            actions
                        </NavText>
                    </NavItem>


                    <NavItem eventKey="status">
                        <NavText>
                            status <FontAwesomeIcon className={'icon'}
                                                    icon="chevron-down"
                                                    size="1x"/>
                            <FontAwesomeIcon className={'icon hidden'}
                                             icon="chevron-up"
                                             size="1x"/>
                        </NavText>
                        <NavItem key={'status-summary'}
                                 eventKey="/status-summary">
                            <NavText>
                                summary
                            </NavText>
                        </NavItem>
                        <NavItem key={'peers'} eventKey="/peers">
                            <NavText>
                                peers
                            </NavText>
                        </NavItem>
                    </NavItem>


                    <NavItem eventKey="ads">
                        <NavText>
                            ads <FontAwesomeIcon className={'icon'}
                                                 icon="chevron-down"
                                                 size="1x"/>
                            <FontAwesomeIcon className={'icon hidden'}
                                             icon="chevron-up"
                                             size="1x"/>
                        </NavText>
                        <NavItem key={'ad-create'} eventKey="/ad-create">
                            <NavText>
                                create
                            </NavText>
                        </NavItem>
                        <NavItem key={'ad-list'} eventKey="/ad-list">
                            <NavText>
                                list
                            </NavText>
                        </NavItem>
                    </NavItem>

                    <NavItem eventKey="help">
                        <NavText>
                            help <FontAwesomeIcon className={'icon'}
                                                  icon="chevron-down"
                                                  size="1x"/>
                            <FontAwesomeIcon className={'icon hidden'}
                                             icon="chevron-up"
                                             size="1x"/>
                        </NavText>
                        <NavItem key={'faq'} eventKey="/faq">
                            <NavText>
                                faq
                            </NavText>
                        </NavItem>
                        <NavItem key={'report-issue'} eventKey="/report-issue">
                            <NavText>
                                report problem
                            </NavText>
                        </NavItem>
                    </NavItem>

                    <NavItem key={'lock'} eventKey="lock">
                        <NavText>
                            logout
                        </NavText>
                    </NavItem>
                </SideNav.Nav>
                <div className="nav-info">
                    <span>version {props.node.node_version}</span>
                </div>
            </SideNav>
        </aside>);
    }
}


export default connect(
    state => state,
    {lockWallet}
)(Sidebar);
