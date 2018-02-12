import React, { Component } from 'react';
import clipboard from 'clipboard-js';
import iconSourceData from '../iconSourceData.json';
import LeftMenu from './LeftMenu';
import MainContent from './MainContent';
import TipDialog from './TipDialog';
import { getRandomString } from '../service';


class HKHFontAwesomeHelper extends Component {

    state = {
        displayedIconGroups: iconSourceData, // 右侧图标内容
        iconCollections: [ // 我的收藏、通用分类与自定义分类
            {
                code: 'all',
                title: '全部图标',
                icon: 'fa-tasks',
                deletable: false,
                renameable: false,
            },
            {
                code: 'mycollection',
                title: '我的收藏',
                icon: 'fa-shopping-cart',
                iconClassNames: [],
                deletable: false,
                renameable: false,
            },
        ],
        isTipOpen: false,
        tipText: '',
        activeCode: 'all',
    };


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
            displayedIconGroups: [newCollection],
            activeCode: code,
        }));
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
        const { iconClassNames } = iconCollections[index];
        if (iconClassNames.indexOf(iconClassName) === -1) {
            iconClassNames.push(iconClassName);
            this.setState({
                isTipOpen: true,
                tipText: `成功添加图标【${iconClassName}】`,
            });
        } else {
            this.setState({
                isTipOpen: true,
                tipText: `已添加图标【${iconClassName}】`,
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
        clipboard.copy(classNameStr);
        this.setState({
            isTipOpen: true,
            tipText: '复制成功',
        });
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
                <MainContent
                    iconCollections={this.state.iconCollections}
                    displayedIconGroups={this.state.displayedIconGroups}
                    handleIconAdd={this.handleIconAdd}
                    handleIconDelete={this.handleIconDelete}
                    handleCollectionAdd={this.handleCollectionAdd}
                    handleIconCopy={this.handleIconCopy}
                />
                <TipDialog isTipOpen={this.state.isTipOpen} tipText={this.state.tipText} />
            </div>
        );
    }
}

export default HKHFontAwesomeHelper;
