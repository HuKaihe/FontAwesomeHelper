import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TopBar extends Component {

    static propTypes = {
        openSignupDialog: PropTypes.func,
        loginFailed: PropTypes.bool,
        hasLogin: PropTypes.bool,
        myname: PropTypes.string,
        visitAmount: PropTypes.number,
        login: PropTypes.func,
        logout: PropTypes.func,
        upload: PropTypes.func,
        download: PropTypes.func,

    }

    static defaultProps = {
        openSignupDialog: () => { },
        loginFailed: false,
        hasLogin: false,
        myname: '',
        visitAmount: 0,
        login: () => { },
        logout: () => { },
        upload: () => { },
        download: () => { },
    }

    state = {
        username: '',
        password: '',
    }

    setUsername = (event) => {
        this.setState({
            username: event.target.value,
        });
    }

    setPassword = (event) => {
        this.setState({
            password: event.target.value,
        });
    }

    render() {
        const {
            loginFailed,
            visitAmount,
            hasLogin,
            openSignupDialog,
            login,
            logout,
            upload,
            download,
            myname,
        } = this.props;
        const { username, password } = this.state;
        return (
            <div className="top-bar">
                <div className="info-module">
                    <img src="http://fontawesome.hukaihe.com/public/image/logo.png" alt="hkh logo" className="logo" />
                    <div className="info-module-block">
                        <div className="top-item">
                            <i className="fa fa-area-chart" />
                            访问量：{visitAmount}
                        </div>
                        <div className="top-item">
                            <i className="fa fa-envelope" />
                            agentKyle@foxmail.com
                        </div>
                        <div className="top-item">
                            <i className="fa fa-book" />
                            <a href="https://www.jianshu.com/p/59837ed1d10d" target="_blank" rel="noopener noreferrer">使用说明</a>
                        </div>
                    </div>
                    <div className="info-module-block">
                        <div className="top-item">
                            <i className="fa fa-bank" />
                            备案号：冀ICP备18005603号
                        </div>
                    </div>
                    <div className="info-module-block">
                        <div className="top-item">
                            <i className="fa fa-newspaper-o" />
                            广告：阿里巴巴国际站前端团队招聘，有意者请将简历投到我邮箱，恩言收
                        </div>
                    </div>
                    <div className="info-module-block">
                        <div className="top-item">
                            <i className="fa fa-laptop" />
                            声明：本站已开源（
                            <a href="https://github.com/HuKaihe/FontAwesomeHelper" target="_blank" rel="noopener noreferrer">
                                FontAwesomeHelper
                            </a>
                            ），所有图标的版权归
                            <a href="http://fontawesome.dashgame.com/" target="_blank" rel="noopener noreferrer">fontawesome</a>
                        </div>
                    </div>
                </div>
                <div className="user-module">
                    {
                        hasLogin ?
                            <div className="has-login">
                                <div className="user-info">
                                    欢迎，
                                    {myname}
                                </div>
                                <button className="operation" title="同步本地数据到云端" onClick={upload}>
                                    <i className="fa fa-upload" />
                                </button>
                                <button className="operation" title="同步云端数据到本地" onClick={download}>
                                    <i className="fa fa-cloud-download" />
                                </button>
                                <button className="operation" title="注销" onClick={logout}>
                                    <i className="fa fa-sign-out" />
                                </button>
                            </div>
                            :
                            <div className="has-not-login">
                                <input
                                    placeholder="用户名"
                                    className="text-input small"
                                    value={username}
                                    onChange={this.setUsername}
                                />
                                <input
                                    type="password"
                                    placeholder="密码"
                                    className="text-input small"
                                    value={password}
                                    onChange={this.setPassword}
                                />
                                <button
                                    className="btn"
                                    onClick={() => {
                                        login(username, password);
                                    }}
                                >
                                    登录
                                </button>
                                /
                                <button className="btn" onClick={openSignupDialog}>注册</button>
                                { loginFailed && <div className="animated bounceInLeft login-tip">用户名或密码错误</div> }
                            </div>
                    }

                </div>
            </div>
        );
    }

}

export default TopBar;
