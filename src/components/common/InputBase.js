import { Component } from "react";
import PropTypes from "prop-types";
import audio from "../../utils/audio";

export default class InputBase extends Component {

    /** Init state */
    state = { classAnimation: '' };

    /**
     * Mounted component
     */
    componentDidMount() {
        this.inputRef.addEventListener('animationend', this.addEventAnimationEnd);
    }

    /**
     * Destroyed component
     */
    componentWillUnmount() {
        this.inputRef.removeEventListener('animationend', this.addEventAnimationEnd);
    }

    /**
     * Add Event
     */
    addEventAnimationEnd = () => {
        const { onChange } = this.props;
        this.setState({
            classAnimation: ''
        })
        onChange();
    }

    /**
     * Play animation
     */
    runAnimation = () => {
        this.setState({
            classAnimation: 'animated-btn'
        });
    }

    /**
     * Play audio
     */
    runAudio = () => {
        const isAudio = audio.getAudioLocal();
        if (isAudio) {
            new Audio(require('../../audios/sell3.mp3')).play();
        }
    }

    /**
     * Handler clicked button
     */
    handleOnChange = () => {
        const { disabled } = this.props;
        if (!disabled) {
            this.runAudio();
            this.runAnimation();
        }
    }

    static propTypes = {
        onChange: PropTypes.func
    };
}

InputBase.defaultProps = {
    onChange: (data) => {
        console.log(data)
    },
};