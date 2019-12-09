import React, { Component } from "react";
import { Text, TouchableOpacity, Share } from "react-native";

import { styles } from "./ShareButton.styles";
import { tracker } from "../../core/factory";

class ShareButton extends Component {
  constructor(props) {
    super(props);
  }

  onShare = async () => {
    try {
      const result = await Share.share(
        { title: 'Try the Something Good App',
          message: 'I just did something good. Check out the app that helped me remember to do it! https://somethinggood.app' },
        { 
          subject: 'Try the Something Good App',
          dialogTitle: 'Share Something Good' },
      );

      tracker.trackEvent("share_app", { result: result.action });

    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (<TouchableOpacity
      style={styles.shareButton}>
      <Text style={styles.shareButtonText}
        onPress={this.onShare}>
        Share the goodness
      </Text>
    </TouchableOpacity>);
  };
}

export default ShareButton;