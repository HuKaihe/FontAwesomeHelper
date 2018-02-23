import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class LeftMenu extends Component {
    static propTypes = {
        iconCollections: PropTypes.array,
        activeCode: PropTypes.string,
        handleCollectionSelect: PropTypes.func,
        handleCollectionAdd: PropTypes.func,
        handleCollectionDelete: PropTypes.func,
        handleCollectionRename: PropTypes.func,
        handleCollectionRank: PropTypes.func,
        handleIconSearch: PropTypes.func,
    }

    static defaultProps = {
        iconCollections: [],
        activeCode: 'all',
        handleCollectionSelect: () => { },
        handleCollectionAdd: () => { },
        handleCollectionDelete: () => { },
        handleCollectionRename: () => { },
        handleCollectionRank: () => { },
        handleIconSearch: () => { },
    }

    state = {
        status: 'none',
        newCollectionName: '',
        renameCode: '',
        collectionNewName: '',
    }

    addNewCollection = () => {
        this.setState({
            status: 'new',
        });
        setTimeout(() => {
            this.newInput.focus();
        }, 100);
    }

    edit = (event) => {
        this.setState({
            newCollectionName: event.target.value.slice(0, 15),
        });
    }

    finishEdit = () => {
        const { newCollectionName } = this.state;
        this.setState({
            status: 'none',
            newCollectionName: '',
        });
        if (!newCollectionName) {
            return;
        }
        this.props.handleCollectionAdd(newCollectionName);
        this.setState({
            status: 'none',
            newCollectionName: '',
        });
    }

    renameCollection = (code) => {
        this.setState({
            renameCode: code,
        });
    }

    rename = (event) => {
        if (event.target.value === '') {
            this.setState({
                collectionNewName: ' ',
            });
            return;
        }
        this.setState({
            collectionNewName: event.target.value.slice(0, 15),
        });
    }

    finishRename = (code) => {
        const { collectionNewName } = this.state;
        this.setState({
            renameCode: '',
            collectionNewName: '',
        });
        if (!collectionNewName) {
            return;
        }
        this.props.handleCollectionRename(collectionNewName, code);
        this.setState({
            status: 'none',
            newCollectionName: '',
        });
    }

    startDrag = (code) => {
        this.draggingCode = code;
    }

    calculateIndex = (event, code) => {
        event.preventDefault();
        const index = this.props.iconCollections.findIndex(item => item.code === code);
        const mouseY = event.clientY;
        const target = event.currentTarget;
        const height = target.offsetHeight;
        const top = target.offsetTop;
        if (mouseY > (top + height / 2)) {
            this.newIndex = index + 1;
            return;
        }
        this.newIndex = index;
    }

    render() {

        const newCollectionCls = classnames({
            'new-collection': this.state.status === 'new',
            'no-new-collection': this.state.status === 'none',
        });

        return (
            <div className="left-menu">
                <div className="site-title">
                    HKH FontAwesome Helper
                    <div className="sub-title">您的FontAwesome图标管理专家</div>
                </div>
                <div className="quick-search">
                    <input
                        className="text-input"
                        type="text"
                        placeholder="根据图标名快速查找图标"
                        onChange={this.props.handleIconSearch}
                        onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                                this.props.handleIconSearch(e);
                            }
                        }}
                    />
                    <i className="search-icon fa fa-search" />
                </div>
                <ul className="icon-collections" onDrop={() => { this.props.handleCollectionRank(this.newIndex, this.draggingCode); }}>
                    {
                        this.props.iconCollections.map((item) => {

                            const collectionCls = classnames({
                                rename: this.state.renameCode === item.code,
                                'no-rename': this.state.renameCode !== item.code,
                                active: this.props.activeCode === item.code,
                            });
                            return (
                                <li
                                    title="双击可对自定义的集合重命名，拖拽可调整集合顺序"
                                    draggable
                                    onDragStart={() => { this.startDrag(item.code); }}
                                    onDragOver={(event) => { this.calculateIndex(event, item.code); }}
                                    className={collectionCls}
                                    key={item.code}
                                    onClick={() => {
                                        this.props.handleCollectionSelect(item.code);
                                    }}
                                    onDoubleClick={() => { if (item.renameable) { this.renameCollection(item.code); } }}
                                >
                                    {
                                        item.deletable &&
                                        <button
                                            className="remove-collection"
                                            onClick={(event) => {
                                                this.props.handleCollectionDelete(item.code);
                                                event.stopPropagation();
                                            }}
                                        >
                                            <i className="fa fa-trash" />
                                        </button>
                                    }
                                    <div className="collection-intro">
                                        <i className={`icon fa ${item.icon}`} />
                                        {item.title}
                                    </div>
                                    {
                                        item.renameable &&
                                        <div className="new-collection-form">
                                            <input
                                                value={this.state.collectionNewName || item.title}
                                                className="text-input new-collection-input"
                                                onChange={this.rename}
                                                onBlur={() => { this.finishRename(item.code); }}
                                                onKeyDown={(e) => {
                                                    if (e.keyCode === 13) {
                                                        this.finishRename(item.code);
                                                    }
                                                }}
                                            />
                                        </div>
                                    }

                                </li>
                            );
                        })
                    }
                    <li className={newCollectionCls} onClick={this.addNewCollection}>
                        <i className="fa fa-plus add-new-collection" />
                        <div className="new-collection-form">
                            <input
                                ref={(el) => { this.newInput = el; }}
                                value={this.state.newCollectionName}
                                className="text-input new-collection-input"
                                onChange={this.edit}
                                onBlur={this.finishEdit}
                                onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                        this.finishEdit();
                                    }
                                }}
                                placeholder="新的图标集合"
                            />
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}

export default LeftMenu;
