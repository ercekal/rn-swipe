import React, {useState} from 'react';
import {
  Text,
  View,
  Animated,
  PanResponder
 } from 'react-native';

const Deck = ({data, renderCard}) => {
  const position = new Animated.ValueXY()
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({x: gesture.dx, y: gesture.dy})
    },
    onPanResponderRelease: () => {}
  })
  const [panResponderState, setPanResponderState] = useState(panResponder)
  const renderCards = () => {
    return data.map(item => {
      return renderCard(item)
    })
  }
 return (
    <Animated.View
      style={position.getLayout()}
      {...panResponderState.panHandlers}>
      {renderCards()}
    </Animated.View>
  )
}

export default Deck;
