/**
 * @format
 */

import 'react-native';
import React from 'react';
import Thing from '../components/thing/Thing';
import renderer from 'react-test-renderer';

it("renders correctly", () => {
  renderer.create(<Thing />);
});

it("renders a default thing if nothing is passed to it", () => {
  let tree = renderer.create(<Thing />).toJSON();
  expect(tree).toMatchSnapshot();
});

// renders a thing that’s passed to it (restructure?)
  // renders a completed thing if the thing is completed
  // uses the background color of the thing passed to it


// updates the thing when a new thing is gotten

// renders a CompleteButton

// updates notification schedule
  // if after 9am
    // schedule for tomorrow at 9am
  // if before 9am
    // if nothing completed
      // schedule for 9am today
    // if item completed
      // schedule for tomorrow at 9am

// opens an alert if device is shaken
// opens an alert if “I can’t do that thing today.” is tapped
// opens a “one thing a day” alert if device is shaken after item is completed.
// only allows one alert to be present at a time
