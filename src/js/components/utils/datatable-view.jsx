import React, {Component} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import PropTypes from 'prop-types';
import {Dropdown} from 'primereact/dropdown';
import {Ripple} from 'primereact/ripple';
import {classNames} from 'primereact/utils';


class DatatableView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first      : 0,
            rows       : 50,
            currentPage: 1
        };

        this.onCustomPage = this.onCustomPage.bind(this);

    }

    onCustomPage(event) {
        this.setState({
            first: event.first,
            rows : event.rows
        });
    }

    getPaginatorTemplate() {
        return {
            layout               : 'RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
            'PrevPageLink'       : (options) => {
                return (
                    <button type="button" className={options.className}
                            onClick={options.onClick}
                            disabled={options.disabled}>
                        <span className="p-p-3">previous</span>
                        <Ripple/>
                    </button>
                );
            },
            'NextPageLink'       : (options) => {
                return (
                    <button type="button" className={options.className}
                            onClick={options.onClick}
                            disabled={options.disabled}>
                        <span className="p-p-3">next</span>
                        <Ripple/>
                    </button>
                );
            },
            'PageLinks'          : (options) => {
                if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
                    const className = classNames(options.className, {'p-disabled': true});

                    return <span className={className}
                                 style={{userSelect: 'none'}}>...</span>;
                }

                return (
                    <button type="button" className={options.className}
                            onClick={options.onClick}>
                        {options.page + 1}
                        <Ripple/>
                    </button>
                );
            },
            'RowsPerPageDropdown': (options) => {
                const dropdownOptions = [
                    {
                        label: 10,
                        value: 10
                    },
                    {
                        label: 50,
                        value: 50
                    },
                    {
                        label: 100,
                        value: 100
                    },
                    {
                        label: 'all',
                        value: options.totalRecords
                    }
                ];

                return <div className={'paginator-dropdown-wrapper'}>show<Dropdown value={options.value} options={dropdownOptions}
                                 onChange={options.onChange}/>records</div>;
            }
        };
    }

    render() {
        const column = [];
        this.props.resultColumn.forEach((item, index) => {
            column.push(<Column
                key={index}
                field={item.field}
                header={item.header}
                sortable={item.sortable}/>);
        });

        return (
            <DataTable value={this.props.value}
                       paginator
                       paginatorTemplate={this.getPaginatorTemplate()}
                       first={this.state.first}
                       rows={this.state.rows}
                       onPage={this.onCustomPage}
                       paginatorClassName="p-jc-end"


                       stripedRows
                       showGridlines
                       resizableColumns
                       columnResizeMode="fit"
                       sortField={this.props.sortField}
                       sortOrder={this.props.sortOrder}
                       responsiveLayout="scroll">
                {column}
            </DataTable>
        );
    }
}


DatatableView.propTypes = {
    value       : PropTypes.array.isRequired,
    resultColumn: PropTypes.array.isRequired,
    sortField   : PropTypes.string,
    sortOrder   : PropTypes.number
};


export default DatatableView;
