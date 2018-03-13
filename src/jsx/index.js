import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clipboard from 'clipboard-js';

import LeftMenu from './LeftMenu';
import MainContent from './MainContent';
import TopBar from './TopBar';
import TipDialog from './TipDialog';
import SignupDialog from './SignupDialog';
import { getRandomString, post } from '../service';

import iconSourceData from '../iconSourceData.json';
import defaultSchema from '../defaultSchema';

class HKHFontAwesomeHelper extends Component {

    static propTypes = {
        visitAmount: PropTypes.number,
    }

    static defaultProps = {
        visitAmount: 0,
    }

    state = {
        displayedIconGroups: iconSourceData, // 右侧图标内容
        iconCollections: defaultSchema,
        isTipOpen: false,
        tipText: '',
        activeCode: 'all',
        hasLogin: false,
        isSignupDialogOpen: false,
        loginFailed: false,
        username: '',
        isUsernameNotPass: false,
    };

    componentWillMount = () => {

        // 用户在登录的状态下，获取从服务器渲染得到的myData
        if (window.myData.id) {
            const { username, schemastr, id } = window.myData;
            this.setState({
                hasLogin: true,
                iconCollections: JSON.parse(schemastr),
                username,
                id,
            });
            return;
        }

        // 用户未登录的状态下，获取存储在本地的userData
        const userDataStr = localStorage.getItem('userData');
        const userData = JSON.parse(userDataStr);
        if (userData) {
            this.setState({
                iconCollections: userData,
            });
        }
    }

    componentDidUpdate = () => {
        let localInterval;
        let remoteInterval;
        // 如果用户登录成功，则同步到云端；否则，只保存到本地
        if (this.state.hasLogin) {
            remoteInterval = setInterval(this.asyncRemoteData, 3000);
            clearInterval(localInterval);
        } else {
            localInterval = setInterval(this.asyncLocalData, 3000);
            clearInterval(remoteInterval);
        }
    }

    // 通用函数
    showTip = (tipText) => {
        this.setState({
            isTipOpen: true,
            tipText,
        });
    }

    // 用户管理
    login = (username, password) => {
        if (!username || !password) {
            return;
        }

        post('/login', { username, password })
            .then(({ data }) => {
                // 登录失败，显示提示语
                if (!data.id) {
                    this.setState({
                        loginFailed: true,
                        isSignupDialogOpen: false,
                    });
                    return;
                }
                const { id, schemastr } = data;
                const schema = JSON.parse(schemastr);
                this.setState({
                    loginFailed: false,
                    hasLogin: true,
                    iconCollections: schema,
                    username,
                    id,
                    isUsernameNotPass: false,
                    isSignupDialogOpen: false,
                });
                this.handleCollectionSelect('all');
            });
    }

    asyncData = (iconCollectionsStr) => {
        if (this.state.hasLogin) {
            post('/asyncData', {
                schemastr: iconCollectionsStr,
                id: this.state.id,
            });
        }
    }

    asyncLocalData = () => {
        if (this.state.hasLogin) {
            return;
        }
        const { iconCollections } = this.state;
        const iconCollectionsStr = JSON.stringify(iconCollections);
        if (localStorage.getItem('userData') === iconCollectionsStr) {
            return;
        }
        localStorage.setItem('userData', iconCollectionsStr);
        // this.showTip('保存信息到本地成功');
    }

    asyncRemoteData = () => {
        if (!this.state.hasLogin) {
            return;
        }
        const { iconCollections } = this.state;
        const iconCollectionsStr = JSON.stringify(iconCollections);
        if (sessionStorage.getItem('userData') === iconCollectionsStr) {
            return;
        }
        this.asyncData(iconCollectionsStr);
        sessionStorage.setItem('userData', iconCollectionsStr);
        // this.showTip('保存信息到云端成功');
    }

    openSignupDialog = () => {
        this.setState({
            isSignupDialogOpen: true,
        });
    }

    closeSignupDialog = () => {
        this.setState({
            isSignupDialogOpen: false,
        });
    }

    logout = () => {
        post('/logout').then(({ code }) => {
            if (code === 200) {
                const iconCollectionsStr = localStorage.getItem('userData');
                this.setState({
                    hasLogin: false,
                    iconCollections: JSON.parse(iconCollectionsStr),
                });
                this.handleCollectionSelect('all');
            }
        });
    }

    upload = () => {
        if (!this.state.hasLogin) {
            return;
        }
        const iconCollectionsStr = localStorage.getItem('userData');
        const iconCollections = JSON.parse(iconCollectionsStr);
        this.asyncData(iconCollectionsStr);
        sessionStorage.setItem('userData', iconCollectionsStr);
        this.setState({
            iconCollections,
        });
        this.handleCollectionSelect('all');
        this.showTip('同步本地信息到云端成功');
    }

    download = () => {
        if (!this.state.hasLogin) {
            return;
        }
        const { iconCollections } = this.state;
        const iconCollectionsStr = JSON.stringify(iconCollections);
        localStorage.setItem('userData', iconCollectionsStr);
        this.showTip('同步云端信息到本地成功');
    }

    signup = (username, password, email) => {
        post('/signup', {
            username,
            password,
            email,
            schemastr: JSON.stringify(defaultSchema),
        }).then(({ code, data }) => {
            // 登录失败，显示提示语
            if (code === 400) {
                this.setState({
                    isUsernameNotPass: true,
                });
                return;
            }
            const { id } = data;
            this.setState({
                loginFailed: false,
                hasLogin: true,
                iconCollections: defaultSchema,
                isSignupDialogOpen: false,
                isUsernameNotPass: false,
                username,
                id,
            });
            this.handleCollectionSelect('all');
        });
    }

    // 对图标集合的操作
    handleCollectionAdd = (customName, type) => {

        const code = getRandomString();
        let iconClassGroup;

        if (type) {
            const index = iconSourceData.findIndex(item => item.code === type);
            iconClassGroup = iconSourceData[index];
        }

        const { iconClassNames = [] } = iconClassGroup || {};
        const newCollection = {
            code,
            title: customName,
            icon: iconClassNames[0],
            iconClassNames,
            deletable: true,
            renameable: true,
        };

        this.setState(pre => ({
            iconCollections: [...pre.iconCollections, newCollection],
            isTipOpen: true,
            tipText: `成功添加图标集【${customName}】`,
        }));

        // if (type) {
        //     this.setState({
        //         displayedIconGroups: [newCollection],
        //         activeCode: code,
        //     });
        // }
    }


    handleCollectionSelect = (code) => {

        if (code === 'all') {
            this.setState({
                displayedIconGroups: iconSourceData,
                activeCode: 'all',
                isTipOpen: false,
            });
            return;
        }

        const { iconCollections } = this.state;
        const iconCollection = iconCollections.find(item => item.code === code);
        this.setState({
            displayedIconGroups: [iconCollection],
            isTipOpen: false,
            activeCode: code,
        });
    }

    handleCollectionDelete = (code) => {
        const { iconCollections } = this.state;
        const index = iconCollections.findIndex(item => item.code === code);
        const collectionName = iconCollections[index].title;
        iconCollections.splice(index, 1);
        if (this.state.activeCode === code) {
            this.setState({
                displayedIconGroups: iconSourceData,
            });
        }
        this.setState({
            isTipOpen: true,
            tipText: `成功删除图标集【${collectionName}】`,
        });
    }

    handleCollectionRename = (newName, code) => {
        const { iconCollections } = this.state;
        const iconCollection = iconCollections.find(item => item.code === code);
        iconCollection.title = newName;
        this.setState({
            displayedIconGroups: [iconCollection],
            isTipOpen: true,
            tipText: '名称修改成功',
        });
    }

    handleCollectionRank = (newIndex, code) => {
        const { iconCollections } = this.state;
        const index = iconCollections.findIndex(item => item.code === code);
        const iconCollection = iconCollections.find(item => item.code === code);
        iconCollections.splice(index, 1);
        iconCollections.splice(newIndex, 0, iconCollection);
        this.setState({
            isTipOpen: true,
            tipText: '顺序修改成功',
        });
    }

    // 对图标的操作
    handleIconAdd = (code, iconClassName) => {
        const { iconCollections } = this.state;
        const index = iconCollections.findIndex(item => item.code === code);
        const { iconClassNames, title } = iconCollections[index];
        if (iconClassNames.indexOf(iconClassName) === -1) {
            this.setState({
                isTipOpen: true,
                tipText: `成功添加图标【${iconClassName}】到【${title}】`,
            });
            iconClassNames.push(iconClassName);
        } else {
            this.setState({
                isTipOpen: true,
                tipText: `【${title}】已存在图标【${iconClassName}】`,
            });
        }
    }

    handleIconDelete = (code, iconClassName) => {
        const { iconCollections } = this.state;
        const index = iconCollections.findIndex(item => item.code === code);
        if (index === -1) {
            return;
        }
        iconCollections[index].iconClassNames = iconCollections[index].iconClassNames.filter(item => item !== iconClassName);
        this.setState({
            displayedIconGroups: [iconCollections[index]],
            isTipOpen: true,
            tipText: `成功删除图标【${iconClassName}】`,
        });
    }

    handleIconCopy = (classNameStr) => {
        this.setState({
            isTipOpen: true,
            tipText: '已复制到剪贴板',
        });
        clipboard.copy(classNameStr);
    }

    handleIconSearch = (event) => {
        const content = event.target.value;

        if (!content) {
            this.setState({
                displayedIconGroups: iconSourceData,
            });
            return;
        }


        const reg = new RegExp(content, 'g');
        let result = [];


        iconSourceData.forEach((item) => {
            result = result.concat(item.iconClassNames.filter(classNameStr => reg.exec(classNameStr)));
        });

        this.setState({
            displayedIconGroups: [{
                iconClassNames: result,
                title: '查找结果',
                code: 'search',
            }],
            activeCode: 'all',
            isTipOpen: false,
        });
    }

    render() {
        return (
            <div className="container">
                <LeftMenu
                    iconCollections={this.state.iconCollections}
                    activeCode={this.state.activeCode}
                    handleCollectionSelect={this.handleCollectionSelect}
                    handleCollectionAdd={this.handleCollectionAdd}
                    handleCollectionDelete={this.handleCollectionDelete}
                    handleCollectionActive={this.handleCollectionActive}
                    handleCollectionRename={this.handleCollectionRename}
                    handleCollectionRank={this.handleCollectionRank}
                    handleIconSearch={this.handleIconSearch}
                />
                <div className="page-left" id="page-left">
                    <TopBar
                        visitAmount={this.props.visitAmount}
                        myname={this.state.username}
                        hasLogin={this.state.hasLogin}
                        loginFailed={this.state.loginFailed}
                        openSignupDialog={this.openSignupDialog}
                        upload={this.upload}
                        download={this.download}
                        login={this.login}
                        logout={this.logout}
                    />
                    <MainContent
                        activeCode={this.state.activeCode}
                        iconCollections={this.state.iconCollections}
                        displayedIconGroups={this.state.displayedIconGroups}
                        handleIconAdd={this.handleIconAdd}
                        handleIconDelete={this.handleIconDelete}
                        handleCollectionAdd={this.handleCollectionAdd}
                        handleIconCopy={this.handleIconCopy}
                    />
                </div>
                <TipDialog isTipOpen={this.state.isTipOpen} tipText={this.state.tipText} />
                <div className="to-top" onClick={() => { document.getElementById('page-left').scrollTop = 0; }}>
                    <i className="fa fa-chevron-up" />
                </div>
                <SignupDialog
                    isSignupDialogOpen={this.state.isSignupDialogOpen}
                    closeSignupDialog={this.closeSignupDialog}
                    signup={this.signup}
                    isUsernameNotPass={this.state.isUsernameNotPass}
                />
            </div>
        );
    }
}

export default HKHFontAwesomeHelper;
