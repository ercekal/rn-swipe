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

  function getCardStyle() {
    const rotate = position.x.interpolate({
      inputRange: [-500, 0 , 500],
      outputRange: ['-120deg', '0deg', '120deg']
    })
    return {
      ...position.getLayout(),
      transform: [{rotate}]
    }
  }
  const renderCards = () => {
    return data.map((item, index) => {
      if(index === 0) {
        return (
          <Animated.View
            key={item.id}
            style={getCardStyle()}
            {...panResponderState.panHandlers}>
            {renderCard(item)}
          </Animated.View>
        )
      }
      return renderCard(item)
    })
  }
 return (
    <View>
      {renderCards()}
    </View>
  )
}

export default Deck;
