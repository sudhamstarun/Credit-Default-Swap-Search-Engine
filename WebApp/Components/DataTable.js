import React from 'react';
import styles from './DataTable.css';
import Linkify from 'react-linkify';

export default class DataTable extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                page: 0,
                wide: false,
            };
            this.resize = this.resize.bind(this);
            this.prevPage = this.prevPage.bind(this);
            this.nextPage = this.nextPage.bind(this);
        }

        componentDidMount() {
            window.addEventListener('resize', this.resize);
        }

        componentWillReceiveProps(nextProps) {
            if (this.props.values.length !== nextProps.values.length) {
                this.setState({
                    page: 0,
                });
            }
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.resize);
        }

        resize() {
            this.forceUpdate();
        }

        prevPage() {
            const prev = this.state.page - 1;
            this.setState({
                page: prev < 0 ? 0 : prev,
            });
        }

        nextPage() {
            const props = this.props;
            const limit = props.limit;
            const length = props.values.length;
            const page = this.state.page;
            const next = page + 1;

            this.setState({
                page: next >= Math.ceil(length / limit) ? page : next,
            });
        }

        render() {
                const props = this.props;
                const length = props.values.length;
                const limit = props.limit;
                const page = this.state.page;
                const start = page * limit;
                const end = start + limit;
                const values = props.values.slice(start, end);
                const columns = Object.keys(values[0] || {});
                const standardColumnWidth = 100;
                const wide = (columns.length * standardColumnWidth < window.innerWidth);

                return ( <
                        div >
                        <
                        table className = {
                            'table table-responsive ' + (wide ? styles.wide : styles.narrow)
                        } > {
                            (() => {
                                    if (wide) {
                                        return ( < thead >
                                            <
                                            tr > {
                                                columns.map((col, i) => < th key = {
                                                        i
                                                    } > {
                                                        col
                                                    } < /th>)} <
                                                    /tr> <
                                                    /thead>);
                                                }
                                                return undefined;
                                            })()
                                    }

                                    <
                                    tbody > {
                                        values.map((val, i) => ( <
                                                tr key = {
                                                    i
                                                } > {
                                                    columns.map((col, j) => ( <
                                                            td key = {
                                                                j
                                                            } >
                                                            <
                                                            Linkify > {
                                                                wide ? '' : < span > {
                                                                        col + ':'
                                                                    } < /span>} {val[col]} <
                                                                    /Linkify> <
                                                                    /td>
                                                            ))
                                                    } <
                                                    /tr>
                                                ))
                                        } <
                                        /tbody> <
                                        /table>

                                        <
                                        ul className = "pager" >
                                        <
                                        li className = {
                                            page === 0 ? 'disabled' : ''
                                        } >
                                        <
                                        a onClick = {
                                            this.prevPage
                                        } > Previous < /a> <
                                        /li> <
                                        li className = {
                                            page + 1 >= Math.ceil(length / limit) ? 'disabled' : 0
                                        } >
                                        <
                                        a onClick = {
                                            this.nextPage
                                        } > Next < /a> <
                                        /li> <
                                        /ul> <
                                        /div>
                                    );
                                }
                            }

                            DataTable.propTypes = {
                                limit: React.PropTypes.number.isRequired,
                                values: React.PropTypes.array.isRequired,
                            };
