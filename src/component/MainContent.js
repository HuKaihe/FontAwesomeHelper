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
    }

    static defaultProps = {
        displayedIconGroups: [],
        iconCollections: [],
        handleIconAdd: () => { },
        handleIconDelete: () => { },
        handleCollectionAdd: () => { },
        handleIconCopy: () => { },
    }

    state = {}

    render() {
        const { displayedIconGroups, iconCollections } = this.props;
        const isAllIcons = displayedIconGroups.length > 1;
        const hasCustomCollection = iconCollections.length > 2;
        const customCollectionList = iconCollections.filter(item => item.code !== 'all' && item.code !== 'mycollection');

        return (
            <div className="main-content">
                <div className="top-block">
                    <div className="quick-search">
                        <input className="text-input" type="text" placeholder="根据图标名快速查找图标" />
                        <i className="search-icon fa fa-search" />
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
                                                        hasCustomCollection && customCollectionList.map(item => (
                                                            <li
                                                                key={item.code}
                                                                onClick={(event) => {
                                                                    this.props.handleIconAdd(item.code, classNameStr);
                                                                    event.stopPropagation();
                                                                }}
                                                                title={item.title}
                                                            >
                                                                {item.title}
                                                            </li>))
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
