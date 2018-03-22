import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class SignupDialog extends Component {

    static propTypes = {
        signup: PropTypes.func,
        closeSignupDialog: PropTypes.func,
        isSignupDialogOpen: PropTypes.bool,
        isUsernameNotPass: PropTypes.bool,
    }

    static defaultProps = {
        signup: () => {},
        closeSignupDialog: () => {},
        isSignupDialogOpen: false,
        isUsernameNotPass: false,
    }

    state = {
        username: '',
        password: '',
        passwordEnsure: '',
        isPasswordEnsureNotPass: false,
        email: '',
        isEmailNotPass: false,
    }

    setUsername = (event) => {
        this.setState({
            username: event.target.value.slice(0, 20),
        });
    }

    setPassword = (event) => {
        this.setState({
            password: event.target.value,
        });
    }

    setPasswordEnsure = (event) => {
        const passwordEnsure = event.target.value;
        this.setState(pre => ({
            passwordEnsure,
            isPasswordEnsureNotPass: !(passwordEnsure === pre.password),
        }));
    }

    setEmail = (event) => {
        const email = event.target.value;
        const emailFormatReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g;
        this.setState({
            email,
            isEmailNotPass: !emailFormatReg.test(email),
        });
    }

    render() {
        const cls = classnames({
            isOpen: this.props.isSignupDialogOpen,
            bounceInDown: this.props.isSignupDialogOpen,
            'signup-dialog': true,
            animated: true,
        });

        const {
            username,
            password,
            passwordEnsure,
            email,
            isPasswordEnsureNotPass,
            isEmailNotPass,
        } = this.state;
        const {
            closeSignupDialog,
            signup,
            isUsernameNotPass,
        } = this.props;

        return (
            <div className={cls}>
                <button className="close" onClick={closeSignupDialog}><i className="fa fa-close" /></button>
                <div className="field">
                    <input
                        className={`text-input ${isUsernameNotPass ? 'error' : ''}`}
                        placeholder="用户名"
                        value={username}
                        onChange={this.setUsername}
                    />
                    {
                        isUsernameNotPass && <div className="signup-tip animated bounceInLeft">这个用户名已经有人用过了，请亲更换</div>
                    }
                </div>
                <div className="field">
                    <input
                        className="text-input"
                        placeholder="密码"
                        type="password"
                        value={password}
                        onChange={this.setPassword}
                    />
                    <input
                        className={`text-input ${isPasswordEnsureNotPass ? 'error' : ''}`}
                        placeholder="确认密码"
                        type="password"
                        value={passwordEnsure}
                        onChange={this.setPasswordEnsure}
                    />
                    {
                        isPasswordEnsureNotPass && <div className="signup-tip animated bounceInLeft">密码一旦设定不可更改，请亲一定保持两次密码一致</div>
                    }
                </div>
                <div className="field">
                    <input
                        className={`text-input ${isEmailNotPass ? 'error' : ''}`}
                        placeholder="邮箱"
                        value={email}
                        onChange={this.setEmail}
                    />
                    {
                        isEmailNotPass && <div className="signup-tip animated bounceInLeft">正确的邮箱格式是OO@OO.OO</div>
                    }
                </div>
                <button
                    className="btn"
                    onClick={() => {
                        if (isEmailNotPass || isPasswordEnsureNotPass || isEmailNotPass || !email || !username || !password) {
                            return;
                        }
                        signup(username, password, email);
                    }}
                >
                    确定
                </button>
            </div>
        );
    }
}

export default SignupDialog;
