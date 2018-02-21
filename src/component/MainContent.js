import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class MainContent extends Component {

    static propTypes = {
        displayedIconGroups: PropTypes.array,
        iconCollections: PropTypes.array,
        handleIconAdd: PropTypes.func,
        handleIconDelete: PropTypes.func,
        handleCollectionAdd: PropTypes.func,
        handleIconCopy: PropTypes.func,
        activeCode: PropTypes.string,
    }

    static defaultProps = {
        displayedIconGroups: [],
        iconCollections: [],
        handleIconAdd: () => { },
        handleIconDelete: () => { },
        handleCollectionAdd: () => { },
        handleIconCopy: () => { },
        activeCode: 'all',
    }

    state = {}

    render() {
        const { displayedIconGroups, iconCollections } = this.props;
        const isAllIcons = displayedIconGroups.length > 1;
        const hasCustomCollection = iconCollections.length > 2;
        const customCollectionList = iconCollections.filter(item => item.code !== 'all' && item.code !== 'mycollection');

        return (
            <div className="main-content" id="main-content">
                <div className="top-block">
                    <div className="info-module">
                        <div className="info-module-block">
                            <div className="top-item">
                                <i className="fa fa-area-chart" />
                                访问量：1039029
                            </div>
                            <div className="top-item">
                                <i className="fa fa-envelope" />
                                agentKyle@foxmail.com
                            </div>
                            <div className="top-item">
                                <i className="fa fa-book" />
                                使用说明
                            </div>
                        </div>
                        <div className="info-module-block">
                            <div className="top-item">
                                <i className="fa fa-newspaper-o" />
                                广告：阿里巴巴国际站前端团队招聘，有意者请将简历投到我邮箱
                            </div>
                        </div>
                        <div className="info-module-block">
                            <div className="top-item">
                                <i className="fa fa-laptop" />
                                声明：本站开源（github搜索：FontAwesomeHelper）、免费；所有图标的版权归fontawesome
                            </div>
                        </div>
                    </div>
                    <div className="user-module">
                        <div className="user-info">
                            欢迎，胡凯赫
                            <div className="pop-dialog animated fadeInUp">
                                <button className="sign-out" title="注销">
                                    <i className="fa fa-sign-out" />
                                    注销
                                </button>
                            </div>
                        </div>
                        <button className="operation-btn" title="点此手动同步信息到云端">
                            <i className="fa fa-mixcloud" />
                        </button>
                    </div>
                </div>
                {
                    displayedIconGroups.map((displayedIconGroup, index) => (
                        <div
                            className={classnames({
                                'displayed-icon-group': true,
                                animated: index === 0,
                                fadeInRight: index === 0,
                            })}
                            key={displayedIconGroup.code}
                        >
                            <div className="group-title">
                                {displayedIconGroup.title}
                                {
                                    isAllIcons &&
                                    <button
                                        title={`将【${displayedIconGroup.title}】添加为图标集`}
                                        className="collect-group"
                                        onClick={() => { this.props.handleCollectionAdd(displayedIconGroup.title, displayedIconGroup.code); }}
                                    >
                                        <i className="fa fa-shopping-cart" />
                                    </button>
                                }
                            </div>
                            <ul className="icon-showcase">
                                {
                                    displayedIconGroup.iconClassNames.map(classNameStr => (
                                        <li
                                            className="icon-card"
                                            key={`item ${Math.random()}`}
                                            onClick={() => { this.props.handleIconCopy(classNameStr); }}
                                        >
                                            {
                                                !isAllIcons &&
                                                <div
                                                    className="icon-remove"
                                                    onClick={(event) => {
                                                        this.props.handleIconDelete(displayedIconGroup.code, classNameStr);
                                                        event.stopPropagation();
                                                    }}
                                                >
                                                    <i className="fa fa-close" />
                                                </div>
                                            }

                                            <div className="icon-snapshot">
                                                <i className={`fa ${classNameStr}`} />
                                            </div>
                                            <div className="icon-name" title={classNameStr}>{classNameStr}</div>
                                            <div
                                                className="icon-collect"
                                                onClick={(event) => {
                                                    this.props.handleIconAdd('mycollection', classNameStr);
                                                    event.stopPropagation();
                                                }}
                                            >
                                                <i className="fa fa-shopping-cart" />
                                                <ul className="icon-collection-list">
                                                    {
                                                        hasCustomCollection && customCollectionList.map((item) => {
                                                            if (item.code === this.props.activeCode) {
                                                                return null;
                                                            }
                                                            return (
                                                                <li
                                                                    key={item.code}
                                                                    onClick={(event) => {
                                                                        this.props.handleIconAdd(item.code, classNameStr);
                                                                        event.stopPropagation();
                                                                    }}
                                                                    title={item.title}
                                                                >
                                                                    {item.title}
                                                                </li>);
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    ))
                }
            </div>
        );
    }
}

export default MainContent;
