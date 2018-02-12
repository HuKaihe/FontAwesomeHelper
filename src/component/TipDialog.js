import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class TipDialog extends Component {

    static propTypes = {
        tipText: PropTypes.string,
        isTipOpen: PropTypes.bool,
    }

    static defaultProps = {
        tipText: '添加成功',
        isTipOpen: false,
    }

    state = {
        isTipOpen: false,
    }


    componentWillReceiveProps(props) {
        this.setState({
            isTipOpen: props.isTipOpen,
        });
        setTimeout(() => {
            this.setState({
                isTipOpen: false,
            });
        }, 800);
    }

    render() {
        const cls = classnames({
            isTipOpen: this.state.isTipOpen,
            fadeInUp: this.state.isTipOpen,
            'tip-dialog': true,
            animated: true,
        });
        return (
            <div className={cls}>
                {this.props.tipText}
            </div>
        );
    }
}

export default TipDialog;
