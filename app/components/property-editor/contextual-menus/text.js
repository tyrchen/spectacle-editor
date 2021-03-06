import React, { Component } from "react";
import styles from "../index.css";
import { autorun } from "mobx";
import { map, omit, find } from "lodash";
import {
  Alignment,
  ColorPicker,
  Incrementer,
  List,
  LinkTo,
  Option,
  Select,
  UpdateHeading
} from "../editor-components/index.js";
import { ElementTypes } from "../../../constants";
import { FontMap } from "../../../font-settings";

export default class TextMenu extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = { currentElement: null };
  }

  componentDidMount() {
    autorun(() => {
      const { currentElement } = this.context.store;

      window.clearTimeout(this.stateTimeout);

      if (!currentElement) {
        this.stateTimeout = window.setTimeout(() => {
          this.setState({ currentElement });
        }, 400);

        return;
      }

      if (currentElement.type === ElementTypes.TEXT) {
        this.setState({ currentElement });
      }
    });
  }

  handleFontFamily = (value, properties) => {
    const { currentElement } = this.context.store;

    if (!currentElement || !properties) {
      return;
    }

    if (properties.style.fontFamily !== currentElement.props.style.fontFamily) {
      this.updateCurrentElementStyles(currentElement, {
        ...properties.style,
        fontWeight: 400,
        fontStyle: "normal"
      });
    }
  }

  handleFontStyles = (value, properties) => {
    const { currentElement } = this.context.store;

    if (properties && currentElement) {
      const { currentWeight, currentStyle } = currentElement.props.style;
      const { fontWeight, fontStyle } = properties.style;

      if (fontWeight !== currentWeight || fontStyle !== currentStyle) {
        this.updateCurrentElementStyles(currentElement, omit(properties.style, "fontFamily"));
      }
    }
  }

  updateCurrentElementStyles = (currentElement, style) => {
    const oldStyles = currentElement.props.style;

    this.context.store.updateElementProps({
      style: { ...oldStyles, ...style }
    });
  }

  render() {
    const { currentElement } = this.state;
    const styleProps = currentElement && currentElement.props.style;
    let currentStyles;

    if (currentElement) {
      currentStyles = find(FontMap[styleProps.fontFamily].styles, {
        fontWeight: styleProps.fontWeight,
        fontStyle: styleProps.fontStyle
      });
    }

    return (
      <div className={styles.wrapper}>
        {
          currentElement &&
          (
          <div>
            <h3 className={styles.heading}>Text</h3>
            <hr className={styles.hr} />
            <div className={styles.row}>
              <div className={styles.subHeading}>
                Paragraph Styles
              </div>
              <div>
                <Select
                  selectName="FontType"
                  placeholderText="Heading 1"
                  defaultValue="Heading 1"
                  currentOptionClassName={styles.select}
                >
                  {map(["Heading 1", "Heading 2"], (heading, i) => (
                    <Option
                      key={i}
                      value={heading}
                    >
                        {heading}
                    </Option>
                    )
                  )}
                </Select>
              </div>
            </div>
            <div>
              <div className={styles.breakHr}>
                <div className={styles.breakTitle}>HEADING 1</div>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.subHeading}>
                Font
              </div>
              <div>
                <Select
                  onChange={this.handleFontFamily}
                  selectName="FontType"
                  placeholderText={FontMap[styleProps.fontFamily].name}
                  defaultValue={FontMap[styleProps.fontFamily].name}
                  currentOptionClassName={styles.select}
                >
                  {map(FontMap, (fontObj, fontFamily) => (
                    <Option
                      key={fontFamily}
                      value={fontObj.name}
                      style={{ fontFamily }}
                    >
                        {fontObj.name}
                    </Option>
                    )
                  )}
                </Select>
              </div>
            </div>
            <div className={styles.flexrow}>
              <Select
                onChange={this.handleFontStyles}
                selectName="FontStyle"
                defaultValue={currentStyles && currentStyles.name}
                currentOptionClassName={styles.selectNarrow}
              >
                {map(FontMap[styleProps.fontFamily].styles, (stylesObj, index) => {
                  const cleanedStylesObj = omit(stylesObj, "name");
                  cleanedStylesObj.fontFamily = styleProps.fontFamily;

                  return (
                    <Option
                      key={index}
                      value={stylesObj.name}
                      style={ cleanedStylesObj }
                    >
                      {stylesObj.name}
                    </Option>
                  );
                })}
              </Select>
              <Incrementer
                currentElement={this.state.currentElement}
                propertyName={"fontSize"}
              />
            </div>
            <div className={styles.subHeading}>
              Color
            </div>
            <div className={styles.row}>
              <ColorPicker currentElement={this.state.currentElement} />
            </div>
            <div className={styles.rowAlt}>
              <div className={styles.subHeading}>
                Alignment
              </div>
              <Alignment
                currentElement={this.state.currentElement}
              />
            </div>
            <div className={styles.rowAlt}>
              <UpdateHeading />
            </div>
            <hr className={`${styles.hr} ${styles.hrList}`} />
            <div className={styles.row}>
              <div className={styles.subHeading}>
                List
              </div>
              <List
                currentElement={this.state.currentElement}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.subHeading}>
                Link
              </div>
              <LinkTo />
            </div>
          </div>
        )}
      </div>
    );
  }
}
