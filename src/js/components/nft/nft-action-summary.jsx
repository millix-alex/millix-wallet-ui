import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Button, Col, OverlayTrigger, Popover, Form} from 'react-bootstrap';
import {connect} from 'react-redux';
import ModalView from '../utils/modal-view';
import * as format from '../../helper/format';
import * as text from '../../helper/text';
import {changeLoaderState} from '../loader';
import Transaction from '../../common/transaction';
import {TRANSACTION_DATA_TYPE_ASSET, TRANSACTION_DATA_TYPE_NFT, TRANSACTION_DATA_TYPE_TRANSACTION} from '../../../config';
import API from '../../api';


class NftActionSummaryView extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            nft_data                    : props.nft_data,
            modal_show_burn_confirmation: false,
            modal_show_burn_result      : false,
            modal_burn_create_asset     : true,
            modal_body_burn_result      : [],
            burned_nft_kept_as_asset    : true,
            view_link                   : props.view_link,
            src                         : props.nft_data.src,
            name                        : props.nft_data.name
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.nft_data !== this.props.nft_data) {
            this.setState({
                nft_data: this.props.nft_data,
                src     : this.props.nft_data?.src,
                name    : this.props.nft_data?.name
            });
            console.log(this.props.nft_data);
        }

        if (prevProps.view_link !== this.props.view_link) {
            this.setState({
                view_link: this.props.view_link
            });
        }
    }

    getBurnModalNftName() {
        let result = '';
        const name = this.state.name;

        if (name) {
            result = <b> "{name}"</b>;
        }

        return result;
    }

    doNftBurn() {
        const keepAsAsset = this.state.modal_burn_create_asset;

        changeLoaderState(true);
        let transaction_output_payload = this.prepareTransactionOutputToBurnNft(this.state.nft_data, keepAsAsset);
        const newState                 = {
            modal_show_burn_result      : true,
            modal_show_burn_confirmation: false,
            modal_burn_create_asset     : true,
            burned_nft_kept_as_asset    : keepAsAsset
        };

        Transaction.sendTransaction(transaction_output_payload, true, false).then(() => {
            // this.reloadCollection(); // todo: either reload or redirect to collection
            this.setState(newState);
            changeLoaderState(false);
            this.props.history.push('/nft-collection');
        }).catch((error) => {
            this.setState({
                ...error,
                ...newState
            });
            changeLoaderState(false);
        });
    }

    cancelNftBurn() {
        this.setState({
            nft_data                    : undefined,
            modal_show_burn_confirmation: false,
            modal_burn_create_asset     : true
        });
    }

    prepareTransactionOutputToBurnNft(nft, keepAsAsset) {
        return {
            transaction_output_attribute: {
                name                 : nft.name,
                description          : nft.description,
                parent_transaction_id: nft.txid
            },
            transaction_data            : {
                file_hash        : nft.hash,
                attribute_type_id: 'Adl87cz8kC190Nqc'
            },
            transaction_data_type       : keepAsAsset ? TRANSACTION_DATA_TYPE_ASSET : TRANSACTION_DATA_TYPE_TRANSACTION,
            transaction_data_type_parent: TRANSACTION_DATA_TYPE_NFT,
            transaction_output_list     : [
                {
                    address_base          : this.props.wallet.address_key_identifier,
                    address_version       : this.props.wallet.address_key_identifier.startsWith('1') ? '0a0' : 'la0l',
                    address_key_identifier: this.props.wallet.address_key_identifier,
                    amount                : nft.amount
                }
            ],
            transaction_output_fee      : {
                fee_type: 'transaction_fee_default',
                amount  : 1000
            }
        };
    }

    getViewLink() {
        return this.state.view_link;
    }

    redirectToViewPage(nft_data) {
        this.props.history.push(this.getViewLink());
    }

    copyViewLink() {
        navigator.clipboard.writeText(this.getViewLink());
        this.setState({
            modal_show_copy_result: true
        });
    }

    render() {
        const popoverFocus = (
            <Popover id="popover-basic">
                <Popover.Header>
                    <div className={'page_subtitle'}>
                        nft actions
                    </div>
                </Popover.Header>
                <Popover.Body>
                    <div>
                        <Form.Group className="form-group">
                            <label>public preview link</label>
                            <Col className={'input-group'}>
                                <Form.Control type="text" value={this.getViewLink()} readOnly={true}/>
                                <button
                                    className="btn btn-outline-input-group-addon icon_only"
                                    type="button"
                                    onClick={() => this.copyViewLink()}
                                >
                                    <FontAwesomeIcon
                                        icon={'copy'}/>
                                </button>
                            </Col>
                        </Form.Group>
                        <div className="form-group">
                            <Button
                                variant="outline-default"
                                className={'w-100'}
                                onClick={() => this.setState({
                                    modal_show_burn_confirmation: true
                                })}>
                                <FontAwesomeIcon className="text-warning"
                                                 icon={'bomb'}/>burn
                            </Button>
                        </div>
                        <div className="form-group">
                            <Button
                                variant="outline-default"
                                className={'w-100'}
                                onClick={() => this.props.history.push('/nft-transfer', this.state.nft_data)}>
                                <FontAwesomeIcon icon={'arrow-right-arrow-left'}/>transfer
                            </Button>
                        </div>

                        <div>
                            <a href={this.state.src} target={'_blank'} className={'btn btn-outline-default w-100'}>
                                <FontAwesomeIcon icon={'eye'}/>raw image
                            </a>
                        </div>
                    </div>
                </Popover.Body>
            </Popover>
        );

        return (
            <>
                <OverlayTrigger
                    trigger={['click']}
                    placement="auto"
                    overlay={popoverFocus}
                >
                    <Button
                        variant="outline-default"
                        size={'xs'}
                        onClick={() => this.setState({
                            // todo: open popover
                        })}>
                        <FontAwesomeIcon icon={'caret-down'}/>actions
                    </Button>
                </OverlayTrigger>

                <ModalView
                    show={this.state.modal_show_burn_confirmation}
                    size={'lg'}
                    heading={'burn nft'}
                    on_accept={() => this.doNftBurn()}
                    on_close={() => this.cancelNftBurn()}
                    body={<div>
                        <div className="mb-3">
                            you are about to burn your nft {this.getBurnModalNftName()} and
                            unlock {format.millix(this.state.nft_data?.amount)} in your wallet
                            balance. you can keep a non-nft copy of this file as an asset.
                        </div>
                        <div className="mb-3"
                             style={{
                                 display      : 'flex',
                                 flexDirection: 'row'
                             }}><Form.Check type="checkbox" label="" checked={this.state.modal_burn_create_asset}
                                            onChange={e => this.setState({modal_burn_create_asset: e.target.checked})}/> preserve file as an
                            asset
                        </div>
                        {text.get_confirmation_modal_question()}
                    </div>}/>
                <ModalView
                    show={this.state.modal_show_burn_result}
                    size={'lg'}
                    on_close={() => {
                        this.setState({modal_show_burn_result: false});
                        this.props.history.push('/nft-collection');
                    }}
                    heading={'burn nft'}
                    body={<div>
                        your nft {this.getBurnModalNftName()} has been burned
                        successfully. {this.state.burned_nft_kept_as_asset && 'the file is now available as an asset.'}
                    </div>}/>
                <ModalView
                    show={this.state.modal_show_copy_result}
                    size={'lg'}
                    heading={'nft public preview link copied'}
                    on_close={() => this.setState({modal_show_copy_result: false})}
                    body={<div>
                        nft public preview link has been copied to clipboard
                    </div>}/>
            </>
        );
    }
}


NftActionSummaryView.propTypes = {
    nft_data: PropTypes.any
};

export default connect(
    state => ({
        wallet: state.wallet
    }), {})(withRouter(NftActionSummaryView));
