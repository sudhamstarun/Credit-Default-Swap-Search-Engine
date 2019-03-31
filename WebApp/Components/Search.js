import React from 'react';
import _ from 'lodash';

const propTypes = {
    data: React.PropTypes.array.isRequired,
    onFilteredData: React.PropTypes.func.isRequired,
};

export default class Search extends React.Component {

        onChange(e) {
            const keywords = e.target.value.toLowerCase().split(' ');
            this.props.onFilteredData(_.filter(this.props.data, row => {
                const values = _.values(row);
                const words = _.join(values, ' ').toLowerCase();
                return _.every(keywords, keyword => _.includes(words, keyword));
            }));
        }

        render() {
            return ( < div >
                <
                input className = "form-control"
                placeholder = "Enter a Keyword, City, or State"
                onChange = {
                    this.onChange.bind(this)
                }
                /> <
                /div>);
            }
        }

        Search.propTypes = propTypes;
