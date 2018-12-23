import React from 'react';
import classnames from 'classnames';
import Popup from './Popup';
import List from './List';
import uid from './lib/uid';

function getLabel (value, options = []) {
    const item = options.find(item => item.value === value);
    if (!item) {
        return null;
    }
    return item.alias || item.label
}
export default class Dropdown extends React.Component {

    static getDerivedStateFromProps(props, state) {
        if (props.defaultValue === undefined && props.value !== state.value) {
            return {
                value: props.value,
                buttonLabel: getLabel(props.value, props.options)
            }
        }
        return null;
    }

    constructor (props) {
        super();
        this.uncontrolled = props.defaultValue !== undefined;
        this.state = {
            value: null,
            buttonLabel: '',
            labelId: props.label ? uid('label') : null,
            buttonId: uid('button'),
            open: false,
            focusIndex: null,
            expanded: 'false'
        };

        if (!this.uncontrolled && !props.onChange) {
            console.error('A controlled List will need an `onChange` event')
        }
        this.id = uid('dropdown');
        this.onClose = this.onClose.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    getIcon () {
        if (this.props.getIcon) {
            return this.props.getIcon();
        }
        return <i className="material-icons react-icon">expand_more</i>
    }

    onOpen () {
        this.setState({ expanded: 'true' });
    }

    onClose () {
        this.setState({ expanded: 'false' });
    }

    onChange (value) {
        if (this.uncontrolled) {
            this.setState({
                buttonLabel: getLabel(value, this.props.options),
                value
            });
        }
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    render () {
        const { options = [], label, placeholder = 'Select One...', disabled } = this.props;
        const { buttonLabel, value, open, labelId, buttonId, expanded } = this.state;
        const content = buttonLabel || placeholder;
        const className = classnames({
            'react-dropdown': true,
            'has-placeholder': value === null || value === undefined,
            disabled
        });
        return (
            <div className={className}>
                {label && <label id={labelId} htmlFor={buttonId} key="label">{label}</label>}
                <div className="react-popup-container">
                    <button id={this.id} aria-expanded={expanded} disabled={disabled}>
                        <span>{content}</span>
                        {this.getIcon()}
                    </button>
                    <Popup
                        buttonId={this.id}
                        onOpen={this.onOpen}
                        onClose={this.onClose}
                        isMenu
                    >
                        <List
                            options={options}
                            onChange={this.onChange}
                            value={value}
                        />
                    </Popup>
                </div>
            </div>
        );
    }
}